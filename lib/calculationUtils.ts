import type { CalculatorFormData } from "@shared/schema";
import type { ValuationResult, Bottleneck } from "./types";

// Calculate the Exit Readiness Score based on form data
export const calculateExitReadiness = (data: CalculatorFormData): number => {
  // Start with base score
  let score = 50;
  
  // Business model factors (SaaS and subscription models get higher scores)
  if (data.businessModel === "saas") score += 10;
  else if (data.businessModel === "digitalproduct") score += 5;
  else if (data.businessModel === "agency") score -= 5;
  
  // Recurring revenue is a major factor
  score += Math.round(data.recurringRevenue / 10);
  
  // Founder dependency has huge impact
  if (data.founderDependency === "rarely") score += 15;
  else if (data.founderDependency === "monthly") score += 10;
  else if (data.founderDependency === "weekly") score += 5;
  else if (data.founderDependency === "daily") score -= 10;
  
  // Decision making structure
  if (data.decisionMaker === "distributed") score += 10;
  else if (data.decisionMaker === "management") score += 5;
  else if (data.decisionMaker === "founder") score -= 5;
  
  // Processes documentation
  if (data.processes === "yes") score += 10;
  else if (data.processes === "partial") score += 5;
  else if (data.processes === "minimal") score -= 5;
  else if (data.processes === "no") score -= 10;
  
  // Team structure
  if (data.teamStructure === "complete") score += 10;
  else if (data.teamStructure === "partial") score += 5;
  else if (data.teamStructure === "minimal") score -= 5;
  else if (data.teamStructure === "none") score -= 10;
  
  // Automation level
  score += Math.round(data.automationLevel / 10);
  
  // Customer retention
  if (data.retentionPeriod === "years") score += 10;
  else if (data.retentionPeriod === "year") score += 5;
  else if (data.retentionPeriod === "months") score -= 5;
  else if (data.retentionPeriod === "once") score -= 10;
  
  // Growth rate
  if (data.growthRate === "high") score += 15;
  else if (data.growthRate === "medium") score += 10;
  else if (data.growthRate === "low") score += 5;
  else if (data.growthRate === "flat") score -= 10;
  
  // EBIT margin
  if (data.ebitMargin > 30) score += 10;
  else if (data.ebitMargin > 20) score += 5;
  else if (data.ebitMargin < 10) score -= 5;
  
  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
};

// Calculate valuation based on form data and readiness score
export const calculateValuation = (
  data: CalculatorFormData, 
  readinessScore: number
): ValuationResult => {
  // Base multiplier based on readiness score
  let baseMultiplierLow = 2.0;
  let baseMultiplierHigh = 3.0;
  
  // Adjust multiplier based on readiness score
  if (readinessScore >= 80) {
    baseMultiplierLow = 4.0;
    baseMultiplierHigh = 5.0;
  } else if (readinessScore >= 60) {
    baseMultiplierLow = 3.0;
    baseMultiplierHigh = 4.0;
  } else if (readinessScore >= 40) {
    baseMultiplierLow = 2.5;
    baseMultiplierHigh = 3.5;
  }
  
  // Adjust based on business model
  if (data.businessModel === "saas") {
    baseMultiplierLow += 1.0;
    baseMultiplierHigh += 1.5;
  } else if (data.businessModel === "ecommerce") {
    baseMultiplierLow += 0.5;
    baseMultiplierHigh += 0.75;
  } else if (data.businessModel === "digitalproduct") {
    baseMultiplierLow += 0.5;
    baseMultiplierHigh += 1.0;
  }
  
  // Get annual revenue (convert MRR if needed)
  const annualRevenue = data.revenueAmount * 12;
  
  // Calculate EBIT
  const ebit = annualRevenue * (data.ebitMargin / 100);
  
  // Calculate valuation range
  const valuationLow = Math.round(ebit * baseMultiplierLow);
  const valuationHigh = Math.round(ebit * baseMultiplierHigh);
  
  // Calculate potential increase (with optimizations)
  const optimizedMultiplier = Math.min(baseMultiplierHigh + 2.0, 7.0);
  const potentialIncrease = Math.round(ebit * optimizedMultiplier) - valuationHigh;
  
  // Identify bottlenecks
  const bottlenecks: Bottleneck[] = identifyBottlenecks(data, readinessScore);
  
  return {
    valuationLow,
    valuationHigh,
    potentialIncrease,
    mainBottlenecks: bottlenecks.slice(0, 2) // Get top 2 bottlenecks
  };
};

// Identify bottlenecks based on form data and score
const identifyBottlenecks = (
  data: CalculatorFormData,
  readinessScore: number
): Bottleneck[] => {
  const bottlenecks: Bottleneck[] = [];
  
  // Analyze founder dependency
  if (data.founderDependency === "daily" || data.founderDependency === "weekly") {
    bottlenecks.push({
      title: "Operative Abhängigkeit",
      description: "Dein Geschäft ist stark von deiner persönlichen Beteiligung abhängig. Potenzielle Käufer suchen nach Unternehmen, die unabhängig vom Gründer funktionieren.",
      severity: "high"
    });
  }
  
  // Analyze recurring revenue
  if (data.recurringRevenue < 50) {
    bottlenecks.push({
      title: "Fehlende strukturierte Wiederkehrmodelle",
      description: "Dein Umsatz besteht zu einem erheblichen Teil aus nicht-wiederkehrenden Einnahmen. Unternehmen mit vorhersehbaren, wiederkehrenden Umsätzen erzielen höhere Bewertungen.",
      severity: data.recurringRevenue < 30 ? "high" : "medium"
    });
  }
  
  // Analyze processes documentation
  if (data.processes === "minimal" || data.processes === "no") {
    bottlenecks.push({
      title: "Mangelnde Prozessdokumentation",
      description: "Deine Geschäftsprozesse sind unzureichend dokumentiert. Gut dokumentierte Prozesse machen dein Unternehmen für Käufer attraktiver und erleichtern die Übergabe.",
      severity: data.processes === "no" ? "high" : "medium"
    });
  }
  
  // Analyze team structure
  if (data.teamStructure === "minimal" || data.teamStructure === "none") {
    bottlenecks.push({
      title: "Fehlendes Führungsteam",
      description: "Ein starkes Management-Team ist entscheidend für einen erfolgreichen Exit. Ohne ein funktionierendes Führungsteam besteht eine hohe Abhängigkeit vom Gründer.",
      severity: data.teamStructure === "none" ? "high" : "medium"
    });
  }
  
  // Analyze growth rate
  if (data.growthRate === "flat") {
    bottlenecks.push({
      title: "Stagnierendes Wachstum",
      description: "Käufer suchen nach Wachstumspotenzial. Ein stagnierendes oder rückläufiges Geschäft ist deutlich schwerer zu verkaufen und erzielt niedrigere Multiplikatoren.",
      severity: "high"
    });
  }
  
  // Analyze customer retention
  if (data.retentionPeriod === "once" || data.retentionPeriod === "months") {
    bottlenecks.push({
      title: "Geringe Kundenbindung",
      description: "Langfristige Kundenbeziehungen erhöhen den Unternehmenswert erheblich. Eine kurze Kundenbindungsdauer wird von Käufern als Risiko angesehen.",
      severity: data.retentionPeriod === "once" ? "high" : "medium"
    });
  }
  
  // Analyze EBIT margin
  if (data.ebitMargin < 15) {
    bottlenecks.push({
      title: "Niedrige Profitabilität",
      description: "Eine höhere EBIT-Marge führt direkt zu höheren Bewertungsmultiplikatoren. Die Steigerung deiner Profitabilität sollte eine Priorität sein.",
      severity: data.ebitMargin < 10 ? "high" : "medium"
    });
  }
  
  // Sort bottlenecks by severity (high first)
  return bottlenecks.sort((a, b) => {
    if (a.severity === "high" && b.severity !== "high") return -1;
    if (a.severity !== "high" && b.severity === "high") return 1;
    return 0;
  });
};
