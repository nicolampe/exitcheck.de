var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/utils/scoreCalculator.ts
var scoreCalculator_exports = {};
__export(scoreCalculator_exports, {
  calculateScore: () => calculateScore
});
import fs2 from "fs";
import path3 from "path";
function loadQuestionData() {
  const questionsPath = path3.join(process.cwd(), "server/data/questions.json");
  const fileContent = fs2.readFileSync(questionsPath, "utf-8");
  return JSON.parse(fileContent);
}
function calculateScore(answers) {
  const questionData = loadQuestionData();
  const questions = questionData.questions;
  let totalScore = 0;
  let totalWeight = 0;
  let motivationTags = [];
  let urgency = "nurture";
  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === void 0 || answer === null) continue;
    const weight = question.score_weight || 1;
    totalWeight += weight;
    switch (question.type) {
      case "number":
        if (Number(answer) <= 0) {
          totalScore += 0;
        } else {
          const normalizedScore = Math.min(5, Math.log10(Number(answer) / 1e4) + 1);
          totalScore += normalizedScore * weight;
        }
        break;
      case "single-choice":
        let choiceValue = 1;
        if (typeof answer === "object" && "value" in answer) {
          choiceValue = answer.value;
        } else if (typeof answer === "string") {
          choiceValue = parseInt(answer) || 1;
        } else if (typeof answer === "number") {
          choiceValue = answer;
        }
        if (question.urgency && question.urgency[choiceValue.toString()]) {
          urgency = question.urgency[choiceValue.toString()];
        }
        const maxChoiceValue = question.options ? Math.max(...question.options.map((o) => typeof o === "object" && "value" in o ? o.value : 1)) : 4;
        const normalizedChoiceScore = choiceValue / maxChoiceValue * 5;
        totalScore += normalizedChoiceScore * weight;
        break;
      case "scale":
        let scaleValue = 1;
        if (typeof answer === "string") {
          scaleValue = parseInt(answer) || 1;
        } else if (typeof answer === "number") {
          scaleValue = answer;
        }
        const scaleMin = question.scale_min || 1;
        const scaleMax = question.scale_max || 5;
        const scaleRange = scaleMax - scaleMin;
        let normalizedScaleScore = (scaleValue - scaleMin) / scaleRange * 5;
        if (question.invert_score) {
          normalizedScaleScore = 5 - normalizedScaleScore;
        }
        totalScore += normalizedScaleScore * weight;
        break;
      case "multi-choice":
        if (Array.isArray(answer) && question.tags) {
          answer.forEach((selected) => {
            const tag = question.tags?.[selected];
            if (tag && !motivationTags.includes(tag)) {
              motivationTags.push(tag);
            }
          });
          const multiChoiceScore = answer.length / Object.keys(question.tags).length * 5;
          totalScore += multiChoiceScore * weight;
        }
        break;
      default:
        totalScore += 3 * weight;
        break;
    }
  }
  const finalScorePercentage = Math.round(totalScore / (totalWeight * 5) * 100);
  let scoreLabel = "";
  let scoreComment = "";
  for (const range in questionData.score_ranges) {
    const [min, max] = range.split("-").map(Number);
    if (finalScorePercentage >= min && finalScorePercentage <= max) {
      scoreLabel = questionData.score_ranges[range].label;
      scoreComment = questionData.score_ranges[range].comment;
      break;
    }
  }
  let segment = "nurture";
  if (finalScorePercentage >= 75) {
    if (urgency === "hot" || urgency === "warm") {
      segment = "hot";
    } else {
      segment = "warm";
    }
  } else if (finalScorePercentage >= 50) {
    if (urgency === "hot") {
      segment = "warm";
    } else if (urgency === "warm") {
      segment = "cold";
    } else {
      segment = "nurture";
    }
  } else {
    if (urgency === "hot") {
      segment = "cold";
    } else {
      segment = "nurture";
    }
  }
  const industry = answers.q1;
  let ebitda = parseInt(answers.q3) || 0;
  const ceoPay = parseInt(answers.q3b) || 0;
  const isCeoOwner = answers.q3c === true || answers.q3c === "true";
  if (isCeoOwner && ceoPay > 0) {
    ebitda += ceoPay;
    console.log(`Owner-CEO compensation added to EBITDA: ${ceoPay}. New EBITDA: ${ebitda}`);
  }
  let valuationLow = 0;
  let valuationHigh = 0;
  let potentialIncrease = 0;
  if (ebitda > 0 && industry) {
    const multiples = questionData.valuation_multiples[industry] || questionData.valuation_multiples["Andere"];
    const baseMultiple = multiples.base;
    const premiumMultiple = multiples.premium;
    const currentMultiple = baseMultiple + (premiumMultiple - baseMultiple) * (finalScorePercentage / 100);
    valuationLow = Math.round(ebitda * baseMultiple);
    valuationHigh = Math.round(ebitda * currentMultiple);
    potentialIncrease = Math.round(ebitda * premiumMultiple) - valuationHigh;
  }
  return {
    readinessScore: finalScorePercentage,
    scoreLabel,
    scoreComment,
    valuationLow,
    valuationHigh,
    potentialIncrease,
    urgency,
    segment,
    motivationTags
  };
}
var init_scoreCalculator = __esm({
  "server/utils/scoreCalculator.ts"() {
    "use strict";
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import * as path4 from "path";
import * as fs3 from "fs";

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/storage.ts
var MemStorage = class {
  results;
  expertoResults;
  leads;
  resultsCurrentId;
  expertoResultsCurrentId;
  leadsCurrentId;
  constructor() {
    this.results = /* @__PURE__ */ new Map();
    this.expertoResults = /* @__PURE__ */ new Map();
    this.leads = /* @__PURE__ */ new Map();
    this.resultsCurrentId = 1;
    this.expertoResultsCurrentId = 1;
    this.leadsCurrentId = 1;
  }
  // Standard-Rechner Methoden
  async saveCalculatorResult(insertResult) {
    const id = this.resultsCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const result = { ...insertResult, id, createdAt: now };
    this.results.set(id, result);
    return result;
  }
  async getCalculatorResult(id) {
    return this.results.get(id);
  }
  // Expert-Rechner Methoden
  async saveExpertoCalculatorResult(insertResult) {
    const id = this.expertoResultsCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const result = { ...insertResult, id, createdAt: now };
    this.expertoResults.set(id, result);
    return result;
  }
  async getExpertoCalculatorResult(id) {
    return this.expertoResults.get(id);
  }
  // Lead-Management Methoden
  async saveLead(insertLead) {
    const id = this.leadsCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const lead = {
      ...insertLead,
      id,
      createdAt: now,
      contacted: false,
      resultId: insertLead.resultId ?? null,
      expertoResultId: insertLead.expertoResultId ?? null,
      calculatorType: insertLead.calculatorType ?? null
    };
    this.leads.set(id, lead);
    return lead;
  }
  async getLead(id) {
    return this.leads.get(id);
  }
  async getAllLeads() {
    return Array.from(this.leads.values());
  }
  async markLeadAsContacted(id) {
    const lead = this.leads.get(id);
    if (!lead) return void 0;
    const updatedLead = { ...lead, contacted: true };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, doublePrecision, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var exitCalculatorResults = pgTable("exit_calculator_results", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  industry: text("industry").notNull(),
  readinessScore: integer("readiness_score").notNull(),
  scoreLabel: text("score_label").notNull(),
  scoreComment: text("score_comment").notNull(),
  valuationLow: doublePrecision("valuation_low").notNull(),
  valuationHigh: doublePrecision("valuation_high").notNull(),
  potentialIncrease: doublePrecision("potential_increase").notNull(),
  revenueModel: text("revenue_model").notNull(),
  answers: json("answers").notNull(),
  motivationTags: json("motivation_tags").notNull(),
  urgency: text("urgency").notNull()
});
var expertoCalculatorResults = pgTable("experto_calculator_results", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  industry: text("industry").notNull(),
  yearlyRevenue: doublePrecision("yearly_revenue").notNull(),
  lastThreeYearsProfit: json("last_three_years_profit").notNull(),
  // Array mit den letzten 3 Jahren EBIT
  executiveSalary: doublePrecision("executive_salary").notNull(),
  avgProfit: doublePrecision("avg_profit").notNull(),
  // Durchschnittlicher Gewinn der letzten 3 Jahre
  normalizedEBIT: doublePrecision("normalized_ebit").notNull(),
  // EBIT + Geschäftsführergehalt
  multiplier: doublePrecision("multiplier").notNull(),
  // Angepasster Multiplikator mit Qualitätsfaktoren
  qualityAdjustment: doublePrecision("quality_adjustment").notNull(),
  // Prozentuale Anpassung durch Qualitätsfaktoren
  baseValue: doublePrecision("base_value").notNull(),
  // Basiswert vor Anpassungen
  companyValue: doublePrecision("company_value").notNull(),
  // Berechneter Unternehmenswert
  additionalData: text("additional_data").notNull(),
  // JSON-String mit zusätzlichen Berechnungsdetails
  answers: json("answers").notNull(),
  qualityFactors: json("quality_factors").notNull()
  // Strukturierte Qualitätsfaktoren mit Zu-/Abschlägen
});
var leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  companyWebsite: text("company_website").notNull(),
  resultId: integer("result_id").references(() => exitCalculatorResults.id),
  expertoResultId: integer("experto_result_id").references(() => expertoCalculatorResults.id),
  contacted: boolean("contacted").default(false),
  segment: text("segment").notNull(),
  // hot/warm/cold/nurture basierend auf Dringlichkeit & Score
  calculatorType: text("calculator_type").default("standard")
  // "standard" oder "experto"
});
var insertExitCalculatorResultSchema = createInsertSchema(exitCalculatorResults).omit({
  id: true,
  createdAt: true
});
var insertExpertoCalculatorResultSchema = createInsertSchema(expertoCalculatorResults).omit({
  id: true,
  createdAt: true
});
var insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  contacted: true
});
var formAnswerSchema = z.record(z.string(), z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string())
]));
var leadSegmentEnum = z.enum(["hot", "warm", "cold", "nurture"]);
var leadFormSchema = z.object({
  firstName: z.string().min(2, "Vorname ist erforderlich"),
  lastName: z.string().min(2, "Nachname ist erforderlich"),
  email: z.string().email("Eine g\xFCltige E-Mail-Adresse ist erforderlich"),
  phone: z.string().min(5, "WhatsApp Nummer ist erforderlich"),
  companyWebsite: z.string().min(3, "Bitte geben Sie eine Website-Adresse ein").transform((val) => {
    if (!/^https?:\/\//.test(val)) {
      return `https://${val}`;
    }
    return val;
  }).refine((val) => {
    try {
      new URL(val);
      return true;
    } catch (e) {
      return false;
    }
  }, "Eine g\xFCltige Website-Adresse ist erforderlich"),
  privacy: z.literal(true, {
    errorMap: () => ({ message: "Bitte akzeptiere die Datenschutzerkl\xE4rung" })
  })
});
var scoreResultSchema = z.object({
  readinessScore: z.number(),
  scoreLabel: z.string(),
  scoreComment: z.string(),
  valuationLow: z.number(),
  valuationHigh: z.number(),
  potentialIncrease: z.number(),
  urgency: z.string(),
  segment: leadSegmentEnum,
  motivationTags: z.array(z.string())
});
var expertoResultSchema = z.object({
  industry: z.string(),
  yearlyRevenue: z.number(),
  lastThreeYearsProfit: z.array(z.number()),
  executiveSalary: z.number(),
  avgProfit: z.number(),
  normalizedEBIT: z.number(),
  multiplier: z.number(),
  qualityAdjustment: z.number(),
  baseValue: z.number(),
  companyValue: z.number(),
  qualityFactors: z.record(z.string(), z.number()),
  // Strukturierte Qualitätsfaktoren mit Zu-/Abschlägen
  additionalData: z.string().optional()
});

// server/routes.ts
function calculateExpertoValuation(data) {
  const questionsDataPath = path4.join(path4.dirname(import.meta.url), "data", "experto_questions.json").replace("file:", "");
  const questionsData = JSON.parse(fs3.readFileSync(questionsDataPath, "utf-8"));
  const multiplier = questionsData.multipliers[data.industry] || questionsData.multipliers.default;
  const avgProfit = data.lastThreeYearsProfit.reduce((sum, val) => sum + val, 0) / data.lastThreeYearsProfit.length;
  const normalizedEBIT = avgProfit + data.executiveSalary;
  let baseValue = normalizedEBIT * multiplier;
  const qualityAdjustment = Object.values(data.qualityFactors).reduce((sum, factor) => sum + factor, 0);
  const adjustedMultiplier = multiplier * (1 + qualityAdjustment);
  const adjustedValue = normalizedEBIT * adjustedMultiplier;
  const enterpriseValue = adjustedValue - data.debt + data.nonOperationalAssets;
  const roundedValue = Math.round(enterpriseValue / 1e3) * 1e3;
  return {
    companyValue: roundedValue,
    industryMultiplier: multiplier,
    qualityAdjustment,
    adjustedMultiplier,
    baseValue: Math.round(baseValue / 1e3) * 1e3,
    normalizedEBIT: Math.round(normalizedEBIT),
    avgProfit: Math.round(avgProfit),
    netDebtEffect: Math.round((data.nonOperationalAssets - data.debt) / 1e3) * 1e3
  };
}
async function registerRoutes(app2) {
  app2.get("/api/questionnaire", (req, res) => {
    try {
      const questionsDataPath = path4.join(path4.dirname(import.meta.url), "data", "questions.json").replace("file:", "");
      const questionsData = fs3.readFileSync(questionsDataPath, "utf-8");
      res.json(JSON.parse(questionsData));
    } catch (error) {
      log(`Error loading questionnaire data: ${error}`, "api");
      res.status(500).json({ error: "Could not load questionnaire data" });
    }
  });
  app2.get("/api/experto/questionnaire", (req, res) => {
    try {
      const questionsDataPath = path4.join(path4.dirname(import.meta.url), "data", "experto_questions.json").replace("file:", "");
      const questionsData = fs3.readFileSync(questionsDataPath, "utf-8");
      res.json(JSON.parse(questionsData));
    } catch (error) {
      log(`Error loading experto questionnaire data: ${error}`, "api");
      res.status(500).json({ error: "Could not load questionnaire data" });
    }
  });
  app2.post("/api/experto/calculate", async (req, res) => {
    try {
      const { answers } = req.body;
      log(`Received experto calculation request: ${JSON.stringify(req.body)}`, "api");
      if (!answers) {
        log(`Invalid request: answers missing`, "api");
        return res.status(400).json({
          success: false,
          error: "Keine Antworten \xFCbermittelt"
        });
      }
      if (!answers.industry || typeof answers.yearlyRevenue !== "number" || !Array.isArray(answers.lastThreeYearsProfit) || answers.lastThreeYearsProfit.length !== 3 || typeof answers.executiveSalary !== "number" || typeof answers.debt !== "number" || typeof answers.nonOperationalAssets !== "number" || !answers.qualityFactors) {
        log(`Invalid request: required fields missing or invalid: ${JSON.stringify(answers)}`, "api");
        return res.status(400).json({
          success: false,
          error: "Ung\xFCltige oder unvollst\xE4ndige Daten"
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
  app2.post("/api/experto/submit", async (req, res) => {
    try {
      const { answers, leadData } = req.body;
      let validatedLeadData;
      try {
        validatedLeadData = leadFormSchema.parse(leadData);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: "Ung\xFCltige Kontaktdaten"
        });
      }
      const result = calculateExpertoValuation(answers);
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
        answers,
        qualityFactors: answers.qualityFactors,
        additionalData: JSON.stringify({
          ...answers,
          calculationDetails: result
        })
      });
      const lead = await storage.saveLead({
        firstName: validatedLeadData.firstName,
        lastName: validatedLeadData.lastName,
        email: validatedLeadData.email,
        phone: validatedLeadData.phone,
        companyWebsite: validatedLeadData.companyWebsite,
        segment: "hot",
        // Experto-Leads bekommen direkt das "hot"-Label
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
  app2.get("/api/experto/result/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "Ung\xFCltige Result-ID"
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
  app2.post("/api/calculate", async (req, res) => {
    try {
      const { answers } = req.body;
      log(`Received calculation request: ${JSON.stringify(req.body)}`, "api");
      let validatedAnswers;
      try {
        validatedAnswers = formAnswerSchema.parse(answers);
      } catch (error) {
        log(`Invalid request: ${error}`, "api");
        return res.status(400).json({
          success: false,
          error: "Ung\xFCltige Fragebogenantworten"
        });
      }
      const scoreCalculator = await Promise.resolve().then(() => (init_scoreCalculator(), scoreCalculator_exports));
      const { calculateScore: calculateScore2 } = scoreCalculator;
      const result = calculateScore2(validatedAnswers);
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
  app2.post("/api/questionnaire/calculate", async (req, res) => {
    try {
      const { answers } = req.body;
      log(`Received questionnaire calculation request: ${JSON.stringify(req.body)}`, "api");
      let validatedAnswers;
      try {
        validatedAnswers = formAnswerSchema.parse(answers);
      } catch (error) {
        log(`Invalid request: ${error}`, "api");
        return res.status(400).json({
          success: false,
          error: "Ung\xFCltige Fragebogenantworten"
        });
      }
      const scoreCalculator = await Promise.resolve().then(() => (init_scoreCalculator(), scoreCalculator_exports));
      const { calculateScore: calculateScore2 } = scoreCalculator;
      const result = calculateScore2(validatedAnswers);
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
  app2.post("/api/questionnaire/submit", async (req, res) => {
    try {
      const { answers, leadData } = req.body;
      log(`Received questionnaire submit request: ${JSON.stringify({ answers, leadData: { ...leadData, email: "***@***" } })}`, "api");
      let validatedLeadData;
      try {
        validatedLeadData = leadFormSchema.parse(leadData);
      } catch (error) {
        log(`Invalid lead data: ${error}`, "api");
        return res.status(400).json({
          success: false,
          error: "Ung\xFCltige Kontaktdaten"
        });
      }
      const scoreCalculator = await Promise.resolve().then(() => (init_scoreCalculator(), scoreCalculator_exports));
      const { calculateScore: calculateScore2 } = scoreCalculator;
      const result = calculateScore2(answers);
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
  app2.post("/api/submit", async (req, res) => {
    try {
      const { answers, result, leadData } = req.body;
      let validatedLeadData;
      try {
        validatedLeadData = leadFormSchema.parse(leadData);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: "Ung\xFCltige Kontaktdaten"
        });
      }
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
  app2.get("/api/questionnaire/result/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "Ung\xFCltige Result-ID"
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
  app2.get("/api/result/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "Ung\xFCltige Result-ID"
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
  app2.get("/static", (req, res) => {
    const staticHtmlPath = path4.join(path4.dirname(import.meta.url), "public", "fallback.html").replace("file:", "");
    res.sendFile(staticHtmlPath);
  });
  if (process.env.NODE_ENV !== "development") {
    app2.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) {
        return next();
      }
      res.sendFile(path4.join(path4.dirname(import.meta.url), "public", "index.html").replace("file:", ""));
    });
  }
  const server = new Server(app2);
  const wss = new WebSocketServer({ server, path: "/ws" });
  wss.on("connection", (ws) => {
    log("WebSocket client connected", "ws");
    ws.on("message", (message) => {
      log(`Received message: ${message}`, "ws");
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
    ws.on("close", () => {
      log("WebSocket client disconnected", "ws");
    });
  });
  return server;
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  console.log("Current environment:", app.get("env"), process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
