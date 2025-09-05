import React from 'react';
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm';

export default function QuestionnairePage() {
  return (
    <div className="py-6 md:py-12 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-primary mb-2">
          Exit-Check Fragebogen
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Beantworte die folgenden Fragen, um eine Einschätzung deiner Exit-Bereitschaft und 
          eine Unternehmensbewertung zu erhalten.
        </p>
      </div>

      <QuestionnaireForm />
    </div>
  );
}