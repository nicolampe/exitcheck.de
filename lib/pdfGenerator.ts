import { jsPDF } from "jspdf";
import { type ExitCalculatorResult } from "@shared/schema";

// Calculate the readiness category based on the score
const getReadinessCategory = (score: number): string => {
  if (score >= 80) return "Dein Unternehmen ist sehr gut verkäuflich";
  if (score >= 60) return "Dein Unternehmen ist eingeschränkt verkäuflich";
  if (score >= 40) return "Dein Unternehmen benötigt noch deutliche Verbesserungen für einen Exit";
  return "Dein Unternehmen ist aktuell nicht verkaufsbereit";
};

// Format currency function
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
};

// Generate PDF with the exit valuation results
export const generatePdf = async (results: ExitCalculatorResult): Promise<void> => {
  // Create new PDF document with German locale
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Define page dimensions and margins
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Define colors
  const primaryColor = "#0F52BA";
  const secondaryColor = "#233656";
  const textColor = "#1E293B";
  const lightTextColor = "#64748B";

  // Add logo and title
  doc.setFillColor(primaryColor);
  doc.rect(margin, margin, 10, 10, "F");
  doc.setTextColor(secondaryColor);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("exitcheck.de", margin + 15, margin + 7);
  
  doc.setFontSize(12);
  doc.setTextColor(lightTextColor);
  doc.setFont("helvetica", "normal");
  doc.text("Deine persönliche Exit-Readiness Analyse", margin + 15, margin + 15);

  // Add date
  const currentDate = new Date().toLocaleDateString("de-DE");
  doc.setFontSize(10);
  doc.text(`Erstellt am: ${currentDate}`, pageWidth - margin - 40, margin + 15, { align: "right" });

  // Add horizontal line
  doc.setDrawColor(lightTextColor);
  doc.setLineWidth(0.5);
  doc.line(margin, margin + 25, pageWidth - margin, margin + 25);

  let yPos = margin + 40;

  // Section 1: Exit Readiness Score
  doc.setFontSize(18);
  doc.setTextColor(secondaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Exit Readiness Score", margin, yPos);
  yPos += 10;

  doc.setFontSize(36);
  doc.setTextColor(primaryColor);
  doc.text(`${results.readinessScore}%`, margin, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.setFont("helvetica", "normal");
  doc.text(getReadinessCategory(results.readinessScore), margin, yPos);
  yPos += 20;

  // Section 2: Valuation
  doc.setFontSize(18);
  doc.setTextColor(secondaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Geschätzter Verkaufspreis", margin, yPos);
  yPos += 10;

  doc.setFontSize(16);
  doc.setTextColor(primaryColor);
  doc.text(`${formatCurrency(results.valuationLow)} - ${formatCurrency(results.valuationHigh)}`, margin, yPos);
  yPos += 8;

  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.setFont("helvetica", "normal");
  doc.text("Basierend auf deinen aktuellen Kennzahlen", margin, yPos);
  yPos += 10;

  doc.setFontSize(14);
  doc.setTextColor("#10B981"); // Success green color
  doc.setFont("helvetica", "bold");
  doc.text(`+ ${formatCurrency(results.potentialIncrease)} Potenzial`, margin, yPos);
  yPos += 8;

  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.setFont("helvetica", "normal");
  doc.text("Mit den richtigen Optimierungen", margin, yPos);
  yPos += 20;

  // Feste Liste von Bottlenecks für den PDF-Report
  const bottlenecks = [
    {
      title: "Abhängigkeit vom Gründer",
      description: "Dein Unternehmen ist noch zu stark von dir als Gründer abhängig. Entwickle ein starkes Management-Team.",
      severity: "high"
    },
    {
      title: "Geringe wiederkehrende Umsätze",
      description: "Der Anteil an wiederkehrenden Umsätzen ist zu gering. Käufer bevorzugen vorhersehbare Einnahmequellen.",
      severity: "medium"
    }
  ];

  // Section 3: Bottlenecks
  doc.setFontSize(18);
  doc.setTextColor(secondaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Deine Exit-Engpässe", margin, yPos);
  yPos += 15;

  // Add bottlenecks
  for (let i = 0; i < bottlenecks.length; i++) {
    const bottleneck = bottlenecks[i];
    
    // Draw colored rectangle for the bottleneck
    doc.setFillColor(bottleneck.severity === "high" ? "#FEE2E2" : "#FEF3C7");
    doc.rect(margin, yPos - 5, contentWidth, 25, "F");
    
    // Draw vertical line indicator
    doc.setFillColor(bottleneck.severity === "high" ? "#F43F5E" : "#F59E0B");
    doc.rect(margin, yPos - 5, 2, 25, "F");

    // Add bottleneck title
    doc.setFontSize(14);
    doc.setTextColor(secondaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}. ${bottleneck.title}`, margin + 5, yPos + 2);
    
    // Add bottleneck description
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.setFont("helvetica", "normal");
    
    // Split long text into multiple lines
    const descLines = doc.splitTextToSize(bottleneck.description, contentWidth - 10);
    doc.text(descLines, margin + 5, yPos + 10);
    
    yPos += 30;
  }

  // Next Steps section
  yPos += 10;
  doc.setFontSize(18);
  doc.setTextColor(secondaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Deine nächsten Schritte", margin, yPos);
  yPos += 15;

  // Add steps
  const steps = [
    {
      title: "Entwickle ein Führungsteam",
      description: "Baue ein Managementteam auf, das das Unternehmen auch ohne dich führen kann."
    },
    {
      title: "Steigere den Anteil wiederkehrender Umsätze",
      description: "Entwickle Angebote, die regelmäßige, vorhersehbare Einnahmen generieren."
    },
    {
      title: "Dokumentiere alle wichtigen Prozesse",
      description: "Stelle sicher, dass alle Geschäftsprozesse klar dokumentiert und standardisiert sind."
    }
  ];

  steps.forEach((step, index) => {
    // Draw circle with check mark
    doc.setFillColor(primaryColor);
    doc.circle(margin + 3, yPos - 1, 3, "F");
    
    // Add step title
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(step.title, margin + 8, yPos);
    
    // Add step description
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.setFont("helvetica", "normal");
    
    const descLines = doc.splitTextToSize(step.description, contentWidth - 10);
    doc.text(descLines, margin + 8, yPos + 6);
    
    yPos += 16;
  });

  // Add footer
  const footerYPos = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(10);
  doc.setTextColor(lightTextColor);
  doc.setFont("helvetica", "italic");
  
  doc.text("Diese Analyse wurde automatisch erstellt und basiert auf den von dir angegebenen Daten.", 
           pageWidth / 2, footerYPos - 5, { align: "center" });
  
  doc.text("Für eine detaillierte Beratung vereinbare ein kostenloses Exit-Strategiegespräch.", 
           pageWidth / 2, footerYPos, { align: "center" });
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor);
  doc.text("www.exitcheck.de", pageWidth / 2, footerYPos + 5, { align: "center" });

  // Save the PDF
  doc.save(`exitcheck_Analyse_${currentDate.replace(/\./g, "-")}.pdf`);
};
