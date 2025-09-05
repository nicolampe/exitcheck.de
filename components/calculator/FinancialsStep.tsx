import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { type CalculatorFormData } from "@shared/schema";
import { ChevronRight, ChevronLeft, Euro } from "lucide-react";

interface FinancialsStepProps {
  data: Partial<CalculatorFormData>;
  onNext: (data: Partial<CalculatorFormData>) => void;
  onPrev: () => void;
}

export default function FinancialsStep({ data, onNext, onPrev }: FinancialsStepProps) {
  const [revenueType, setRevenueType] = useState<string>(data.revenueType || "mrr");
  const [revenueAmount, setRevenueAmount] = useState<string>(
    data.revenueAmount ? data.revenueAmount.toString() : ""
  );
  const [ebitMargin, setEbitMargin] = useState<number>(data.ebitMargin || 20);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!revenueAmount || parseFloat(revenueAmount) <= 0) {
      setError("Bitte gib einen gültigen Umsatzbetrag ein");
      return;
    }
    
    // Convert annual revenue to MRR if needed
    const normalizedRevenue = revenueType === "annual" 
      ? parseFloat(revenueAmount) / 12 
      : parseFloat(revenueAmount);

    onNext({
      revenueType,
      revenueAmount: normalizedRevenue,
      ebitMargin
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#233656] mb-6">2. Finanzkennzahlen</h2>
      <p className="text-[#64748B] mb-8">
        Deine aktuellen Finanzkennzahlen sind entscheidend für die Bewertung deines Unternehmens.
      </p>
      
      <div className="mb-8">
        <Label className="block text-sm font-medium text-[#1E293B] mb-2">Umsatzart</Label>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`selection-card ${revenueType === "mrr" ? "selected" : ""}`}
            onClick={() => setRevenueType("mrr")}
          >
            <div className="font-medium text-[#233656]">Monatlich wiederkehrend (MRR)</div>
          </div>
          <div
            className={`selection-card ${revenueType === "annual" ? "selected" : ""}`}
            onClick={() => setRevenueType("annual")}
          >
            <div className="font-medium text-[#233656]">Jahresumsatz</div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <Label 
          htmlFor="revenue" 
          className="block text-sm font-medium text-[#1E293B] mb-2"
        >
          {revenueType === "mrr" 
            ? "Monatlich wiederkehrender Umsatz (MRR)" 
            : "Jahresumsatz"}
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Euro className="h-4 w-4 text-[#64748B]" />
          </div>
          <Input
            id="revenue"
            type="number"
            placeholder={revenueType === "mrr" ? "10.000" : "120.000"}
            value={revenueAmount}
            onChange={(e) => {
              setRevenueAmount(e.target.value);
              setError("");
            }}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <Label 
          htmlFor="ebit-margin" 
          className="block text-sm font-medium text-[#1E293B] mb-2"
        >
          EBIT-Marge (oder: Was bleibt dir prozentual vom Umsatz?)
        </Label>
        <div className="space-y-2">
          <Slider
            id="ebit-margin"
            min={0}
            max={100}
            step={1}
            value={[ebitMargin]}
            onValueChange={(value) => setEbitMargin(value[0])}
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
            {ebitMargin}%
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
