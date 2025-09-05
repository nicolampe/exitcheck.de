import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function Impressum() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Card className="mb-8">
        <CardContent className="p-6 sm:p-8">
          <div className="prose prose-slate max-w-none">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">Impressum</h1>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Angaben gemäß § 5 TMG</h2>
            <p>
              DNAconcepts GmbH<br />
              Europaring 10<br />
              D-49624 Löningen
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Vertreten durch</h2>
            <p>
              Geschäftsführer: Nico Lampe
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Registereintrag</h2>
            <p>
              Eingetragen beim Amtsgericht Oldenburg<br />
              Handelsregisternummer: HRB 216220
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Kontakt</h2>
            <p>
              Telefon: auf schriftliche Anfrage<br />
              E-Mail: nico@lampe.com
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Umsatzsteuer</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
              DE338251352
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              DNAconcepts GmbH<br />
              Europaring 10<br />
              D-49624 Löningen
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Link href="/">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Startseite
          </Button>
        </Link>
      </div>
    </div>
  );
}
