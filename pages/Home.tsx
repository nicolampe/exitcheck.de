import React from "react";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CallToAction from "@/components/CallToAction";
import Benefits from "@/components/Benefits";
// Der Vollständige Fragebogen wird importiert
import QuestionnaireForm from "../components/questionnaire/QuestionnaireForm";

export default function Home() {
  return (
    <div>
      {/* Hero-Sektion mit Fragebogen - mobile-first Design */}
      <section id="fragebogen-sektion" className="pt-4 pb-12 bg-white">
        {/* Mobile Headline */}
        <div className="md:hidden px-4 pt-6 pb-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">
            Was ist Ihr Unternehmen <span className="text-primary">wert</span>?
          </h1>
          <p className="text-sm text-gray-700 mb-4 max-w-md mx-auto">
            5-Minuten-Check für realistische Verkaufswert-Schätzung und Exit Readiness Score
          </p>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Container */}
          <div className="flex flex-col lg:flex-row lg:items-start">
            {/* Desktop Headline - nur auf großen Bildschirmen sichtbar */}
            <div className="hidden md:block lg:w-5/12 lg:pr-10 lg:pt-8 xl:pt-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
                Wie viel ist Ihr Unternehmen <span className="text-primary">heute wert</span> – und was bremst Ihren Exit?
              </h1>
              <p className="text-base sm:text-lg text-gray-700 mb-6">
                Erhalten Sie in 5 Minuten eine realistische Verkaufspreis-Schätzung für Ihr Unternehmen – plus einen Exit Readiness Score (0–100%).
              </p>
              
              {/* Desktop Benefits */}
              <div className="space-y-4 mt-8 mb-12 text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 rounded-full p-1 mt-0.5">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p><span className="font-medium">Datenbasiert & realitätsnah:</span> Auf Basis von über 2.000 echten KMU-Transaktionen</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 rounded-full p-1 mt-0.5">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p><span className="font-medium">Speziell für Inhaber-geführte Unternehmen:</span> Wir berücksichtigen nicht nur EBIT, sondern auch SDE</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 rounded-full p-1 mt-0.5">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p><span className="font-medium">Exit Readiness Score:</span> Zeigt konkrete Hebel zur Wertsteigerung</p>
                </div>
              </div>
            </div>
            
            {/* Fragebogen - Optimiert für mobile Darstellung - kein doppelter Rahmen */}
            <div className="w-full lg:w-7/12 mx-auto max-w-xl lg:max-w-none">
              <div className="px-1 pt-2 pb-3 sm:px-2 md:pb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1 md:mb-3 text-center md:text-left">Starten Sie Ihre Bewertung</h2>
                <div className="questionnaire-container">
                  <QuestionnaireForm />
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Benefits unter dem Fragebogen */}
          <div className="md:hidden space-y-3 mt-8 text-gray-700">
            <div className="flex items-start gap-3">
              <div className="bg-primary-100 rounded-full p-1 mt-0.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p><span className="font-medium">Über 2.000 Transaktionen</span> als Datenbasis für realistische Schätzungen</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary-100 rounded-full p-1 mt-0.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p><span className="font-medium">Für Inhaber-geführte Unternehmen</span> optimiert</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary-100 rounded-full p-1 mt-0.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p><span className="font-medium">Kostenlos & anonym</span> - keine Datenweitergabe</p>
            </div>
          </div>
        </div>
      </section>
      
      <Benefits />
      
      <Testimonials />
      <FAQ />
      <CallToAction />
    </div>
  );
}
