import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { type CalculatorFormData } from "@/lib/types";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface SystemsProcessesStepProps {
  data: Partial<CalculatorFormData>;
  onNext: (data: Partial<CalculatorFormData>) => void;
  onPrev: () => void;
}

const processesOptions = [
  { value: "yes", label: "Ja, umfassend dokumentiert" },
  { value: "partial", label: "Teilweise dokumentiert" },
  { value: "minimal", label: "Minimale Dokumentation" },
  { value: "no", label: "Nein, kaum dokumentiert" }
];

const teamStructureOptions = [
  { value: "complete", label: "Vollständiges C-Level Team (CEO, COO, CTO, etc.)" },
  { value: "partial", label: "Einige Schlüsselpositionen sind besetzt" },
  { value: "minimal", label: "Nur wenige Führungspositionen außer dem Gründer" },
  { value: "none", label: "Kein formelles Führungsteam" }
];

export default function SystemsProcessesStep({ data, onNext, onPrev }: SystemsProcessesStepProps) {
  const [processes, setProcesses] = useState<string>(data.processes || "");
  const [teamStructure, setTeamStructure] = useState<string>(data.teamStructure || "");
  const [automationLevel, setAutomationLevel] = useState<number>(data.automationLevel || 50);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!processes) {
      setError("Bitte wähle eine Option zur Prozessdokumentation");
      return;
    }
    
    if (!teamStructure) {
      setError("Bitte wähle eine Option zur Teamstruktur");
      return;
    }
    
    onNext({ processes, teamStructure, automationLevel });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#233656] mb-6">4. Systeme & Prozesse</h2>
      <p className="text-[#64748B] mb-8">
        Strukturierte Systeme und Prozesse steigern den Wert deines Unternehmens erheblich.
      </p>
      
      <div className="mb-8">
        <Label className="block text-sm font-medium text-[#1E293B] mb-2">
          Gibt es dokumentierte Prozesse für die wichtigsten Geschäftsabläufe?
        </Label>
        <div className="grid grid-cols-2 gap-4">
          {processesOptions.map((option) => (
            <div
              key={option.value}
              className={`selection-card ${processes === option.value ? "selected" : ""}`}
              onClick={() => {
                setProcesses(option.value);
                setError("");
              }}
            >
              <div className="font-medium text-[#233656]">{option.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <Label className="block text-sm font-medium text-[#1E293B] mb-2">
          Wie ist dein Führungsteam strukturiert?
        </Label>
        <div className="space-y-3">
          {teamStructureOptions.map((option) => (
            <div
              key={option.value}
              className={`selection-card ${teamStructure === option.value ? "selected" : ""}`}
              onClick={() => {
                setTeamStructure(option.value);
                setError("");
              }}
            >
              <div className="font-medium text-[#233656]">{option.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <Label htmlFor="automation-level" className="block text-sm font-medium text-[#1E293B] mb-2">
          Automatisierungsgrad der Geschäftsprozesse
        </Label>
        <div className="space-y-2">
          <Slider
            id="automation-level"
            min={0}
            max={100}
            step={1}
            value={[automationLevel]}
            onValueChange={(value) => setAutomationLevel(value[0])}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-[#64748B]">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <div className="text-center font-medium text-primary">
            {automationLevel}%
          </div>
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
