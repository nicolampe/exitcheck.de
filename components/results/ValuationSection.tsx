import { Card, CardContent } from "@/components/ui/card";

interface ValuationSectionProps {
  valuationLow: number;
  valuationHigh: number;
  potentialIncrease: number;
}

// Format currency function
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
};

export default function ValuationSection({ 
  valuationLow, 
  valuationHigh, 
  potentialIncrease 
}: ValuationSectionProps) {
  const potentialValue = formatCurrency(potentialIncrease);
  
  return (
    <Card className="bg-white rounded-xl shadow-md mb-8">
      <CardContent className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-[#233656] mb-4">Geschätzter Verkaufspreis</h3>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="block text-4xl font-bold text-primary">
              {formatCurrency(valuationLow)} - {formatCurrency(valuationHigh)}
            </span>
            <span className="text-[#64748B]">Basierend auf deinen aktuellen Kennzahlen</span>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="block text-lg font-semibold text-[#10B981]">
              + {potentialValue} Potenzial
            </span>
            <span className="text-sm text-[#64748B]">Mit den richtigen Optimierungen</span>
          </div>
        </div>
        
        <div className="p-5 border border-neutral-light bg-[#F8F9FB] rounded-lg">
          <h4 className="font-medium text-[#233656] mb-3">Bewertungsdetails</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-[#64748B]">Multiplikator</div>
              <div className="font-medium text-[#233656]">4.0x - 5.0x jährlicher Gewinn</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-[#64748B]">Vergleichbare Exits</div>
              <div className="font-medium text-[#233656]">3.8x - 5.2x in deiner Branche</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-[#64748B]">Optimierter Multiplikator</div>
              <div className="font-medium text-[#233656]">6.0x - 7.0x mit den empfohlenen Verbesserungen</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
