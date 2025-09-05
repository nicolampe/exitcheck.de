import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShieldCheck, Clock, Trophy } from 'lucide-react';

const companyTypes = [
  { id: 'personengesellschaft', label: 'Personengesellschaft' },
  { id: 'kapitalgesellschaft', label: 'Kapitalgesellschaft' },
  { id: 'einzelunternehmen', label: 'Einzelunternehmen' },
];

export default function ImmediateForm() {
  const [_, navigate] = useLocation();
  const isMobile = useIsMobile();
  const [selectedCompanyType, setSelectedCompanyType] = useState<string>('');
  const [lastCalculations, setLastCalculations] = useState<{time: string, industry: string}>({ 
    time: '11 Minuten', 
    industry: 'Software & IT' 
  });

  // Diese Funktion simuliert, dass alle paar Minuten eine neue Berechnung durchgeführt wurde
  useEffect(() => {
    const industries = [
      'Software & IT', 'Handel', 'E-Commerce', 'Beratung', 'Dienstleistungen', 'Produktion',
      'Gesundheitswesen', 'Bildung', 'Finanzen', 'Handwerk'
    ];
    
    const minutes = ['7', '8', '10', '11', '12', '15', '18', '20'];
    
    const interval = setInterval(() => {
      const randomIndustry = industries[Math.floor(Math.random() * industries.length)];
      const randomMinutes = minutes[Math.floor(Math.random() * minutes.length)];
      
      setLastCalculations({
        time: `${randomMinutes} Minuten`,
        industry: randomIndustry
      });
    }, 1000 * 60 * 5); // Alle 5 Minuten aktualisieren
    
    return () => clearInterval(interval);
  }, []);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Wir speichern den ausgewählten Unternehmertyp in localStorage
    if (selectedCompanyType) {
      localStorage.setItem('selectedCompanyType', selectedCompanyType);
      // Zur Fragebogen-Sektion auf der Startseite scrollen
      const questionnaireSection = document.getElementById('fragebogen-sektion');
      if (questionnaireSection) {
        questionnaireSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <div className="w-full md:max-w-md">
      <Card className="border border-slate-200 shadow-lg bg-slate-50">
        <CardContent className="p-6">
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4">
              <h2 className="font-semibold text-lg text-gray-800 mb-3">Welche Gesellschaftsform hat Ihr Unternehmen?</h2>
              
              <RadioGroup value={selectedCompanyType} onValueChange={setSelectedCompanyType}>
                {companyTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2 border p-3 rounded-lg bg-white hover:border-primary cursor-pointer transition-all mb-2">
                    <RadioGroupItem value={type.id} id={type.id} />
                    <Label htmlFor={type.id} className="cursor-pointer flex-grow text-sm font-medium">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <Button 
                type="submit" 
                className="w-full mt-4 bg-primary hover:bg-primary-dark text-white py-3" 
                disabled={!selectedCompanyType}
              >
                Jetzt Unternehmenswert berechnen
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Trust Elements */}
      <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-3 border-b pb-2">
          <div className="text-xs font-medium">Letzte Wertermittlung</div>
          <div className="text-xs text-slate-500">vor {lastCalculations.time}</div>
        </div>
        <div className="text-xs mb-3">
          <span className="font-medium">Gewählte Branche:</span> {lastCalculations.industry}
        </div>
        
        <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="h-4 w-4 text-primary mb-1" />
            <span>Ihre Daten sicher</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="h-4 w-4 text-primary mb-1" />
            <span>5 Min. Analyse</span>
          </div>
          <div className="flex flex-col items-center">
            <Trophy className="h-4 w-4 text-primary mb-1" />
            <span>TÜV-geprüft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
