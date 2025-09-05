import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import ChatInterface from '@/components/chat/ChatInterface';
import { calculateExitReadiness, calculateValuation } from '@/lib/calculationUtils';
import { type CalculatorFormData, type LeadFormData, type ExitCalculatorResult } from '@shared/schema';

type ChatSection = 'businessModel' | 'financials' | 'founderDependency' | 'systemsProcesses' | 'customerRetention' | 'contactInfo';

interface ChatCalculatorProps {
  onCalculationComplete: (results: ExitCalculatorResult) => void;
}

export default function ChatCalculator({ onCalculationComplete }: ChatCalculatorProps) {
  const [currentSection, setCurrentSection] = useState<ChatSection>('businessModel');
  const [calculatorData, setCalculatorData] = useState<Partial<CalculatorFormData>>({});
  const [leadData, setLeadData] = useState<Partial<LeadFormData>>({});
  const { toast } = useToast();
  
  const sections: ChatSection[] = [
    'businessModel',
    'financials',
    'founderDependency',
    'systemsProcesses',
    'customerRetention',
    'contactInfo'
  ];
  
  const currentSectionIndex = sections.indexOf(currentSection);
  const progress = ((currentSectionIndex + 1) / sections.length) * 100;
  
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

  const handleDataCollected = (data: Partial<CalculatorFormData>) => {
    // Update the collected data
    setCalculatorData(prev => ({ ...prev, ...data }));
    
    // If we're on the last section (contactInfo), handle lead data collection
    if (currentSection === 'contactInfo') {
      // Extract contact info from the JSON string in contactInfo field
      let contactData: LeadFormData;
      
      if (data.contactInfo) {
        try {
          // Parse the contact information from the JSON string
          const contactInfoObj = JSON.parse(data.contactInfo);
          contactData = {
            name: contactInfoObj.name || "Max Mustermann",
            company: contactInfoObj.company || "Muster GmbH",
            email: contactInfoObj.email || "example@domain.com",
            phone: contactInfoObj.phone || undefined,
            privacy: true,
          };
        } catch (error) {
          console.error('Error parsing contact info:', error);
          // Fallback in case parsing fails
          contactData = {
            name: "Max Mustermann",
            company: "Muster GmbH",
            email: "example@domain.com",
            privacy: true,
          };
        }
      } else {
        // Fallback if no contact info provided
        contactData = {
          name: "Max Mustermann",
          company: "Muster GmbH",
          email: "example@domain.com",
          privacy: true,
        };
      }
      
      setLeadData(contactData);
      handleFinalSubmit(contactData);
    } else {
      // Move to the next section
      const nextIndex = currentSectionIndex + 1;
      if (nextIndex < sections.length) {
        setCurrentSection(sections[nextIndex]);
      }
    }
  };
  
  const handlePrevSection = () => {
    const prevIndex = currentSectionIndex - 1;
    if (prevIndex >= 0) {
      setCurrentSection(sections[prevIndex]);
    }
  };
  
  const handleFinalSubmit = (contactData: LeadFormData) => {
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
      leadData: contactData,
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
              Schritt {currentSectionIndex + 1} von {sections.length}
            </span>
          </div>
          <Progress value={progress} className="h-2.5 bg-[#E5E7EB]" />
        </div>
        
        {/* Chat Interface */}
        <div className="p-6 md:p-8">
          <ChatInterface 
            section={currentSection}
            existingData={calculatorData}
            onDataCollected={handleDataCollected}
            onBack={currentSectionIndex > 0 ? handlePrevSection : undefined}
          />
        </div>
      </div>
    </div>
  );
}
