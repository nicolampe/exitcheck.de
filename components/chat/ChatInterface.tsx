import React, { useState, useRef, useEffect } from 'react';
import { Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type CalculatorFormData } from '@shared/schema';

interface Message {
  id: string;
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onDataCollected: (data: Partial<CalculatorFormData>) => void;
  section: 'businessModel' | 'financials' | 'founderDependency' | 'systemsProcesses' | 'customerRetention' | 'contactInfo';
  existingData?: Partial<CalculatorFormData>;
  onComplete?: () => void;
  onBack?: () => void;
}

export default function ChatInterface({ 
  onDataCollected, 
  section, 
  existingData,
  onComplete,
  onBack 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set initial bot message based on section
  useEffect(() => {
    const initialMessage = getInitialMessage(section);
    setMessages([{
      id: Date.now().toString(),
      content: initialMessage,
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, [section]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsProcessing(true);
    
    // Process the user input and generate bot response
    setTimeout(() => {
      processUserInput(currentInput, section, existingData);
      setIsProcessing(false);
    }, 500);
  };

  const processUserInput = (input: string, currentSection: string, existingData?: Partial<CalculatorFormData>) => {
    // This is where we would process the user input and update the data object
    // For now, we'll just mock the processing with simple responses
    
    let botResponse = '';
    let collectedData: Partial<CalculatorFormData> = {};

    switch (currentSection) {
      case 'businessModel':
        if (input.toLowerCase().includes('saas') || input.toLowerCase().includes('software')) {
          botResponse = 'SaaS ist ein interessantes Geschäftsmodell! Wie hoch ist dein jährlicher Umsatz?';
          collectedData = { businessModel: 'saas' };
        } else if (input.toLowerCase().includes('agentur') || input.toLowerCase().includes('dienstleistung')) {
          botResponse = 'Dienstleistungsunternehmen haben besondere Eigenschaften. Wie hoch ist dein jährlicher Umsatz?';
          collectedData = { businessModel: 'agency' };
        } else {
          botResponse = 'Ich verstehe. Kannst du mir mehr über dein Geschäftsmodell erzählen? Bist du eher im Bereich SaaS, E-Commerce, Agentur oder etwas anderes?';
          return;
        }
        
        // Move to next section after collecting data
        onDataCollected(collectedData);
        break;
        
      case 'financials':
        // Extract numeric values
        const numbers = input.match(/\d+([\.,]\d+)?/g);
        if (numbers && numbers.length > 0) {
          const revenue = parseFloat(numbers[0].replace(',', '.'));
          botResponse = `Danke! ${revenue}€ Jahresumsatz ist eine gute Basis. Wie abhängig ist das Unternehmen von dir als Gründer:in auf einer Skala von 1-10?`;
          collectedData = { revenueAmount: revenue };
          onDataCollected(collectedData);
        } else {
          botResponse = 'Ich konnte leider keine Zahl erkennen. Kannst du mir deinen jährlichen Umsatz bitte als Zahl mitteilen?';
        }
        break;
        
      case 'founderDependency':
        const dependencyLevel = parseInt(input.match(/\d+/)?.[0] || '5');
        if (dependencyLevel >= 1 && dependencyLevel <= 10) {
          botResponse = `Verstanden, dein Abhängigkeitslevel ist ${dependencyLevel}/10. Wie stark sind eure Prozesse dokumentiert und automatisiert auf einer Skala von 1-10?`;
          collectedData = { founderDependency: dependencyLevel.toString() };
          onDataCollected(collectedData);
        } else {
          botResponse = 'Bitte gib einen Wert zwischen 1 und 10 an.';
        }
        break;
        
      case 'systemsProcesses':
        const processLevel = parseInt(input.match(/\d+/)?.[0] || '5');
        if (processLevel >= 1 && processLevel <= 10) {
          botResponse = `Danke! Eure Prozesse sind zu ${processLevel}/10 dokumentiert. Wie gut ist eure Kundenbindung? Wie hoch ist die durchschnittliche Verweildauer eines Kunden in Monaten?`;
          collectedData = { 
            processes: processLevel.toString(),
            automationLevel: processLevel * 10 // Assuming automation level is a percentage
          };
          onDataCollected(collectedData);
        } else {
          botResponse = 'Bitte gib einen Wert zwischen 1 und 10 an.';
        }
        break;
        
      case 'customerRetention':
        const retentionMonths = parseInt(input.match(/\d+/)?.[0] || '12');
        botResponse = `${retentionMonths} Monate ist eine wichtige Information. Jetzt brauche ich noch deine Kontaktdaten, um dir dein Ergebnis zu senden. Wie lautet deine E-Mail-Adresse?`;
        collectedData = { 
          retentionPeriod: `${retentionMonths} Monate`,
          recurringRevenue: 50 // Placeholder percentage
        };
        onDataCollected(collectedData);
        break;
        
      case 'contactInfo':
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const emailMatch = input.match(emailRegex)?.[0];
        
        if (emailMatch) {
          botResponse = `Vielen Dank! Ich habe deine E-Mail-Adresse ${emailMatch} gespeichert. Klicke auf "Weiter", um deine Ergebnisse zu sehen.`;
          // Use a custom type for contact data that will be handled in the parent
          collectedData = {
            contactInfo: JSON.stringify({
              email: emailMatch,
              name: "Benutzer", // Placeholder
              company: "Unternehmen", // Placeholder
              phone: ""
            })
          };
          onDataCollected(collectedData);
        } else {
          botResponse = 'Bitte gib eine gültige E-Mail-Adresse ein.';
        }
        break;
        
      default:
        botResponse = 'Danke für deine Antwort. Ich habe die Information gespeichert.';
        onComplete && onComplete();
    }

    // Add bot response to chat
    const botMessage: Message = {
      id: Date.now().toString(),
      content: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  const getInitialMessage = (section: string): string => {
    switch (section) {
      case 'businessModel':
        return 'Hallo! Ich bin dein Exit-Check Assistent. Um den Wert deines Unternehmens zu berechnen, benötige ich ein paar Informationen. Zunächst: Was ist dein Geschäftsmodell? (z.B. SaaS, E-Commerce, Agentur)';
      case 'financials':
        return 'Jetzt geht es um die Finanzen. Wie hoch ist dein jährlicher Umsatz?';
      case 'founderDependency':
        return 'Wie abhängig ist das Unternehmen von dir als Gründer:in auf einer Skala von 1-10?';
      case 'systemsProcesses':
        return 'Wie stark sind eure Prozesse dokumentiert und automatisiert auf einer Skala von 1-10?';
      case 'customerRetention':
        return 'Wie gut ist eure Kundenbindung? Wie hoch ist die durchschnittliche Verweildauer eines Kunden?';
      case 'contactInfo':
        return 'Zum Schluss würde ich gerne wissen, wie ich dich erreichen kann, um dir dein Ergebnis zu senden. Bitte gib deine E-Mail-Adresse ein.';
      default:
        return 'Lass uns über dein Unternehmen sprechen.';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-white">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L13.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 4L10.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 9L17.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18 13H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 17L17.5 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 20L13.5 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 20L10.5 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 17L6.5 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6 13H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 9L6.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            )}
            <div 
              className={`max-w-[85%] px-6 py-4 rounded-2xl text-base leading-relaxed ${
                message.sender === 'user' 
                  ? 'bg-primary text-white ml-auto shadow-sm' 
                  : 'bg-[#F3F4F6] text-[#233656] shadow-sm'
              }`}
            >
              {message.content}
            </div>
            {message.sender === 'user' && (
              <div className="h-10 w-10 rounded-full bg-[#233656]/10 flex items-center justify-center ml-4 flex-shrink-0">
                <User className="h-5 w-5 text-[#233656]" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-[#E5E7EB] p-6 bg-white">
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Schreib deine Antwort..."
            className="flex-1 px-5 py-3 text-base border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            disabled={isProcessing || !currentInput.trim()}
            className="bg-primary hover:bg-primary/90 px-5 py-3 h-auto rounded-xl shadow-sm"
            size="lg"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        {onBack && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack} 
            className="mt-3 w-full rounded-xl py-3"
          >
            Zurück
          </Button>
        )}
      </form>
    </div>
  );
}
