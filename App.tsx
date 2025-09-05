import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ChatPage from "@/pages/ChatPage";
import QuestionnairePage from "@/pages/QuestionnairePage";
import ThankYouPage from "@/pages/ThankYouPage";
import Impressum from "@/pages/Impressum";
import Datenschutz from "@/pages/Datenschutz";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Lazy-loading für die neuen Expert-Seiten
const ExpertCalculatorPage = React.lazy(() => import("@/pages/ExpertCalculatorPage"));
const ExpertResultPage = React.lazy(() => import("@/pages/ExpertResultPage"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/fragen" component={ChatPage} />
      <Route path="/fragebogen" component={QuestionnairePage} />
      <Route path="/thank-you/:resultId" component={ThankYouPage} />
      <Route path="/questionnaire" component={QuestionnairePage} />
      <Route path="/impressum" component={Impressum} />
      <Route path="/datenschutz" component={Datenschutz} />
      <Route path="/unternehmenswert-berechnung">
        {() => (
          <React.Suspense fallback={<div className="p-8 text-center">Lade Wertberechnung...</div>}>
            <ExpertCalculatorPage />
          </React.Suspense>
        )}
      </Route>
      <Route path="/unternehmenswert/:resultId">
        {(params) => (
          <React.Suspense fallback={<div className="p-8 text-center">Lade Ergebnisse...</div>}>
            <ExpertResultPage resultId={params.resultId} />
          </React.Suspense>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
