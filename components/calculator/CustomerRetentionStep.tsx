import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { type CalculatorFormData } from "@/lib/types";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface CustomerRetentionStepProps {
  data: Partial<CalculatorFormData>;
  onNext: (data: Partial<CalculatorFormData>) => void;
  onPrev: () => void;
}

const retentionPeriodOptions = [
  { value: "years", label: "Mehrere Jahre (3+ Jahre)" },
  { value: "year", label: "Etwa ein Jahr" },
  { value: "months", label: "Einige Monate (3-11 Monate)" },
  { value: "once", label: "Überwiegend Einmalkäufe" }
];

const growthRateOptions = [
  { value: "high", label: "Stark (>30% pro Jahr)" },
  { value: "medium", label: "Solide (10-30% pro Jahr)" },
  { value: "low", label: "Moderat (1-10% pro Jahr)" },
  { value: "flat", label: "Stagnierend oder rückläufig (≤0%)" }
];

export default function CustomerRetentionStep({ data, onNext, onPrev }: CustomerRetentionStepProps) {
  const [recurringRevenue, setRecurringRevenue] = useState<number>(data.recurringRevenue || 30);
  const [retentionPeriod, setRetentionPeriod] = useState<string>(data.retentionPeriod || "");
  const [growthRate, setGrowthRate] = useState<string>(data.growthRate || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!retentionPeriod) {
      setError("Bitte wähle eine Option zur Kundenbindungsdauer");
      return;
    }
    
    if (!growthRate) {
      setError("Bitte wähle eine Option zum Umsatzwachstum");
      return;
    }
    
    onNext({ recurringRevenue, retentionPeriod, growthRate });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#233656] mb-6">5. Kundenbindung & Wachstum</h2>
      <p className="text-[#64748B] mb-8">
        Stabile Kundenbeziehungen und Wachstumstrends sind zentrale Wertfaktoren.
      </p>
      
      <div className="mb-8">
        <Label htmlFor="recurring-revenue" className="block text-sm font-medium text-[#1E293B] mb-2">
          Wie hoch ist der Anteil an wiederkehrenden Kunden/Umsätzen?
        </Label>
        <div className="space-y-2">
          <Slider
            id="recurring-revenue"
            min={0}
            max={100}
            step={1}
            value={[recurringRevenue]}
            onValueChange={(value) => setRecurringRevenue(value[0])}
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
            {recurringRevenue}%
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <Label className="block text-sm font-medium text-[#1E293B] mb-2">
          Durchschnittliche Kundenbindungsdauer
        </Label>
        <div className="space-y-3">
          {retentionPeriodOptions.map((option) => (
            <div
              key={option.value}
              className={`selection-card ${retentionPeriod === option.value ? "selected" : ""}`}
              onClick={() => {
                setRetentionPeriod(option.value);
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
          Jährliches Umsatzwachstum der letzten 2 Jahre
        </Label>
        <div className="space-y-3">
          {growthRateOptions.map((option) => (
            <div
              key={option.value}
              className={`selection-card ${growthRate === option.value ? "selected" : ""}`}
              onClick={() => {
                setGrowthRate(option.value);
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
