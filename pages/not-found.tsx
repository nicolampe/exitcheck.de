import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import OxfordLogo from "@/components/OxfordLogo";

export default function NotFound() {
  return (
    <div className="py-20 w-full flex items-center justify-center bg-accent/50">
      <Card className="w-full max-w-md mx-4 border-2 border-primary/20 shadow-lg">
        <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center text-center">
          <OxfordLogo size="lg" className="mb-6" />
          <h1 className="text-3xl font-serif font-semibold text-secondary mb-4">Seite nicht gefunden</h1>
          
          <div className="flex items-center justify-center mb-6 mt-2">
            <AlertCircle className="h-6 w-6 text-primary mr-2" />
            <p className="text-lg text-secondary/80">Error 404</p>
          </div>

          <p className="mt-2 mb-8 text-secondary/70">
            Die von Ihnen gesuchte Seite existiert leider nicht. Bitte kehren Sie zur Startseite zurück.
          </p>
          
          <Link href="/">
            <Button 
              className="bg-primary hover:bg-primary-dark text-white font-medium rounded-md px-8 py-2 shadow-md hover:shadow-lg transition-all"
            >
              Zur Startseite
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
