import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type CalculatorFormData } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { BusinessModelIcons } from "./icons";

interface BusinessModelStepProps {
  data: Partial<CalculatorFormData>;
  onNext: (data: Partial<CalculatorFormData>) => void;
}

const businessModels = [
  { value: "saas", label: "SaaS", icon: "cloud" },
  { value: "ecommerce", label: "E-Commerce", icon: "shopping-cart" },
  { value: "agency", label: "Agentur", icon: "users" },
  { value: "coaching", label: "Coaching", icon: "chalkboard" },
  { value: "digitalproduct", label: "Digitalprodukt", icon: "file-download" },
  { value: "service", label: "Service", icon: "hands-helping" }
];

const industries = [
  { value: "technology", label: "Technologie & IT" },
  { value: "finance", label: "Finanzen & Versicherungen" },
  { value: "healthcare", label: "Gesundheitswesen" },
  { value: "education", label: "Bildung" },
  { value: "retail", label: "Einzelhandel" },
  { value: "manufacturing", label: "Fertigung" },
  { value: "media", label: "Medien & Entertainment" },
  { value: "other", label: "Andere" }
];

export default function BusinessModelStep({ data, onNext }: BusinessModelStepProps) {
  const [businessModel, setBusinessModel] = useState<string>(data.businessModel || "");
  const [industry, setIndustry] = useState<string>(data.industry || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!businessModel) {
      setError("Bitte wähle ein Geschäftsmodell");
      return;
    }
    
    if (!industry) {
      setError("Bitte wähle eine Branche");
      return;
    }
    
    onNext({ businessModel, industry });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#233656] mb-6">1. Geschäftsmodell & Branche</h2>
      <p className="text-[#64748B] mb-8">Wähle das Geschäftsmodell, das am besten zu deinem Unternehmen passt.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {businessModels.map((model) => (
          <div
            key={model.value}
            className={`selection-card ${businessModel === model.value ? 'selected' : ''}`}
            onClick={() => {
              setBusinessModel(model.value);
              setError("");
            }}
          >
            {BusinessModelIcons[model.icon]}
            <div className="font-medium text-[#233656] mt-2">{model.label}</div>
          </div>
        ))}
      </div>
      
      <div className="mb-8">
        <Label htmlFor="industry" className="block text-sm font-medium text-[#1E293B] mb-2">
          Branche
        </Label>
        <Select 
          value={industry} 
          onValueChange={(value) => {
            setIndustry(value);
            setError("");
          }}
        >
          <SelectTrigger id="industry" className="w-full">
            <SelectValue placeholder="Wähle deine Branche..." />
          </SelectTrigger>
          <SelectContent>
            {industries.map((ind) => (
              <SelectItem key={ind.value} value={ind.value}>
                {ind.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-[#F43F5E] mb-4">{error}</p>}

      <div className="flex justify-end">
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
