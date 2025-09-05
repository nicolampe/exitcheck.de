import { 
  type ExitCalculatorResult, 
  type InsertExitCalculatorResult, 
  type ExpertoCalculatorResult,
  type InsertExpertoCalculatorResult,
  type Lead, 
  type InsertLead 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Standard-Rechner
  saveCalculatorResult(result: InsertExitCalculatorResult): Promise<ExitCalculatorResult>;
  getCalculatorResult(id: number): Promise<ExitCalculatorResult | undefined>;
  
  // Expert-Rechner (Everto-Methode)
  saveExpertoCalculatorResult(result: InsertExpertoCalculatorResult): Promise<ExpertoCalculatorResult>;
  getExpertoCalculatorResult(id: number): Promise<ExpertoCalculatorResult | undefined>;
  
  // Lead-Management
  saveLead(lead: InsertLead): Promise<Lead>;
  getLead(id: number): Promise<Lead | undefined>;
  getAllLeads(): Promise<Lead[]>;
  markLeadAsContacted(id: number): Promise<Lead | undefined>;
}

// In-memory implementation of storage
export class MemStorage implements IStorage {
  private results: Map<number, ExitCalculatorResult>;
  private expertoResults: Map<number, ExpertoCalculatorResult>;
  private leads: Map<number, Lead>;
  private resultsCurrentId: number;
  private expertoResultsCurrentId: number;
  private leadsCurrentId: number;

  constructor() {
    this.results = new Map();
    this.expertoResults = new Map();
    this.leads = new Map();
    this.resultsCurrentId = 1;
    this.expertoResultsCurrentId = 1;
    this.leadsCurrentId = 1;
  }

  // Standard-Rechner Methoden
  async saveCalculatorResult(insertResult: InsertExitCalculatorResult): Promise<ExitCalculatorResult> {
    const id = this.resultsCurrentId++;
    const now = new Date();
    const result: ExitCalculatorResult = { ...insertResult, id, createdAt: now };
    this.results.set(id, result);
    return result;
  }

  async getCalculatorResult(id: number): Promise<ExitCalculatorResult | undefined> {
    return this.results.get(id);
  }

  // Expert-Rechner Methoden
  async saveExpertoCalculatorResult(insertResult: InsertExpertoCalculatorResult): Promise<ExpertoCalculatorResult> {
    const id = this.expertoResultsCurrentId++;
    const now = new Date();
    const result: ExpertoCalculatorResult = { ...insertResult, id, createdAt: now };
    this.expertoResults.set(id, result);
    return result;
  }

  async getExpertoCalculatorResult(id: number): Promise<ExpertoCalculatorResult | undefined> {
    return this.expertoResults.get(id);
  }

  // Lead-Management Methoden
  async saveLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.leadsCurrentId++;
    const now = new Date();
    const lead: Lead = { 
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

  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async markLeadAsContacted(id: number): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    
    const updatedLead: Lead = { ...lead, contacted: true };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }
}

// Export a singleton instance of MemStorage
export const storage = new MemStorage();
