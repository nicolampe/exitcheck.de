import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormAnswers, leadFormSchema, LeadFormData } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';
import QuestionRenderer from '@/components/questionnaire/QuestionRenderer';
import ResultsDisplay from '@/components/questionnaire/ResultsDisplay';
import LeadForm from '@/components/questionnaire/LeadForm';
import { ShieldCheck, Clock, Trophy } from 'lucide-react';

interface QuestionData {
  id: string;
  text: string;
  type: string;
  options?: any[];
  scale_min?: number;
  scale_max?: number;
  urgency?: Record<string, string>;
  tags?: Record<string, string>;
}

interface QuestionsData {
  questions: QuestionData[];
  score_ranges: Record<string, { label: string; comment: string }>;
  valuation_multiples: Record<string, any>;
  motivation_profiles: Record<string, string>;
}

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

interface QuestionnaireFormProps {
  initialCompanyType?: string;
}

// Unternehmstypen Optionen für das erste Auswahlfeld
const companyTypes = [
  { id: 'personengesellschaft', label: 'Personengesellschaft' },
  { id: 'kapitalgesellschaft', label: 'Kapitalgesellschaft' },
  { id: 'einzelunternehmen', label: 'Einzelunternehmen' },
];

export default function QuestionnaireForm({ initialCompanyType }: QuestionnaireFormProps) {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Vorausgewählte Gesellschaftsform berücksichtigen
  useEffect(() => {
    if (initialCompanyType && questions.length > 0) {
      // Gesellschaftsform als Antwort auf die erste Frage setzen
      setAnswers(prev => ({
        ...prev,
        q0: initialCompanyType
      }));
      
      // Zum zweiten Schritt springen, wenn die Gesellschaftsform bereits gewählt wurde
      if (currentQuestionIndex === 0) {
        setCurrentQuestionIndex(1);
      }
    }
  }, [initialCompanyType, questions]);

  // Laden der Fragen vom Server
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questionnaire');
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Fragen');
        }
        const data: QuestionsData = await response.json();
        setQuestions(data.questions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Fehler beim Laden der Fragen. Bitte versuchen Sie es später erneut.');
        setIsLoading(false);
      }
    };

    fetchQuestions().catch((err) => {
      console.error('Unhandled error in fetchQuestions:', err);
      setError('Fehler beim Laden der Fragen. Bitte versuchen Sie es später erneut.');
      setIsLoading(false);
    });
  }, []);

  // Fortschritt des Fragebogens in Prozent
  const progress = questions.length > 0 
    ? Math.round((currentQuestionIndex / questions.length) * 100) 
    : 0;

  // Aktuelle Frage
  const currentQuestion = questions[currentQuestionIndex];

  // Score berechnen und direkt das Lead-Formular anzeigen
  const calculateScoreAndShowLeadForm = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/questionnaire/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Berechnung');
      }
      
      const data = await response.json();
      if (data.success) {
        setScoreResult(data.result);
        // Direkt zum Lead-Formular wechseln
        setShowLeadForm(true);
      } else {
        throw new Error('Fehler bei der Berechnung');
      }
    } catch (error) {
      console.error('Error calculating score:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler bei der Berechnung des Scores. Bitte versuchen Sie es später erneut.',
        variant: 'destructive',
      });
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Antworten aktualisieren und zur nächsten Frage gehen
  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    // Zur nächsten Frage gehen oder zum Lead-Formular wechseln
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Nach der letzten Frage berechnen wir den Score und zeigen das Lead-Formular an
      calculateScoreAndShowLeadForm();
    }
  };

  // Zur vorherigen Frage zurückgehen
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Score berechnen und Ergebnisse anzeigen (für den manuellen Button)
  const calculateScore = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/questionnaire/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Berechnung');
      }
      
      const data = await response.json();
      if (data.success) {
        setScoreResult(data.result);
        setShowResults(true);
      } else {
        throw new Error('Fehler bei der Berechnung');
      }
    } catch (error) {
      console.error('Error calculating score:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler bei der Berechnung des Scores. Bitte versuchen Sie es später erneut.',
        variant: 'destructive',
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // Lead-Formular als letzte Frage anzeigen
  const handleShowLeadForm = () => {
    // Wir zeigen das Lead-Formular in derselben Karte an
    setShowResults(true); // Behält das Ergebnis bei
    setShowLeadForm(true);
  };

  // Lead-Daten absenden
  const handleLeadSubmit = async (leadData: LeadFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/questionnaire/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, leadData }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Speichern der Daten');
      }
      
      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Erfolgreich',
          description: 'Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden.',
        });
        
        // Zur Danke-Seite weiterleiten mit der Ergebnis-ID
        const resultId = data.result?.resultId || data.result?.id;
        if (resultId) {
          window.location.href = `/thank-you/${resultId}`;
        } else {
          // Wenn keine ID verfügbar ist, zeigen wir die Ergebnisse direkt an
          setShowLeadForm(false);
          setShowResults(true);
        }
      } else {
        throw new Error('Fehler beim Speichern der Daten');
      }
    } catch (error) {
      console.error('Error submitting lead data:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Speichern der Daten. Bitte versuchen Sie es später erneut.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fragebogen neu starten
  const resetQuestionnaire = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setScoreResult(null);
    setShowResults(false);
    setShowLeadForm(false);
  };

  // Wenn die Fragen geladen werden
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh] sm:min-h-[40vh] mb-12 sm:mb-20 px-4 sm:px-0">
        <Card className="w-full max-w-3xl mx-auto shadow-sm border border-slate-100">
          <CardContent className="flex flex-col items-center justify-center p-5 sm:p-8">
            <div className="animate-pulse text-center">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-primary">Fragebogen wird geladen...</h2>
              <Progress value={50} className="w-36 sm:w-48 h-1" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Wenn ein Fehler auftritt
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] sm:min-h-[60vh] px-4 sm:px-0">
        <Card className="w-full max-w-3xl sm:max-w-4xl mx-auto p-4 sm:p-6">
          <CardContent className="flex flex-col items-center justify-center p-5 sm:p-10">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-serif mb-3 sm:mb-4 text-destructive">Fehler beim Laden</h2>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
              <Button onClick={() => window.location.reload()} size="sm" className="text-xs sm:text-sm py-1.5 sm:py-2 h-auto">Erneut versuchen</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Erste Auswahl, wenn noch keine Gesellschaftsform gewählt wurde
  const renderCompanyTypeSelection = () => {
    return (
      <div>
        <h2 className="text-xl md:text-2xl font-semibold mb-5 text-primary">Welche Gesellschaftsform hat Ihr Unternehmen?</h2>
        <div className="space-y-3 mb-6">
          {companyTypes.map((type) => (
            <div 
              key={type.id} 
              className="flex items-center space-x-3 border p-5 rounded-lg bg-white hover:border-primary cursor-pointer transition-all"
              onClick={() => {
                setAnswers(prev => ({ ...prev, q0: type.id }));
                localStorage.setItem('selectedCompanyType', type.id);
                setCurrentQuestionIndex(1); // zum nächsten Schritt springen
              }}
            >
              <input 
                type="radio" 
                id={`company-type-${type.id}`}
                name="companyType"
                checked={answers.q0 === type.id}
                onChange={() => {}}
                className="h-5 w-5 text-primary"
              />
              <label htmlFor={`company-type-${type.id}`} className="cursor-pointer flex-grow font-medium text-base">
                {type.label}
              </label>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 mb-2">Wichtig für die korrekte Bewertung Ihres Unternehmens</p>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4 text-primary mr-1" /> Sichere Daten
            </div>
            <div className="flex items-center text-xs text-slate-600">
              <Clock className="h-4 w-4 text-primary mr-1" /> 5 Min. Analyse
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-4 sm:mb-6 md:mb-8">
      <div className="w-full mx-auto">
        <div className="p-0">
          {!showResults && !showLeadForm && (
            <div>
              {/* Gesellschaftsform-Auswahl wenn keine gewählt oder wir im ersten Schritt sind */}
              {(!answers.q0 || currentQuestionIndex === 0) ? (
                renderCompanyTypeSelection()
              ) : (
                <>
                  <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                      <span>Frage {currentQuestionIndex} von {questions.length}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1 sm:h-1.5 md:h-2" />
                  </div>
                  
                  {currentQuestion && (
                    <QuestionRenderer
                      question={currentQuestion}
                      onAnswer={handleAnswer}
                      currentAnswer={answers[currentQuestion.id]}
                    />
                  )}
                </>
              )}
              
              <div className="flex justify-between mt-4 sm:mt-6 md:mt-8">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  size="sm"
                  className="text-xs sm:text-sm py-1 sm:py-1.5 h-auto"
                >
                  Zurück
                </Button>
                
                {/* Keinen Weiter-Button anzeigen, da dieser bereits im QuestionRenderer enthalten ist */}
              </div>
            </div>
          )}
          
          {showResults && scoreResult && (
            <ResultsDisplay 
              result={scoreResult} 
              onRequestContact={handleShowLeadForm}
              onRestart={resetQuestionnaire}
            />
          )}
          
          {showLeadForm && (
            <LeadForm 
              onSubmit={handleLeadSubmit} 
              isSubmitting={isSubmitting}
              onBack={() => {
                setShowLeadForm(false);
                setShowResults(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}