import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
// import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import ExpertoResultsDisplay from "@/components/experto/ExpertoResultsDisplay";
import { type ExpertoCalculatorResult } from "@shared/schema";

export default function ExpertResultPage({ resultId }: { resultId: string }) {
  const [result, setResult] = useState<ExpertoCalculatorResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // Debug-Ausgabe
        console.log('Fetching result with ID:', resultId);
        
        const response = await fetch(`/api/experto/result/${resultId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (data.success) {
          setResult(data.result);
        } else {
          setError(data.error || "Die Ergebnisse konnten nicht geladen werden.");
          toast({
            title: "Fehler",
            description: data.error || "Die Ergebnisse konnten nicht geladen werden.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching result:', error);
        setError("Die Ergebnisse konnten nicht geladen werden. Bitte versuchen Sie es später erneut.");
        toast({
          title: "Fehler",
          description: "Die Ergebnisse konnten nicht geladen werden. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [resultId, toast]);

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>
              {error || "Die Ergebnisse konnten nicht geladen werden. Bitte versuchen Sie es später erneut."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
          Ihr Unternehmenswert-Bericht
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Detaillierte Marktanalyse und Bewertung Ihres Unternehmens nach der bewährten Multiplikator-Methode.
        </p>
      </div>

      <div>
        <ExpertoResultsDisplay result={result} />
      </div>
    </div>
  );
}
