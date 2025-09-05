import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ImmediateForm from "./ImmediateForm";

export default function Hero() {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-10">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight text-primary">
              Berechnen Sie jetzt Ih­ren Unternehmenswert
              <div className="text-lg sm:text-xl md:text-2xl mt-2 sm:mt-3 bg-slate-100 p-2 sm:p-3 rounded-lg inline-flex items-center space-x-2 sm:space-x-3">
                <span>Bis zu <span className="text-primary font-bold">1</span><span className="blur-sm">XX.XXX</span> € + <span className="text-primary font-bold">Exit-Score: 74</span><span className="blur-sm">%</span></span>
              </div>
            </h1>
            <p className="text-sm sm:text-base mb-4 sm:mb-6 text-slate-700 leading-relaxed max-w-xl">
              Erhalten Sie in 5 Minuten eine realistische Verkaufspreis-Schätzung für Ihr Unternehmen – plus einen Exit Readiness Score (0–100 %).
            </p>
            <p className="text-xs sm:text-sm mb-6 text-slate-600">
              Sie überlegen, Ihr Unternehmen in den nächsten 1–3 Jahren zu verkaufen – oder wollen einfach wissen, was es aktuell wert wäre?
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-6">
              <Button asChild variant="outline" className="group">
                <Link href="/expert">
                  <span>Experten-Rechner</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <span className="text-xs text-slate-500">Mit der Everto-Multiplikator-Methode für eine realistischere Bewertung</span>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <ImmediateForm />
          </div>
        </div>
      </div>
    </section>
  );
}
