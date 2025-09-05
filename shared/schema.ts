import { pgTable, text, serial, integer, boolean, doublePrecision, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabelle für die Ergebnisse des Exit-Calculators
export const exitCalculatorResults = pgTable("exit_calculator_results", {
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
  urgency: text("urgency").notNull(),
});

// Tabelle für die Ergebnisse des Expert-Rechners (Everto-Methode)
export const expertoCalculatorResults = pgTable("experto_calculator_results", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  industry: text("industry").notNull(),
  yearlyRevenue: doublePrecision("yearly_revenue").notNull(),
  lastThreeYearsProfit: json("last_three_years_profit").notNull(), // Array mit den letzten 3 Jahren EBIT
  executiveSalary: doublePrecision("executive_salary").notNull(),
  avgProfit: doublePrecision("avg_profit").notNull(), // Durchschnittlicher Gewinn der letzten 3 Jahre
  normalizedEBIT: doublePrecision("normalized_ebit").notNull(), // EBIT + Geschäftsführergehalt
  multiplier: doublePrecision("multiplier").notNull(), // Angepasster Multiplikator mit Qualitätsfaktoren
  qualityAdjustment: doublePrecision("quality_adjustment").notNull(), // Prozentuale Anpassung durch Qualitätsfaktoren
  baseValue: doublePrecision("base_value").notNull(), // Basiswert vor Anpassungen
  companyValue: doublePrecision("company_value").notNull(), // Berechneter Unternehmenswert
  additionalData: text("additional_data").notNull(), // JSON-String mit zusätzlichen Berechnungsdetails
  answers: json("answers").notNull(),
  qualityFactors: json("quality_factors").notNull(), // Strukturierte Qualitätsfaktoren mit Zu-/Abschlägen
});

// Tabelle für Lead-Informationen
export const leads = pgTable("leads", {
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
  segment: text("segment").notNull(), // hot/warm/cold/nurture basierend auf Dringlichkeit & Score
  calculatorType: text("calculator_type").default("standard"), // "standard" oder "experto"
});

// Insert schemas
export const insertExitCalculatorResultSchema = createInsertSchema(exitCalculatorResults).omit({
  id: true,
  createdAt: true,
});

export const insertExpertoCalculatorResultSchema = createInsertSchema(expertoCalculatorResults).omit({
  id: true,
  createdAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  contacted: true,
});

// Types
export type InsertExitCalculatorResult = z.infer<typeof insertExitCalculatorResultSchema>;
export type ExitCalculatorResult = typeof exitCalculatorResults.$inferSelect;

export type InsertExpertoCalculatorResult = z.infer<typeof insertExpertoCalculatorResultSchema>;
export type ExpertoCalculatorResult = typeof expertoCalculatorResults.$inferSelect;

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Allgemeiner Typ für Formularantworten
export const formAnswerSchema = z.record(z.string(), z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
]));

export type FormAnswers = z.infer<typeof formAnswerSchema>;

// Lead-Segmente Enum
export const leadSegmentEnum = z.enum(["hot", "warm", "cold", "nurture"]);
export type LeadSegment = z.infer<typeof leadSegmentEnum>;

// Formular für die Benutzerinformationen
export const leadFormSchema = z.object({
  firstName: z.string().min(2, "Vorname ist erforderlich"),
  lastName: z.string().min(2, "Nachname ist erforderlich"),
  email: z.string().email("Eine gültige E-Mail-Adresse ist erforderlich"),
  phone: z.string().min(5, "WhatsApp Nummer ist erforderlich"),
  companyWebsite: z.string()
    .min(3, "Bitte geben Sie eine Website-Adresse ein")
    .transform(val => {
      // Wenn keine URL-Schema vorhanden ist, füge "https://" hinzu
      if (!/^https?:\/\//.test(val)) {
        return `https://${val}`;
      }
      return val;
    })
    .refine(val => {
      try {
        new URL(val);
        return true;
      } catch (e) {
        return false;
      }
    }, "Eine gültige Website-Adresse ist erforderlich"),
  privacy: z.literal(true, {
    errorMap: () => ({ message: "Bitte akzeptiere die Datenschutzerklärung" }),
  }),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// Typ für die Bewertungsberechnung (Standard-Rechner)
export const scoreResultSchema = z.object({
  readinessScore: z.number(),
  scoreLabel: z.string(),
  scoreComment: z.string(),
  valuationLow: z.number(),
  valuationHigh: z.number(),
  potentialIncrease: z.number(),
  urgency: z.string(),
  segment: leadSegmentEnum,
  motivationTags: z.array(z.string()),
});

// Typ für die Expert-Bewertungsberechnung (Everto-Methode)
export const expertoResultSchema = z.object({
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
  qualityFactors: z.record(z.string(), z.number()), // Strukturierte Qualitätsfaktoren mit Zu-/Abschlägen
  additionalData: z.string().optional()
});

export type ScoreResult = z.infer<typeof scoreResultSchema>;
export type ExpertoResult = z.infer<typeof expertoResultSchema>;
