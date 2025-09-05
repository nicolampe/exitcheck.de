import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function Datenschutz() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Card className="mb-8">
        <CardContent className="p-6 sm:p-8">
          <div className="prose prose-slate max-w-none">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">Datenschutzerklärung</h1>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Datenschutz auf einen Blick</h2>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
            </p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Datenerfassung auf dieser Website</h3>
            <p>
              <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>
            
            <p>
              <strong>Wie erfassen wir Ihre Daten?</strong><br />
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.<br />
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
            </p>

            <p>
              <strong>Wofür nutzen wir Ihre Daten?</strong><br />
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>
            
            <p>
              <strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong><br />
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Allgemeine Hinweise und Pflichtinformationen</h2>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Datenschutz</h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Hinweis zur verantwortlichen Stelle</h3>
            <p>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
              <br />
              DNAconcepts GmbH<br />
              Europaring 10<br />
              D-49624 Löningen<br />
              <br />
              E-Mail: nico@lampe.com
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Datenerfassung auf dieser Website</h2>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Cookies</h3>
            <p>
              Unsere Website verwendet Cookies. Hierbei handelt es sich um kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
            </p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Anfrage per E-Mail, WhatsApp, Telefon oder Telefax</h3>
            <p>
              Wenn Sie uns per E-Mail, WhatsApp, Telefon oder Telefax kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Fragebogen zur Unternehmensbewertung</h3>
            <p>
              Wenn Sie unseren Fragebogen zur Unternehmensbewertung ausfüllen, werden die von Ihnen angegebenen Daten gespeichert, um Ihnen eine Einschätzung des Unternehmenswertes zu ermöglichen und um Sie bei Bedarf zu kontaktieren. Ihre Ergebnisse und Zusatzinformationen können Ihnen per WhatsApp an die von Ihnen angegebene Nummer zugesendet werden. Diese Daten werden vertraulich behandelt und nicht ohne Ihre Einwilligung an Dritte weitergegeben.
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
