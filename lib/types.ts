export interface BusinessModel {
  value: string;
  label: string;
  icon: string;
}

export interface Industry {
  value: string;
  label: string;
}

export interface Bottleneck {
  title: string;
  description: string;
  severity: 'high' | 'medium';
}

export interface ValuationResult {
  valuationLow: number;
  valuationHigh: number;
  potentialIncrease: number;
  mainBottlenecks: Bottleneck[];
}

export interface CalculatorFormData {
  industry: string;
  businessModel: string;
  yearsInBusiness: number;
  revenue: number;
  profit: number;
  founderDependency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'rarely';
  decisionMaker: string;
  teamStructure: 'complete' | 'partial' | 'minimal' | 'none';
  systemsIntegration: 'complete' | 'partial' | 'minimal' | 'none';
  automationLevel: number;
  processes: 'complete' | 'partial' | 'minimal' | 'no' | 'yes';
  recurringRevenue: number;
  customerRetention: 'high' | 'medium' | 'low';
  retentionPeriod: string;
  growthRate: string;
}
