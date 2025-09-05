import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type CalculatorFormData } from "@/lib/types";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface FounderDependencyStepProps {
  data: Partial<CalculatorFormData>;
  onNext: (data: Partial<CalculatorFormData>) => void;
  onPrev: () => void;
}

const founderDependencyOptions = [
  { 
    value: "daily", 
    label: "Täglich: Ich bin operativ voll eingebunden" 
  },
  { 
    value: "weekly", 
    label: "Wöchentlich: Ich fokussiere mich vor allem auf strategische Aufgaben" 
  },
  { 
    value: "monthly", 
    label: "Monatlich: Ich habe ein Management-Team, das den Betrieb führt" 
  },
  { 
    value: "rarely", 
    label: "Selten: Das Unternehmen läuft weitgehend ohne mich" 
  }
];

const decisionMakerOptions = [
  { 
    value: "founder", 
    label: "Ich (der Gründer) treffe fast alle Entscheidungen" 
  },
  { 
    value: "management", 
    label: "Ein Führungsteam, das auch ohne mich funktioniert" 
  },
  { 
    value: "distributed", 
    label: "Die Entscheidungsbefugnis ist auf verschiedene Abteilungen verteilt" 
  }
];

export default function FounderDependencyStep({ data, onNext, onPrev }: FounderDependencyStepProps) {
  const [founderDependency, setFounderDependency] = useState<string>(data.founderDependency || "");
  const [decisionMaker, setDecisionMaker] = useState<string>(data.decisionMaker || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!founderDependency) {
      setError("Bitte wähle aus, wie oft du operativ eingebunden bist");
      return;
    }
    
    if (!decisionMaker) {
      setError("Bitte wähle aus, wer die Entscheidungen trifft");
      return;
    }
    
    onNext({ founderDependency, decisionMaker });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#233656] mb-6">3. Gründerabhängigkeit</h2>
      <p className="text-[#64748B] mb-8">
        Ein wichtiger Faktor für die Exit-Bereitschaft ist, wie stark das Unternehmen vom Gründer abhängig ist.
      </p>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#1E293B] mb-4">
          Wie oft bist du operativ im Unternehmen eingebunden?
        </label>
        <div className="space-y-3">
          {founderDependencyOptions.map((option) => (
            <div
              key={option.value}
              className={`selection-card ${founderDependency === option.value ? "selected" : ""}`}
              onClick={() => {
                setFounderDependency(option.value);
                setError("");
              }}
            >
              <div className="font-medium text-[#233656]">{option.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#1E293B] mb-2">
          Wer trifft 80% der Entscheidungen im Unternehmen?
        </label>
        <div className="space-y-3">
          {decisionMakerOptions.map((option) => (
            <div
              key={option.value}
              className={`selection-card ${decisionMaker === option.value ? "selected" : ""}`}
              onClick={() => {
                setDecisionMaker(option.value);
                setError("");
              }}
            >
              <div className="font-medium text-[#233656]">{option.label}</div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-[#F43F5E] mb-4">{error}</p>}

      <div className="flex justify-between">
        <Button 
          onClick={onPrev} 
          variant="outline" 
          className="text-[#1E293B]"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>
        <Button 
          onClick={handleNext} 
          className="bg-primary hover:bg-[#0D47A1] text-white font-medium"
        >
          Weiter <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
