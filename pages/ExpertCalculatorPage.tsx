import React from "react";
import ExpertoCalculatorForm from "@/components/experto/ExpertoCalculatorForm";

export default function ExpertCalculatorPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
          Unternehmenswert-Berechnung
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Ermitteln Sie den aktuellen Marktwert Ihres Unternehmens mit unserer präzisen Bewertungsmethode.
          In nur 3 Minuten zu Ihrer professionellen Wertanalyse.
        </p>
      </div>

      <div className="mb-10 sm:mb-16">
        <ExpertoCalculatorForm />
      </div>

      <div className="bg-gray-50 rounded-xl p-6 sm:p-8 mt-10 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Unsere Bewertungsmethode</h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Multiplikator-Verfahren</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Das Multiplikator-Verfahren ist eine anerkannte, marktorientierte Bewertungsmethode, die auf dem Vergleich mit vergleichbaren Unternehmen basiert.
              Branchenspezifische Faktoren werden mit dem normalisierten EBIT multipliziert, um einen präzisen Unternehmenswert zu ermitteln.
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Qualitätsfaktoren</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Neben Branchenfaktoren berücksichtigen wir individuelle Qualitätsmerkmale Ihres Unternehmens: Kundenstruktur, wiederkehrende Umsätze, 
              Management-Struktur, Wachstumsrate, Profitabilität und Marktposition werden präzise einbezogen, um Ihren spezifischen Wert zu bestimmen.
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Realistischer Kaufpreis</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Der finale Kaufpreis berücksichtigt neben dem Basiswert auch finanzielle Faktoren wie Unternehmensschulden und nicht betriebsnotwendige Vermögenswerte.
              Diese umfassende Analyse liefert Ihnen eine fundierte Einschätzung des tatsächlichen Marktwerts Ihres Unternehmens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
