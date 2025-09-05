import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight, BarChart3 } from 'lucide-react';

export default function ValueCalculationCTA() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
      <div className="bg-primary rounded-md shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:col-span-3">
            <div className="max-w-md mx-auto lg:max-w-none lg:mx-0">
              <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/10 text-white mb-3 sm:mb-4">
                <Calculator className="h-3 w-3 mr-1.5" />
                Kostenlos & unverbindlich
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-tight">
                Jetzt kostenlosen ExitCheck starten
              </h2>
              <p className="mt-2 sm:mt-3 text-sm text-white/80 leading-relaxed">
                Erhalten Sie in nur 5 Minuten eine realistische Verkaufspreis-Schätzung und erfahren Sie, wie verkaufsfähig Ihr Unternehmen wirklich ist.
              </p>
              <div className="mt-4 sm:mt-6">
                <Link href="/fragebogen">
                  <Button 
                    className="w-full sm:w-auto bg-white hover:bg-gray-100 text-primary text-sm font-medium py-2 px-4 rounded-md transition-all gap-2 shadow-sm hover:shadow-md"
                    size="sm"
                  >
                    Jetzt ExitCheck starten
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <div className="h-4 w-4 rounded-sm border border-white/30 flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>100% kostenlos</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <div className="h-4 w-4 rounded-sm border border-white/30 flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Ohne Verpflichtung</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <div className="h-4 w-4 rounded-sm border border-white/30 flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Branchenspezifisch</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <div className="h-4 w-4 rounded-sm border border-white/30 flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>In 3 Minuten ausgefüllt</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-2 relative">
            <div className="absolute inset-0 bg-primary-dark/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="h-48 w-48 text-white/15" strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}