import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import BusinessModelStep from "./BusinessModelStep";
import FinancialsStep from "./FinancialsStep";
import FounderDependencyStep from "./FounderDependencyStep";
import SystemsProcessesStep from "./SystemsProcessesStep";
import CustomerRetentionStep from "./CustomerRetentionStep";
import ContactInfoStep from "./ContactInfoStep";
import { type LeadFormData, type ExitCalculatorResult } from "@shared/schema";
import { calculateExitReadiness, calculateValuation } from "@/lib/calculationUtils";
import { type CalculatorFormData } from "@/lib/types";

interface ExitCalculatorProps {
  onCalculationComplete: (results: ExitCalculatorResult) => void;
}

export default function ExitCalculator({ onCalculationComplete }: ExitCalculatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatorData, setCalculatorData] = useState<Partial<CalculatorFormData>>({});
  const [leadData, setLeadData] = useState<Partial<LeadFormData>>({});
  const { toast } = useToast();
  const totalSteps = 6;

  const submitMutation = useMutation({
    mutationFn: async (data: {
      calculatorData: CalculatorFormData;
      leadData: LeadFormData;
    }) => {
      const response = await apiRequest(
        "POST",
        "/api/calculator/submit",
        data
      );
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        onCalculationComplete(data.result);
      } else {
        toast({
          title: "Ein Fehler ist aufgetreten",
          description: data.error || "Bitte versuche es später erneut.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Ein Fehler ist aufgetreten",
        description: "Bitte versuche es später erneut.",
        variant: "destructive",
      });
      console.error("Error submitting form:", error);
    },
  });

  const progress = (currentStep / totalSteps) * 100;

  const handleNextStep = (stepData: Partial<CalculatorFormData>) => {
    setCalculatorData((prev: Partial<CalculatorFormData>) => ({ ...prev, ...stepData }));
    setCurrentStep((prev: number) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev: number) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (contactData: {
    name: string;
    company: string;
    email: string;
    phone?: string;
    privacy: boolean;
  }) => {
    // Konvertiere das ChatFormData in ein LeadFormData-Objekt
    const formattedLeadData: LeadFormData = {
      firstName: contactData.name.split(' ')[0],
      lastName: contactData.name.split(' ').slice(1).join(' ') || '',  // Falls kein Nachname
      email: contactData.email,
      phone: contactData.phone || '',
      companyWebsite: `https://${contactData.company.toLowerCase().replace(/\s+/g, '')}.de`,
      privacy: true
    };
    
    setLeadData(formattedLeadData);

    // First generate scores and valuations
    const readinessScore = calculateExitReadiness(calculatorData as CalculatorFormData);
    const { valuationLow, valuationHigh, potentialIncrease, mainBottlenecks } = 
      calculateValuation(calculatorData as CalculatorFormData, readinessScore);

    // Prepare full calculator data with calculated values
    const completeCalculatorData: CalculatorFormData & {
      readinessScore: number;
      valuationLow: number;
      valuationHigh: number;
      potentialIncrease: number;
      mainBottlenecks: string;
    } = {
      ...(calculatorData as CalculatorFormData),
      readinessScore,
      valuationLow,
      valuationHigh,
      potentialIncrease,
      mainBottlenecks: JSON.stringify(mainBottlenecks),
    };

    // Submit to API
    submitMutation.mutate({
      calculatorData: completeCalculatorData,
      leadData: formattedLeadData,
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-neutral-light px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-[#233656]">Dein exitcheck</h3>
            <span className="text-sm font-medium text-[#64748B]">
              Schritt {currentStep} von {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2.5 bg-[#E5E7EB]" />
        </div>

        {/* Form Steps */}
        <div className="p-6 md:p-8">
          {currentStep === 1 && (
            <BusinessModelStep
              data={calculatorData}
              onNext={handleNextStep}
            />
          )}

          {currentStep === 2 && (
            <FinancialsStep
              data={calculatorData}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}

          {currentStep === 3 && (
            <FounderDependencyStep
              data={calculatorData}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}

          {currentStep === 4 && (
            <SystemsProcessesStep
              data={calculatorData}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}

          {currentStep === 5 && (
            <CustomerRetentionStep
              data={calculatorData}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}

          {currentStep === 6 && (
            <ContactInfoStep
              onSubmit={handleSubmit}
              onPrev={handlePrevStep}
              isSubmitting={submitMutation.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}
