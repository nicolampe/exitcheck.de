import React from 'react';
import { useLocation, useRoute } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, ChevronRight, Phone, Clock, MessageCircle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export default function ThankYouPage() {
  const [_match, params] = useRoute('/thank-you/:resultId');
  const [pixelFired, setPixelFired] = React.useState(false);
  
  // Daten mit React Query laden
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/questionnaire/result/${params?.resultId || ''}`],
    enabled: !!params?.resultId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retryOnMount: false,
    staleTime: Infinity,
    retry: 1,
    queryFn: async () => {
      if (!params?.resultId) {
        throw new Error('Keine Ergebnis-ID gefunden');
      }
      const response = await fetch(`/api/questionnaire/result/${params.resultId}`);
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Ergebnisse');
      }
      return response.json();
    }
  });

  // Extrahieren des Ergebnisses
  const result = data?.success ? data.result : null;
  
  // Meta Pixel Event senden, wenn Daten geladen sind
  React.useEffect(() => {
    if (result && !isLoading && !pixelFired && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        page: 'thank-you',
        industry: result.industry || '',
        readiness_score: result.readinessScore || 0,
        valuation_low: result.valuationLow || 0,
        valuation_high: result.valuationHigh || 0
      });
      console.log('Meta Pixel Lead-Event gesendet', result);
      setPixelFired(true);
    }
  }, [result, isLoading, pixelFired]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <Card className="w-full border border-slate-100 shadow-sm">
          <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="animate-pulse text-center">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary">Ergebnisse werden geladen...</h2>
              <Progress value={50} className="w-48 sm:w-64 h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fehlerbehandlung
  const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
  
  if (error || !params?.resultId) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <Card className="w-full border border-slate-100 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-destructive">Fehler beim Laden</h2>
              <p className="mb-6 text-slate-600">
                {!params?.resultId 
                  ? 'Keine Ergebnis-ID gefunden' 
                  : 'Die Ergebnisse konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'}
              </p>
              <Button onClick={() => window.location.href = '/questionnaire'}>Zurück zum Fragebogen</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <Card className="w-full border border-slate-100 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-destructive">Ergebnis nicht gefunden</h2>
              <p className="mb-6 text-slate-600">Leider konnten wir keine Ergebnisse zu dieser ID finden.</p>
              <Button onClick={() => window.location.href = '/questionnaire'}>Zurück zum Fragebogen</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Card className="w-full border border-slate-100 shadow-sm mb-8">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-3 text-primary">Vielen Dank für Ihre Anfrage!</h1>
            <p className="text-lg text-slate-700 mb-2">Wir haben Ihre Informationen erhalten und werden uns in Kürze bei Ihnen melden.</p>
          </div>

          {result && (
            <div className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-3 text-slate-800">Ihr Exit-Readiness Score</h3>
                  <div className="flex items-center mb-2">
                    <Progress value={result.readinessScore} className="h-3 flex-grow mr-3" />
                    <span className="text-xl font-semibold">{result.readinessScore}%</span>
                  </div>
                  <p className="text-sm text-slate-600">{result.scoreComment}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-3 text-slate-800">Geschätzter Unternehmenswert</h3>
                  <p className="text-2xl font-semibold mb-1">
                    {formatCurrency(result.valuationLow)} - {formatCurrency(result.valuationHigh)}
                  </p>
                  <p className="text-sm text-slate-600">
                    Mit gezielten Optimierungen: <span className="font-medium">+{formatCurrency(result.potentialIncrease)}</span>
                  </p>
                </div>
              </div>

              {/* Überarbeitete Sektion für Optimierungspotenziale mit M&A-Fachwissen */}
              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium mb-4 text-slate-800">Transaktionswert-Optimierungspotenziale</h3>
                
                {/* Methode und Multiplikatoren Info */}
                <div className="mb-6 bg-white p-4 rounded-lg border border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-1">Bewertungsmethode</h4>
                      <p className="text-xs text-slate-900">
                        <span className="font-medium">EBITDA-Multiple-Verfahren</span> mit branchenspezifischen Multiplikatoren 
                        <span className="block mt-1 text-xs text-slate-500 italic">Quelle: BVK Transaktionsdatenbank 2024</span>
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-1">Branchenüblicher Multiple</h4>
                      <p className="text-xs text-slate-900">
                        {(() => {
                          const industry = result.answers ? JSON.parse(result.answers).q1 : "Beratung & Dienstleistungen";
                          let multipleRange = "4,0x - 6,0x";
                          
                          if (industry === "Handel & E-Commerce") multipleRange = "4,0x - 6,0x";
                          else if (industry === "SaaS & IT") multipleRange = "5,0x - 8,0x";
                          else if (industry === "Fertigung & Produktion") multipleRange = "3,5x - 5,0x";
                          else if (industry === "Gastronomie & Hotellerie") multipleRange = "3,0x - 4,5x";
                          else if (industry === "Immobilien") multipleRange = "6,0x - 9,0x";
                          
                          return <span className="font-medium">{multipleRange} norm. EBITDA</span>;
                        })()}
                        <span className="block mt-1 text-xs text-slate-500 italic">Nach Bereinigung um nicht-operative Kosten</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Wertrechner + Überschrift */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg border border-slate-100">
                  <div>
                    <h4 className="text-base font-semibold text-slate-800 mb-1">Aktueller vs. optimierter Wert</h4>
                    <p className="text-xs text-slate-600">Bei Umsetzung aller Optimierungsmaßnahmen</p>
                  </div>
                  <div className="text-right mt-3 sm:mt-0">
                    {(() => {
                      // Realistische Berechnungslogik für M&A
                      // Wir verwenden den niedrigsten Wert als angezeigten aktuellen Wert
                      const currentValue = result.valuationLow;
                      const highValue = result.valuationHigh;
                      
                      // Realistischere Faktoren für die verschiedenen Optimierungspotenziale
                      const factorGründer = 0.17; // max 17% Wertsteigerung
                      const factorKunden = 0.12;  // max 12% Wertsteigerung
                      const factorDoku = 0.06;    // max 6% Wertsteigerung
                      
                      // Berechnung der potentiellen Wertsteigerung pro Kategorie
                      // Basierend auf aktuellen Antworten - wie weit ist man schon optimiert?
                      const q6Value = result.answers ? parseInt(JSON.parse(result.answers).q6) : 3;
                      const q7Value = result.answers ? parseInt(JSON.parse(result.answers).q7) : 3; 
                      const q8Value = result.answers ? parseInt(JSON.parse(result.answers).q8) : 3;
                      
                      // Je niedriger der Wert, desto mehr Potenzial gibt es (5=optimal, 1=viel Potenzial)
                      const potentialFactorGründer = Math.max(0, (5 - q6Value) / 4) * factorGründer;
                      const potentialFactorKunden = Math.max(0, (5 - q7Value) / 4) * factorKunden;
                      const potentialFactorDoku = Math.max(0, (5 - q8Value) / 4) * factorDoku;
                      
                      // Berechnung der absoluten Potenzialwerte basierend auf dem höchsten Wert
                      const potentialGründer = Math.round(highValue * potentialFactorGründer);
                      const potentialKunden = Math.round(highValue * potentialFactorKunden);
                      const potentialDoku = Math.round(highValue * potentialFactorDoku);
                      
                      // KORREKTUR: Der optimierte Wert muss den Höchstwert plus alle Potenziale enthalten
                      // Nicht den Niedrigwert plus Potenziale
                      const totalPotentialValue = highValue + potentialGründer + potentialKunden + potentialDoku;
                      
                      // Temporäre Speicherung für Verwendung in den Komponenten
                      const potentials = {
                        currentValue,              // Niedrigster Wert für Anzeige
                        highValue,                 // Höchster Wert (für interne Berechnungen)
                        potentialGründer,
                        potentialKunden,
                        potentialDoku,
                        totalPotentialValue,       // Höchstwert + alle Potenziale
                        timeGründer: potentialGründer > highValue * 0.05 ? 'mittelfristig' : 'kurzfristig',
                        timeKunden: potentialKunden > highValue * 0.05 ? 'mittelfristig' : 'kurzfristig',
                        timeDoku: potentialDoku > highValue * 0.03 ? 'kurzfristig' : 'kurzfristig'
                      };
                      
                      // @ts-ignore - Speichern in globaler Variable für JSX-Zugriff
                      window._potentials = potentials;
                      
                      // Korrekte prozentuale Steigerung berechnen:
                      // (Optimierter Wert - Ist-Wert niedrig) / Ist-Wert niedrig
                      const steigerungProzent = Math.round((totalPotentialValue/currentValue - 1) * 100);
                      
                      return (
                        <>
                          <p className="text-sm text-slate-700">Aktuell: <span className="font-semibold">{formatCurrency(currentValue)}</span></p>
                          <p className="text-base font-bold text-primary">
                            Optimiert: <span>{formatCurrency(totalPotentialValue)}</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Steigerungspotenzial: <span className="font-semibold">{steigerungProzent}%</span>
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Gründerabhängigkeit */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="text-sm font-medium text-slate-700">Gründerabhängigkeit reduzieren</span>
                      {/* @ts-ignore */}
                      <span className="ml-2 text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{window._potentials?.timeGründer}</span>
                    </div>
                    {/* @ts-ignore - Zugriff auf temporär gespeicherte Werte */}
                    <span className="text-sm font-bold text-primary">+{formatCurrency(window._potentials?.potentialGründer || 0)}</span>
                  </div>
                  <div className="relative w-full h-8 bg-slate-200 rounded overflow-hidden">
                    {/* Ist-Zustand anhand der Fragebogenantwort berechnen */}
                    {(() => {
                      const q6Value = result.answers ? parseInt(JSON.parse(result.answers).q6) : 3;
                      const percentDone = Math.min(100, Math.max(10, q6Value * 20));
                      const percentRemaining = 100 - percentDone;
                    
                      return (
                        <>
                          <div className="absolute left-0 top-0 h-full bg-[#1E293B] rounded-l" 
                               style={{ width: `${percentDone}%`, zIndex: 10 }}>
                          </div>
                          <div className="absolute left-0 top-0 h-full bg-primary/30 rounded-r" 
                               style={{ width: '100%', clipPath: `inset(0 0 0 ${percentDone}%)` }}>
                          </div>
                        </>
                      );
                    })()}
                    {/* Skala */}
                    <div className="absolute inset-0 flex justify-between items-center px-2">
                      <span className="text-xs font-semibold" style={{color: 'white', zIndex: 20, textShadow: '0px 0px 2px rgba(0,0,0,0.7)'}}>
                        Ist-Zustand
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        Potenzial
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    <span className="font-medium">M&A-Perspektive:</span> Gründerunabhängigkeit erhöht EBITDA-Multiplikator durch Risikominderung. Typisches Add-Back-Potenzial bei Management-Ersatz: 15-20%.
                  </p>
                </div>
                
                {/* Kundenbindung */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="text-sm font-medium text-slate-700">Kundenbindung verbessern</span>
                      {/* @ts-ignore */}
                      <span className="ml-2 text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{window._potentials?.timeKunden}</span>
                    </div>
                    {/* @ts-ignore - Zugriff auf temporär gespeicherte Werte */}
                    <span className="text-sm font-bold text-primary">+{formatCurrency(window._potentials?.potentialKunden || 0)}</span>
                  </div>
                  <div className="relative w-full h-8 bg-slate-200 rounded overflow-hidden">
                    {/* Ist-Zustand anhand der Fragebogenantwort berechnen */}
                    {(() => {
                      const q7Value = result.answers ? parseInt(JSON.parse(result.answers).q7) : 3;
                      const percentDone = Math.min(100, Math.max(10, q7Value * 20));
                      const percentRemaining = 100 - percentDone;
                    
                      return (
                        <>
                          <div className="absolute left-0 top-0 h-full bg-[#1E293B] rounded-l" 
                               style={{ width: `${percentDone}%`, zIndex: 10 }}>
                          </div>
                          <div className="absolute left-0 top-0 h-full bg-primary/30 rounded-r" 
                               style={{ width: '100%', clipPath: `inset(0 0 0 ${percentDone}%)` }}>
                          </div>
                        </>
                      );
                    })()}
                    {/* Skala */}
                    <div className="absolute inset-0 flex justify-between items-center px-2">
                      <span className="text-xs font-semibold" style={{color: 'white', zIndex: 20, textShadow: '0px 0px 2px rgba(0,0,0,0.7)'}}>
                        Ist-Zustand
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        Potenzial
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    <span className="font-medium">M&A-Perspektive:</span> ARR (Annual Recurring Revenue) und hohe Kundenretention sind kritische KPIs für Investoren. Ø-Transaktionsmultiplikatoren steigen bei mehr als 80% wiederkehrenden Umsätzen um bis zu 1.5x.
                  </p>
                </div>
                
                {/* Dokumentation und Prozesse */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="text-sm font-medium text-slate-700">Dokumentation & Prozesse</span>
                      {/* @ts-ignore */}
                      <span className="ml-2 text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{window._potentials?.timeDoku}</span>
                    </div>
                    {/* @ts-ignore - Zugriff auf temporär gespeicherte Werte */}
                    <span className="text-sm font-bold text-primary">+{formatCurrency(window._potentials?.potentialDoku || 0)}</span>
                  </div>
                  <div className="relative w-full h-8 bg-slate-200 rounded overflow-hidden">
                    {/* Ist-Zustand anhand der Fragebogenantwort berechnen */}
                    {(() => {
                      const q8Value = result.answers ? parseInt(JSON.parse(result.answers).q8) : 3;
                      const percentDone = Math.min(100, Math.max(10, q8Value * 20));
                      const percentRemaining = 100 - percentDone;
                    
                      return (
                        <>
                          <div className="absolute left-0 top-0 h-full bg-[#1E293B] rounded-l" 
                               style={{ width: `${percentDone}%`, zIndex: 10 }}>
                          </div>
                          <div className="absolute left-0 top-0 h-full bg-primary/30 rounded-r" 
                               style={{ width: '100%', clipPath: `inset(0 0 0 ${percentDone}%)` }}>
                          </div>
                        </>
                      );
                    })()}
                    {/* Skala */}
                    <div className="absolute inset-0 flex justify-between items-center px-2">
                      <span className="text-xs font-semibold" style={{color: 'white', zIndex: 20, textShadow: '0px 0px 2px rgba(0,0,0,0.7)'}}>
                        Ist-Zustand
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        Potenzial
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    <span className="font-medium">M&A-Perspektive:</span> Due-Diligence-Readiness reduziert Transaktionstiming um 30-40%. Die Transaktionssicherheit steigt signifikant bei dokumentierten Prozessen und Verträgen.
                  </p>
                </div>
                
                {/* Vergleichstransaktionen */}
                <div className="bg-white rounded-lg p-3 border border-slate-100">
                  <h4 className="text-xs font-medium text-slate-700 mb-2">Aktuelle Vergleichstransaktionen in Ihrer Branche</h4>
                  <div className="text-xs text-slate-600 mb-2">
                    {(() => {
                      const industry = result.answers ? JSON.parse(result.answers).q1 : "Beratung & Dienstleistungen";
                      
                      if (industry === "Handel & E-Commerce") {
                        return (
                          <ul className="list-disc pl-4 space-y-1 text-[10px] sm:text-xs">
                            <li>Online-Shop im Bereich Heimwerkerbedarf: 5.1x EBITDA, €2.8M (Q1/2025)</li>
                            <li>Vertriebsunternehmen für Produktionsmaschinen: 4.2x EBITDA, €4.5M (Q4/2024)</li>
                            <li>E-Commerce Fashion: 5.8x EBITDA, €3.2M (Q3/2024)</li>
                          </ul>
                        );
                      } else if (industry === "SaaS & IT") {
                        return (
                          <ul className="list-disc pl-4 space-y-1 text-[10px] sm:text-xs">
                            <li>B2B SaaS für Projektmanagement: 7.5x ARR, €8.2M (Q1/2025)</li>
                            <li>IT-Sicherheitslösungen: 6.8x EBITDA, €5.7M (Q4/2024)</li>
                            <li>Datenanalyse-Plattform: 8.2x ARR, €4.2M (Q3/2024)</li>
                          </ul>
                        );
                      } else {
                        return (
                          <ul className="list-disc pl-4 space-y-1 text-[10px] sm:text-xs">
                            <li>Managementberatung mittelständischer Fokus: 4.5x EBITDA, €3.2M (Q1/2025)</li>
                            <li>Spezialisierte Branchenberatung: 5.2x EBITDA, €2.1M (Q4/2024)</li>
                            <li>Personaldienstleister: 3.8x EBITDA, €4.5M (Q3/2024)</li>
                          </ul>
                        );
                      }
                    })()}
                  </div>
                  <p className="text-[10px] text-slate-500 italic">Quelle: M&A-Transaktionsdatenbank Deutschland 2024/2025</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-primary/5 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium mb-4 text-primary">Nächste Schritte</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-3 bg-primary/10 p-2 rounded-full text-primary">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Gespräch innerhalb von 72 Stunden</h4>
                  <p className="text-slate-600">Unser Experte wird Sie innerhalb der nächsten 72 Stunden kontaktieren, um Ihre Situation zu besprechen.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-3 bg-primary/10 p-2 rounded-full text-primary">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Einige Rückfragen</h4>
                  <p className="text-slate-600">Für eine präzise Bewertung benötigen wir weitere Informationen, die nicht im Fragebogen abgedeckt wurden.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-3 bg-primary/10 p-2 rounded-full text-primary">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Detaillierte Beratung</h4>
                  <p className="text-slate-600">Im Gespräch können wir Ihnen einen genaueren Verkaufswert ermitteln und weitere Schritte besprechen.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button onClick={() => window.location.href = '/'} variant="outline" className="min-w-[200px]">
              Zurück zur Startseite <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}