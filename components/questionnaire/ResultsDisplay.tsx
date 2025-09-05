import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Repeat, Star, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ScoreResult {
  readinessScore: number;
  scoreLabel: string;
  scoreComment: string;
  valuationLow: number;
  valuationHigh: number;
  potentialIncrease: number;
  urgency: string;
  segment: string;
  motivationTags: string[];
}

interface ResultsDisplayProps {
  result: ScoreResult;
  onRequestContact: () => void;
  onRestart: () => void;
}

export default function ResultsDisplay({ result, onRequestContact, onRestart }: ResultsDisplayProps) {
  // Zahlen mit Tausenderpunkten und € formatieren
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Score-Farbe basierend auf dem Wert
  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-red-500';
    if (score < 75) return 'text-amber-500';
    return 'text-green-500';
  };

  // Motivation-Profile-Beschreibungen
  const motivationProfiles = {
    'freedom': 'Freiheitsorientiert – Zeit für persönliche Projekte und Freizeit ist Ihnen wichtig.',
    'security': 'Sicherheitsorientiert – Finanzielle Absicherung steht für Sie im Vordergrund.',
    'growth': 'Wachstumsorientiert – Sie möchten neue Projekte und Ideen verwirklichen.',
    'relief': 'Entlastungssuchend – Reduzierung von Stress und Verantwortung ist Ihr Ziel.',
    'ego': 'Anerkennungsorientiert – Der Verkauf als Krönung Ihrer unternehmerischen Laufbahn.',
  };

  return (
    <div className="space-y-6">
      {/* Readiness-Score */}
      <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-primary">Ihr Exit-Readiness Score</h2>
        <div className="inline-flex items-center justify-center bg-slate-100 rounded-full w-24 h-24 sm:w-32 sm:h-32 border-3 sm:border-4 border-slate-200">
          <div className="text-center">
            <div className={`text-2xl sm:text-3xl font-bold ${getScoreColor(result.readinessScore)}`}>
              {result.readinessScore}%
            </div>
            <div className="text-xs sm:text-sm font-medium">{result.scoreLabel}</div>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">{result.scoreComment}</p>
      </div>

      {/* Bewertung */}
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-200">
          <h3 className="text-sm sm:text-md font-semibold text-primary flex items-center gap-1.5 sm:gap-2">
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 fill-amber-500" />
            Unternehmensbewertung
          </h3>
        </div>
        <div className="p-3 sm:p-4 grid gap-3 sm:gap-4">
          <div>
            <div className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Aktuelle Wertspanne</div>
            <div className="text-base sm:text-lg font-semibold">
              {formatCurrency(result.valuationLow)} – {formatCurrency(result.valuationHigh)}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 sm:pt-4">
            <div className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Mögliche Steigerung</div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-semibold text-primary">
                + {formatCurrency(result.potentialIncrease)}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500">
                bei optimaler Exit-Vorbereitung
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation */}
      {result.motivationTags.length > 0 && (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-200">
            <h3 className="text-sm sm:text-md font-semibold text-primary">
              Ihre Motivation
            </h3>
          </div>
          <div className="p-3 sm:p-4">
            <ul className="space-y-2 sm:space-y-3">
              {result.motivationTags.map((tag, index) => (
                <li key={index} className="flex gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{motivationProfiles[tag as keyof typeof motivationProfiles]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Nächste Schritte */}
      <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-2 sm:space-y-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="bg-primary/20 rounded-full p-1 sm:p-1.5">
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-primary">
            Wie könnte Ihr Unternehmen noch mehr wert sein?
          </h3>
        </div>
        <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
          Füllen Sie Ihre Kontaktdaten aus und erhalten Sie kostenlos per WhatsApp einen detaillierten Report mit konkreten Stellschrauben, um Ihren Verkaufswert zu maximieren.
        </p>
        <div className="flex justify-end">
          <Button 
            onClick={onRequestContact}
            size="sm"
            variant="outline"
            className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 h-auto border-primary text-primary hover:bg-primary hover:text-white"
          >
            Kostenlosen Report anfordern
          </Button>
        </div>
      </div>

      {/* Button zum Neustarten */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={onRestart} className="gap-1.5 sm:gap-2 text-[10px] sm:text-xs py-1 h-auto">
          <Repeat className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          Fragebogen neu starten
        </Button>
      </div>
    </div>
  );
}