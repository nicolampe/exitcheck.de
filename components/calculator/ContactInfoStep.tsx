import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, BarChart } from "lucide-react";
// Wir definieren ein eigenes Interface für die Chat-Kalkulator-Form, da es sich von LeadFormData unterscheidet
interface ChatFormData {
  name: string;
  company: string;
  email: string;
  phone?: string;
  privacy: boolean;
}

interface ContactInfoStepProps {
  onSubmit: (data: ChatFormData) => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export default function ContactInfoStep({ onSubmit, onPrev, isSubmitting }: ContactInfoStepProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Bitte gib deinen Namen ein";
    }
    
    if (!company.trim()) {
      newErrors.company = "Bitte gib den Namen deines Unternehmens ein";
    }
    
    if (!email.trim()) {
      newErrors.email = "Bitte gib deine E-Mail-Adresse ein";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Bitte gib eine gültige E-Mail-Adresse ein";
    }
    
    if (!privacy) {
      newErrors.privacy = "Bitte akzeptiere die Datenschutzerklärung";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        name,
        company,
        email,
        phone: phone || undefined,
        privacy
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#233656] mb-6">6. Deine Ergebnisse sind fast fertig!</h2>
      <p className="text-[#64748B] mb-8">
        Um deine Analyse zu vervollständigen und dir die Ergebnisse zuzusenden, benötigen wir noch einige Kontaktinformationen.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-[#1E293B] mb-2">
            Name*
          </Label>
          <Input
            id="name"
            placeholder="Max Mustermann"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "border-[#F43F5E]" : ""}
          />
          {errors.name && <p className="mt-1 text-sm text-[#F43F5E]">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="company" className="block text-sm font-medium text-[#1E293B] mb-2">
            Unternehmen*
          </Label>
          <Input
            id="company"
            placeholder="Musterfirma GmbH"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={errors.company ? "border-[#F43F5E]" : ""}
          />
          {errors.company && <p className="mt-1 text-sm text-[#F43F5E]">{errors.company}</p>}
        </div>
      </div>
      
      <div className="mb-8">
        <Label htmlFor="email" className="block text-sm font-medium text-[#1E293B] mb-2">
          E-Mail-Adresse*
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="max@musterfirma.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? "border-[#F43F5E]" : ""}
        />
        {errors.email && <p className="mt-1 text-sm text-[#F43F5E]">{errors.email}</p>}
      </div>
      
      <div className="mb-8">
        <Label htmlFor="phone" className="block text-sm font-medium text-[#1E293B] mb-2">
          WhatsApp Nummer
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+49 123 4567890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <p className="mt-1 text-xs text-gray-500">Für den Erhalt Ihrer Bewertung per WhatsApp</p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-start">
          <Checkbox
            id="privacy"
            checked={privacy}
            onCheckedChange={(checked) => setPrivacy(checked as boolean)}
            className={errors.privacy ? "border-[#F43F5E]" : ""}
          />
          <Label
            htmlFor="privacy"
            className="ml-3 text-sm text-[#64748B]"
          >
            Ich akzeptiere die{" "}
            <a href="/datenschutz" className="text-primary hover:underline">
              Datenschutzerklärung
            </a>{" "}
            und bin damit einverstanden, dass meine Daten für die Kontaktaufnahme gespeichert werden.*
          </Label>
        </div>
        {errors.privacy && <p className="mt-1 text-sm text-[#F43F5E]">{errors.privacy}</p>}
      </div>

      <div className="flex justify-between">
        <Button 
          onClick={onPrev} 
          variant="outline" 
          className="text-[#1E293B]"
          disabled={isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="bg-primary hover:bg-[#0D47A1] text-white font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>Verarbeitung...</>
          ) : (
            <>Ergebnisse anzeigen <BarChart className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
