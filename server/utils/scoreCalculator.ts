import fs from 'fs';
import path from 'path';
import { FormAnswers, ScoreResult, LeadSegment } from '@shared/schema';

interface QuestionData {
  id: string;
  text: string;
  type: string;
  options?: any[];
  score_weight?: number;
  scale_min?: number;
  scale_max?: number;
  invert_score?: boolean;
  urgency?: Record<string, string>;
  tags?: Record<string, string>;
}

interface QuestionsData {
  questions: QuestionData[];
  score_ranges: Record<string, { label: string; comment: string }>;
  valuation_multiples: Record<string, any>;
  motivation_profiles: Record<string, string>;
}

/**
 * Laden der Fragebogendaten aus der JSON-Datei
 */
function loadQuestionData(): QuestionsData {
  const questionsPath = path.join(process.cwd(), 'server/data/questions.json');
  const fileContent = fs.readFileSync(questionsPath, 'utf-8');
  return JSON.parse(fileContent);
}

/**
 * Berechnet den Readiness-Score basierend auf den Fragebogenantworten
 */
export function calculateScore(answers: FormAnswers): ScoreResult {
  const questionData = loadQuestionData();
  const questions = questionData.questions;
  
  // Initialisierung des Readiness-Scores
  let totalScore = 0;
  let totalWeight = 0;
  let motivationTags: string[] = [];
  let urgency: string = 'nurture';
  
  // Durchlaufen aller Fragen und Berechnung des Scores
  for (const question of questions) {
    const answer = answers[question.id];
    
    // Überspringen, wenn keine Antwort vorhanden ist
    if (answer === undefined || answer === null) continue;
    
    const weight = question.score_weight || 1.0;
    totalWeight += weight;
    
    // Berechnung des Scores je nach Fragetyp
    switch(question.type) {
      case 'number':
        // Für Zahlenwerte (Umsatz, EBITDA) verwenden wir einen logarithmischen Score
        // Minimum: 0, Maximum: 5
        if (Number(answer) <= 0) {
          totalScore += 0;
        } else {
          const normalizedScore = Math.min(5, Math.log10(Number(answer) / 10000) + 1);
          totalScore += normalizedScore * weight;
        }
        break;
        
      case 'single-choice':
        // Bei Single-Choice verwenden wir den Wert direkt als Score
        let choiceValue = 1;
        
        if (typeof answer === 'object' && 'value' in answer) {
          choiceValue = answer.value as number;
        } else if (typeof answer === 'string') {
          choiceValue = parseInt(answer) || 1;
        } else if (typeof answer === 'number') {
          choiceValue = answer;
        }
        
        // Prüfen, ob diese Frage die Dringlichkeit beeinflusst
        if (question.urgency && question.urgency[choiceValue.toString()]) {
          urgency = question.urgency[choiceValue.toString()];
        }
        
        // Normalisieren auf 0-5 Skala
        const maxChoiceValue = question.options ? Math.max(...question.options.map(o => typeof o === 'object' && 'value' in o ? o.value as number : 1)) : 4;
        const normalizedChoiceScore = (choiceValue / maxChoiceValue) * 5;
        totalScore += normalizedChoiceScore * weight;
        break;
        
      case 'scale':
        // Bei Skalen-Fragen normalisieren wir auf 0-5
        let scaleValue = 1;
        
        if (typeof answer === 'string') {
          scaleValue = parseInt(answer) || 1;
        } else if (typeof answer === 'number') {
          scaleValue = answer;
        }
        
        const scaleMin = question.scale_min || 1;
        const scaleMax = question.scale_max || 5;
        const scaleRange = scaleMax - scaleMin;
        
        let normalizedScaleScore = ((scaleValue - scaleMin) / scaleRange) * 5;
        
        // Bei invertierten Skalen kehren wir den Wert um
        if (question.invert_score) {
          normalizedScaleScore = 5 - normalizedScaleScore;
        }
        
        totalScore += normalizedScaleScore * weight;
        break;
        
      case 'multi-choice':
        // Bei Multi-Choice sammeln wir die ausgewählten Tags
        if (Array.isArray(answer) && question.tags) {
          answer.forEach(selected => {
            const tag = question.tags?.[selected];
            if (tag && !motivationTags.includes(tag)) {
              motivationTags.push(tag);
            }
          });
          
          // Score basierend auf der Anzahl der Antworten
          const multiChoiceScore = (answer.length / Object.keys(question.tags).length) * 5;
          totalScore += multiChoiceScore * weight;
        }
        break;
        
      default:
        // Bei anderen Fragetypen (z.B. Dropdown) gewichten wir neutral (3/5)
        totalScore += 3 * weight;
        break;
    }
  }
  
  // Berechnung des finalen Scores als Prozentsatz (0-100%)
  const finalScorePercentage = Math.round((totalScore / (totalWeight * 5)) * 100);
  
  // Bestimmung des Score-Labels basierend auf dem Prozentsatz
  let scoreLabel = '';
  let scoreComment = '';
  
  for (const range in questionData.score_ranges) {
    const [min, max] = range.split('-').map(Number);
    if (finalScorePercentage >= min && finalScorePercentage <= max) {
      scoreLabel = questionData.score_ranges[range].label;
      scoreComment = questionData.score_ranges[range].comment;
      break;
    }
  }
  
  // Bestimmung des Lead-Segments basierend auf Score und Dringlichkeit
  let segment: LeadSegment = "nurture";
  
  if (finalScorePercentage >= 75) {
    // Hoher Score
    if (urgency === "hot" || urgency === "warm") {
      segment = "hot";
    } else {
      segment = "warm";
    }
  } else if (finalScorePercentage >= 50) {
    // Mittlerer Score
    if (urgency === "hot") {
      segment = "warm";
    } else if (urgency === "warm") {
      segment = "cold";
    } else {
      segment = "nurture";
    }
  } else {
    // Niedriger Score
    if (urgency === "hot") {
      segment = "cold";
    } else {
      segment = "nurture";
    }
  }
  
  // Berechnung der Unternehmensbewertung
  const industry = answers.q1 as string;
  let ebitda = parseInt(answers.q3 as string) || 0;
  const ceoPay = parseInt(answers.q3b as string) || 0;
  const isCeoOwner = answers.q3c === true || answers.q3c === 'true';
  
  // Wenn der Geschäftsführer auch der Inhaber ist, addieren wir sein Gehalt zum EBITDA
  if (isCeoOwner && ceoPay > 0) {
    ebitda += ceoPay;
    console.log(`Owner-CEO compensation added to EBITDA: ${ceoPay}. New EBITDA: ${ebitda}`);
  }
  
  let valuationLow = 0;
  let valuationHigh = 0;
  let potentialIncrease = 0;
  
  if (ebitda > 0 && industry) {
    const multiples = questionData.valuation_multiples[industry] || questionData.valuation_multiples["Andere"];
    const baseMultiple = multiples.base;
    const premiumMultiple = multiples.premium;
    
    // Aktuelle Bewertung basierend auf Score
    const currentMultiple = baseMultiple + ((premiumMultiple - baseMultiple) * (finalScorePercentage / 100));
    valuationLow = Math.round(ebitda * baseMultiple);
    valuationHigh = Math.round(ebitda * currentMultiple);
    
    // Potenzielle Steigerung bei 100% Score
    potentialIncrease = Math.round(ebitda * premiumMultiple) - valuationHigh;
  }
  
  // Rückgabe des Score-Ergebnisses
  return {
    readinessScore: finalScorePercentage,
    scoreLabel,
    scoreComment,
    valuationLow,
    valuationHigh,
    potentialIncrease,
    urgency,
    segment,
    motivationTags
  };
}