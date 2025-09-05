import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyInput } from '@/components/ui/currency-input';

interface QuestionData {
  id: string;
  text: string;
  type: string;
  options?: any[];
  scale_min?: number;
  scale_max?: number;
  tags?: Record<string, string>;
}

interface QuestionRendererProps {
  question: QuestionData;
  onAnswer: (questionId: string, answer: any) => void;
  currentAnswer: any;
}

export default function QuestionRenderer({ question, onAnswer, currentAnswer }: QuestionRendererProps) {
  const [tempAnswer, setTempAnswer] = useState<any>(currentAnswer);

  // Die Formatierung erfolgt nun in der CurrencyInput-Komponente
  
  // Bei Zahlenfeldern wird immer ein neuer State initialisiert, unabhängig vom currentAnswer
  React.useEffect(() => {
    if (question.type === 'number') {
      setTempAnswer('');
    }
  }, [question.id, question.type]);

  // Gibt die Antwort weiter, wenn Eingabetaste gedrückt wird
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tempAnswer) {
      onAnswer(question.id, tempAnswer);
    }
  };
  
  // Prüfen, ob es sich um die letzte Frage handelt (q10)
  const isLastQuestion = question.id === 'q10';

  // Multi-Choice-Antworten verwalten
  const handleMultiChoiceChange = (option: string, checked: boolean) => {
    let newAnswer = [...(Array.isArray(tempAnswer) ? tempAnswer : [])];
    
    if (checked) {
      newAnswer.push(option);
    } else {
      newAnswer = newAnswer.filter(item => item !== option);
    }
    
    setTempAnswer(newAnswer);
  };

  // Button-Text je nach Frage anpassen
  const buttonText = isLastQuestion ? "Auswertung starten" : "Weiter";

  // Gemeinsamer Button für alle Fragetypen
  const ActionButton = () => (
    <div className="flex justify-end mt-3 sm:mt-4">
      <Button
        onClick={() => {
          if (question.type === 'multi-choice') {
            onAnswer(question.id, tempAnswer || []);
          } else {
            tempAnswer && onAnswer(question.id, tempAnswer);
          }
        }}
        disabled={question.type === 'multi-choice' 
          ? !Array.isArray(tempAnswer) || tempAnswer.length === 0
          : !tempAnswer}
        size="sm"
        className="w-full sm:w-auto px-6 py-1"
      >
        {buttonText}
      </Button>
    </div>
  );
  
  // Rendern je nach Fragetyp
  switch (question.type) {
    case 'dropdown':
      return (
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-base sm:text-lg font-semibold leading-tight">{question.text}</h2>
          <div className="mt-2 sm:mt-3">
            <Select 
              value={tempAnswer} 
              onValueChange={(value) => {
                setTempAnswer(value);
              }}
            >
              <SelectTrigger className="w-full text-sm h-11">
                <SelectValue placeholder="Bitte auswählen" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ActionButton />
          </div>
        </div>
      );

    case 'number':
      return (
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-base sm:text-lg font-semibold leading-tight">{question.text}</h2>
          <div className="mt-2 sm:mt-3">
            <CurrencyInput
              className="py-2 sm:py-3 h-11 sm:h-12"
              value={tempAnswer || ''}
              onChange={(value) => setTempAnswer(value)}
              onKeyDown={handleKeyDown}
              placeholder="0 €"
            />
            <ActionButton />
          </div>
        </div>
      );

    case 'single-choice':
      return (
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-base sm:text-lg font-semibold leading-tight">{question.text}</h2>
          <div className="mt-2 sm:mt-3">
            <RadioGroup
              value={tempAnswer || ''}
              onValueChange={(value) => {
                setTempAnswer(value);
              }}
              className="space-y-2"
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 border p-3 rounded-lg hover:border-primary cursor-pointer">
                  <RadioGroupItem value={option.label} id={`option-${index}`} className="w-4 h-4" />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer flex-grow text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <ActionButton />
          </div>
        </div>
      );

    case 'scale':
      const min = question.scale_min || 1;
      const max = question.scale_max || 5;
      
      return (
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-base sm:text-lg font-semibold leading-tight">{question.text}</h2>
          <div className="mt-2 sm:mt-3">
            <RadioGroup
              value={tempAnswer || ''}
              onValueChange={(value) => {
                setTempAnswer(value);
              }}
              className="space-y-2"
            >
              {Array.from({ length: max - min + 1 }).map((_, i) => {
                const value = (min + i).toString();
                return (
                  <div key={i} className="flex items-center space-x-3 border p-3 rounded-lg hover:border-primary cursor-pointer">
                    <RadioGroupItem value={value} id={`scale-${value}`} className="w-4 h-4" />
                    <Label htmlFor={`scale-${value}`} className="cursor-pointer flex-grow text-sm">
                      {value} - {question.options?.[i] || `Option ${value}`}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
            <ActionButton />
          </div>
        </div>
      );

    case 'multi-choice':
      return (
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-base sm:text-lg font-semibold leading-tight">{question.text}</h2>
          <div className="mt-2 sm:mt-3 space-y-2">
            {Object.entries(question.tags || {}).map(([option, tag], index) => (
              <div key={index} className="flex items-center space-x-3 border p-3 rounded-lg hover:border-primary">
                <Checkbox
                  id={`tag-${index}`}
                  className="w-4 h-4"
                  checked={Array.isArray(tempAnswer) ? tempAnswer.includes(option) : false}
                  onCheckedChange={(checked) => {
                    handleMultiChoiceChange(option, checked as boolean);
                  }}
                />
                <Label htmlFor={`tag-${index}`} className="cursor-pointer flex-grow text-sm">
                  {option}
                </Label>
              </div>
            ))}
            <ActionButton />
          </div>
        </div>
      );

    default:
      return <div>Unbekannter Fragetyp: {question.type}</div>;
  }
}