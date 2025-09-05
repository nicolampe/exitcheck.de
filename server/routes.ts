import { Express, Request, Response, NextFunction } from "express";
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import * as path from "path";
import * as fs from "fs";
import { serveStatic, log } from "./vite";
import { storage } from "./storage";
import { z } from "zod";
import { 
  formAnswerSchema, 
  insertExitCalculatorResultSchema,
  insertExpertoCalculatorResultSchema,
  insertLeadSchema, 
  leadFormSchema, 
  leadSegmentEnum 
} from "@shared/schema";

/**
 * Interface für die Antworten des Experto-Bewertungsrechners
 */
interface ExpertoFormAnswers {
  industry: string;
  yearlyRevenue: number;
  lastThreeYearsProfit: number[];
  executiveSalary: number;
  debt: number;
  nonOperationalAssets: number;
  qualityFactors: Record<string, number>;
}

/**
 * Berechnet den Unternehmenswert nach der Everto-Methode
 * 
 * @param data Formularantworten mit finanz- und qualitätsbezogenen Daten
 * @returns Berechnetes Ergebnis mit Unternehmenswert und anderen Kennzahlen
 */
function calculateExpertoValuation(data: ExpertoFormAnswers) {
  // Laden der Multiplier aus der JSON-Datei
  const questionsDataPath = path.join(path.dirname(import.meta.url), "data", "experto_questions.json").replace('file:', '');
  const questionsData = JSON.parse(fs.readFileSync(questionsDataPath, "utf-8"));
  
  // Branchenspezifischen Multiplikator auswählen
  const multiplier = questionsData.multipliers[data.industry] || questionsData.multipliers.default;

  // Durchschnittlichen Gewinn der letzten 3 Jahre berechnen
  const avgProfit = data.lastThreeYearsProfit.reduce((sum, val) => sum + val, 0) / data.lastThreeYearsProfit.length;

  // Normalisiertes EBIT berechnen (inkl. Geschäftsführergehalt)
  const normalizedEBIT = avgProfit + data.executiveSalary;

  // Basis-Unternehmenswert berechnen
  let baseValue = normalizedEBIT * multiplier;

  // Qualitätsfaktoren berechnen (Premium/Discount)
  const qualityAdjustment = Object.values(data.qualityFactors).reduce((sum, factor) => sum + factor, 0);
  
  // Gesamtmultiplikator berechnen
  const adjustedMultiplier = multiplier * (1 + qualityAdjustment);
  
  // Endgültigen Unternehmenswert berechnen
  const adjustedValue = normalizedEBIT * adjustedMultiplier;
  
  // Enterprise Value berechnen (inkl. Schulden und nicht-betriebsnotwendigem Vermögen)
  const enterpriseValue = adjustedValue - data.debt + data.nonOperationalAssets;

  // Auf volle Tausender runden
  const roundedValue = Math.round(enterpriseValue / 1000) * 1000;

  // Ergebnis zurückgeben
  return {
    companyValue: roundedValue,
    industryMultiplier: multiplier,
    qualityAdjustment,
    adjustedMultiplier,
    baseValue: Math.round(baseValue / 1000) * 1000,
    normalizedEBIT: Math.round(normalizedEBIT),
    avgProfit: Math.round(avgProfit),
    netDebtEffect: Math.round((data.nonOperationalAssets - data.debt) / 1000) * 1000
  };
}

/**
 * Registriert alle API-Routen und erstellt einen WebSocket-Server
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Statische Dateien und Frontend werden später in index.ts serviert

  // API-Endpunkt für den Standard-Fragebogen
  app.get("/api/questionnaire", (req: Request, res: Response) => {
    try {
      const questionsDataPath = path.join(path.dirname(import.meta.url), "data", "questions.json").replace('file:', '');
      const questionsData = fs.readFileSync(questionsDataPath, "utf-8");
      res.json(JSON.parse(questionsData));
    } catch (error) {
      log(`Error loading questionnaire data: ${error}`, "api");
      res.status(500).json({ error: "Could not load questionnaire data" });
    }
  });

  // API-Endpunkt für den Experto-Fragebogen
  app.get("/api/experto/questionnaire", (req: Request, res: Response) => {
    try {
      const questionsDataPath = path.join(path.dirname(import.meta.url), "data", "experto_questions.json").replace('file:', '');
      const questionsData = fs.readFileSync(questionsDataPath, "utf-8");
      res.json(JSON.parse(questionsData));
    } catch (error) {
      log(`Error loading experto questionnaire data: ${error}`, "api");
      res.status(500).json({ error: "Could not load questionnaire data" });
    }
  });

  // Berechnung für den Experto-Rechner
  app.post("/api/experto/calculate", async (req: Request, res: Response) => {
    try {
      const { answers } = req.body;
      
      log(`Received experto calculation request: ${JSON.stringify(req.body)}`, "api");

      // Validiere die Antworten
      if (!answers) {
        log(`Invalid request: answers missing`, "api");
        return res.status(400).json({ 
          success: false, 
          error: "Keine Antworten übermittelt" 
        });
      }
      
      // Validiere, dass die notwendigen Felder vorhanden sind
      if (!answers.industry || 
          typeof answers.yearlyRevenue !== 'number' || 
          !Array.isArray(answers.lastThreeYearsProfit) || 
          answers.lastThreeYearsProfit.length !== 3 ||
          typeof answers.executiveSalary !== 'number' ||
          typeof answers.debt !== 'number' ||
          typeof answers.nonOperationalAssets !== 'number' ||
          !answers.qualityFactors) {
        
        log(`Invalid request: required fields missing or invalid: ${JSON.stringify(answers)}`, "api");
        return res.status(400).json({ 
          success: false, 
          error: "Ungültige oder unvollständige Daten" 
        });
      }

      const result = calculateExpertoValuation(answers);
      log(`Calculation successful: ${JSON.stringify(result)}`, "api");

      return res.json({
        success: true,
        result
      });
    } catch (error) {
      log(`Error calculating experto valuation: ${error}`, "api");
      return res.status(500).json({ 
        success: false, 
        error: "Fehler bei der Berechnung" 
      });
    }
  });

  // Abschließender Submit für den Experto-Rechner (mit Lead-Daten)
  app.post("/api/experto/submit", async (req: Request, res: Response) => {
    try {
      const { answers, leadData } = req.body;

      // Validiere die Lead-Daten
      let validatedLeadData;
      try {
        validatedLeadData = leadFormSchema.parse(leadData);
      } catch (error) {
        return res.status(400).json({ 
          success: false, 
          error: "Ungültige Kontaktdaten" 
        });
      }

      // Berechne das Ergebnis
      const result = calculateExpertoValuation(answers);

      // Speichere das Ergebnis in der Datenbank
      const calculatorResult = await storage.saveExpertoCalculatorResult({
        industry: answers.industry,
        yearlyRevenue: answers.yearlyRevenue,
        lastThreeYearsProfit: answers.lastThreeYearsProfit,
        executiveSalary: answers.executiveSalary,
        avgProfit: result.avgProfit,
        normalizedEBIT: result.normalizedEBIT,
        multiplier: result.adjustedMultiplier,
        qualityAdjustment: result.qualityAdjustment,
        baseValue: result.baseValue,
        companyValue: result.companyValue,
        answers: answers,
        qualityFactors: answers.qualityFactors,
        additionalData: JSON.stringify({
          ...answers,
          calculationDetails: result
        })
      });

      // Speichere die Lead-Daten
      const lead = await storage.saveLead({
        firstName: validatedLeadData.firstName,
        lastName: validatedLeadData.lastName,
        email: validatedLeadData.email,
        phone: validatedLeadData.phone,
        companyWebsite: validatedLeadData.companyWebsite,
        segment: "hot", // Experto-Leads bekommen direkt das "hot"-Label
        calculatorType: "experto",
        expertoResultId: calculatorResult.id
      });

      return res.json({
        success: true,
        result: calculatorResult
      });
    } catch (error) {
      log(`Error submitting experto calculation: ${error}`, "api");
      return res.status(500).json({ 
        success: false, 
        error: "Fehler beim Speichern der Daten" 
      });
    }
  });

  // Abrufen eines Experto-Ergebnisses
  app.get("/api/experto/result/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: "Ungültige Result-ID" 
        });
      }

      const result = await storage.getExpertoCalculatorResult(id);
      if (!result) {
        return res.status(404).json({ 
          success: false, 
          error: "Ergebnis nicht gefunden" 
        });
      }

      return res.json({
        success: true,
        result
      });
    } catch (error) {
      log(`Error fetching experto result: ${error}`, "api");
      return res.status(500).json({ 
        success: false, 
        error: "Fehler beim Abrufen des Ergebnisses" 
      });
    }
  });

  // API-Endpunkt für die Bewertung
  app.post("/api/calculate", async (req: Request, res: Response) => {
    try {
      const { answers } = req.body;
      
      log(`Received calculation request: ${JSON.stringify(req.body)}`, "api");
      
      // Validiere die Antworten
      let validatedAnswers;
      try {
        validatedAnswers = formAnswerSchema.parse(answers);
      } catch (error) {
        log(`Invalid request: ${error}`, "api");
        return res.status(400).json({ 
          success: false, 
          error: "Ungültige Fragebogenantworten" 
        });
      }

      // Lade den Bewertungsrechner
      const scoreCalculator = await import("./utils/scoreCalculator.js");
      const { calculateScore } = scoreCalculator;
      
      // Berechne das Ergebnis
      const result = calculateScore(validatedAnswers);
      
      if (!result) {
        log(`Calculation returned null or undefined`, "api");
        return res.status(500).json({
          success: false,
          error: "Fehler bei der Berechnung: Kein Ergebnis"
        });
      }

      log(`Calculation successful: ${JSON.stringify(result)}`, "api");
      return res.json({
        success: true,
        result
      });
    } catch (error) {
      log(`Error calculating score: ${error}`, "api");
      return res.status(500).json({ 
        success: false, 
        error: "Fehler bei der Berechnung" 
      });
    }
  });

  // API-Endpunkt für die Berechnung des Fragebogens
  app.post("/api/questionnaire/calculate", async (req: Request, res: Response) => {
    try {
      const { answers } = req.body;
      
      log(`Received questionnaire calculation request: ${JSON.stringify(req.body)}`, "api");
      
      // Validiere die Antworten
      let validatedAnswers;
      try {
        validatedAnswers = formAnswerSchema.parse(answers);
      } catch (error) {
        log(`Invalid request: ${error}`, "api");
        return res.status(400).json({ 
          success: false, 
          error: "Ungültige Fragebogenantworten" 
        });
      }

      // Lade den Bewertungsrechner
      const scoreCalculator = await import("./utils/scoreCalculator.js");
      const { calculateScore } = scoreCalculator;
      
      // Berechne das Ergebnis
      const result = calculateScore(validatedAnswers);
      
      if (!result) {
        log(`Calculation returned null or undefined`, "api");
        return res.status(500).json({
          success: false,
          error: "Fehler bei der Berechnung: Kein Ergebnis"
        });
      }

      log(`Calculation successful: ${JSON.stringify(result)}`, "api");
      return res.json({
        success: true,
        result
      });
    } catch (error) {
      log(`Error calculating score: ${error}`, "api");
      return res.status(500).json({ 
        success: false, 
        error: "Fehler bei der Berechnung" 
      });
    }
  });

  // API-Endpunkt für die Speicherung des Fragebogens und Lead-Daten
  app.post("/api/questionnaire/submit", async (req: Request, res: Response) => {
    try {
      const { answers, leadData } = req.body;
      
      log(`Received questionnaire submit request: ${JSON.stringify({ answers, leadData: { ...leadData, email: '***@***' } })}`, "api");
      
      // Validiere die Lead-Daten
      let validatedLeadData;
      try {
        validatedLeadData = leadFormSchema.parse(leadData);
      } catch (error) {
        log(`Invalid lead data: ${error}`, "api");
        return res.status(400).json({ 
          success: false, 
          error: "Ungültige Kontaktdaten" 
        });
      }
      
      // Lade den Bewertungsrechner
      const scoreCalculator = await import("./utils/scoreCalculator.js");
      const { calculateScore } = scoreCalculator;
      
      // Berechne das Ergebnis
      const result = calculateScore(answers);

      // Speichere das Ergebnis in der Datenbank
      const calculatorResult = await storage.saveCalculatorResult({
        readinessScore: result.readinessScore,
        scoreLabel: result.scoreLabel,
        scoreComment: result.scoreComment,
        valuationLow: result.valuationLow,
        valuationHigh: result.valuationHigh,
        potentialIncrease: result.potentialIncrease,
        urgency: result.urgency,
        industry: answers.q1 || "Unbekannt",
        revenueModel: answers.q5 || "Unbekannt",
        motivationTags: JSON.stringify(result.motivationTags),
        answers: JSON.stringify(answers)
      });

      // Speichere die Lead-Daten
      const lead = await storage.saveLead({
        firstName: validatedLeadData.firstName,
        lastName: validatedLeadData.lastName,
        email: validatedLeadData.email,
        phone: validatedLeadData.phone,
        companyWebsite: validatedLeadData.companyWebsite,
        segment: result.segment,
        resultId: calculatorResult.id,
        calculatorType: "standard"
      });

      log(`Lead saved successfully: ID=${lead.id}`, "api");
      
      return res.json({
        success: true,
        result: calculatorResult
      });
    } catch (error) {
      log(`Error submitting questionnaire: ${error}`, "api");
      return res.status(500).json({ 
        success: false, 
        error: "Fehler beim Speichern der Daten" 
      });
    }
  });
  
  // API-Endpunkt für die Speicherung des Ergebnisses und Lead-Daten
  app.post("/api/submit", async (req: Request, res: Response) => {
    try {
      const { answers, result, leadData } = req.body;
      
      // Validiere die Antworten und Lead-Daten
      let validatedLeadData;
      try {
        validatedLeadData = leadFormSchema.parse(leadData);
      } catch (error) {
        return res.status(400).json({ 
          success: false, 
          error: "Ungültige Kontaktdaten" 
        });
      }

      // Speichere das Ergebnis in der Datenbank
      const calculatorResult = await storage.saveCalculatorResult({
        readinessScore: result.score,
        scoreLabel: result.scoreLabel || "Unbekannt",
        scoreComment: result.scoreComment || "",
        valuationLow: result.valuationLow,
        valuationHigh: result.valuationHigh,
        potentialIncrease: result.potentialIncrease,
        urgency: result.urgency || "medium",
        industry: answers.q1 || "Unbekannt",
        revenueModel: answers.q5 || "Unbekannt",
        motivationTags: JSON.stringify(result.motivationTags || []),
        answers: JSON.stringify(answers)
      });

      // Speichere die Lead-Daten
      const lead = await storage.saveLead({
        firstName: validatedLeadData.firstName,
        lastName: validatedLeadData.lastName,
        email: validatedLeadData.email,
        phone: validatedLeadData.phone,
        companyWebsite: validatedLeadData.companyWebsite,
        segment: result.segment,
        calculatorType: "standard",
        resultId: calculatorResult.id
      });

      return res.json({
        success: true,
        result: calculatorResult
      });
    } catch (error) {
      log(`Error submitting questionnaire: ${error}`, "api");
      return res.status(500).json({ 
        success: false, 
        error: "Fehler beim Speichern der Daten" 
      });
    }
  });

  // Abrufen eines Fragebogens Ergebnisses
  app.get("/api/questionnaire/result/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: "Ungültige Result-ID" 
        });
      }

      const result = await storage.getCalculatorResult(id);
      if (!result) {
        return res.status(404).json({ 
          success: false, 
          error: "Ergebnis nicht gefunden" 
        });
      }

      return res.json({
        success: true,
        result
      });
    } catch (error) {
      log(`Error fetching questionnaire result: ${error}`, "api");
      return res.status(500).json({ 
        success: false, 
        error: "Fehler beim Abrufen des Ergebnisses" 
      });
    }
  });
  
  // Abrufen eines Ergebnisses
  app.get("/api/result/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: "Ungültige Result-ID" 
        });
      }

      const result = await storage.getCalculatorResult(id);
      if (!result) {
        return res.status(404).json({ 
          success: false, 
          error: "Ergebnis nicht gefunden" 
        });
      }

      return res.json({
        success: true,
        result
      });
    } catch (error) {
      log(`Error fetching result: ${error}`, "api");
      return res.status(500).json({ 
        success: false, 
        error: "Fehler beim Abrufen des Ergebnisses" 
      });
    }
  });

  // Emergency static fallback route - always available
  app.get("/static", (req: Request, res: Response) => {
    const staticHtmlPath = path.join(path.dirname(import.meta.url), "public", "fallback.html").replace('file:', '');
    res.sendFile(staticHtmlPath);
  });

  // Frontend für alle anderen Routen servieren (für client-side routing)
  // In der Entwicklungsumgebung (development) wird dies durch Vite überschrieben
  // Diese Route ist nur für die Produktion
  if (process.env.NODE_ENV !== "development") {
    app.get("*", (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith("/api/")) {
        return next();
      }
      res.sendFile(path.join(path.dirname(import.meta.url), "public", "index.html").replace('file:', ''));
    });
  }

  // HTTP-Server erstellen (ohne zu starten)
  const server = new Server(app);
  
  // WebSocket-Server einrichten
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    log('WebSocket client connected', 'ws');
    
    ws.on('message', (message: string) => {
      log(`Received message: ${message}`, 'ws');
      
      // Nachricht an alle verbundenen Clients senden
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
    
    ws.on('close', () => {
      log('WebSocket client disconnected', 'ws');
    });
  });
  
  return server;
}
