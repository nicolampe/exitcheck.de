import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type ExitCalculatorResult } from "@shared/schema";
import { generatePdf } from "@/lib/pdfGenerator";
import ScoreSection from "./ScoreSection";
import ValuationSection from "./ValuationSection";
import BottlenecksSection from "./BottlenecksSection";
import NextStepsSection from "./NextStepsSection";
import { Download } from "lucide-react";

interface ResultsDisplayProps {
  results: ExitCalculatorResult;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { toast } = useToast();

  const handleDownloadPdf = async () => {
    try {
      await generatePdf(results);
      toast({
        title: "PDF erfolgreich erstellt",
        description: "Die Ergebnisse wurden als PDF heruntergeladen.",
      });
    } catch (error) {
      toast({
        title: "Fehler beim PDF-Export",
        description: "Die PDF-Datei konnte nicht erstellt werden.",
        variant: "destructive",
      });
      console.error("PDF generation error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#233656] mb-4">Deine Exit-Readiness Analyse</h2>
          <p className="text-xl text-[#64748B]">Hier ist eine detaillierte Bewertung deines Unternehmens.</p>
          <Button 
            onClick={handleDownloadPdf} 
            variant="outline" 
            className="mt-4"
          >
            <Download className="mr-2 h-4 w-4" /> Ergebnisse als PDF herunterladen
          </Button>
        </div>
        
        <ScoreSection score={results.readinessScore} />
        <ValuationSection 
          valuationLow={results.valuationLow} 
          valuationHigh={results.valuationHigh} 
          potentialIncrease={results.potentialIncrease} 
        />
        <BottlenecksSection bottlenecks={JSON.parse(results.mainBottlenecks)} />
        <NextStepsSection />
      </div>
    </div>
  );
}
