import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { leadFormSchema, LeadFormData } from '@shared/schema';

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => void;
  isSubmitting: boolean;
  onBack: () => void;
}

export default function LeadForm({ onSubmit, isSubmitting, onBack }: LeadFormProps) {
  // Formular mit react-hook-form und zod-Validierung
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyWebsite: '',
      privacy: false as unknown as true, // Type assertion to fix TypeScript error
    },
  });

  // Formular absenden
  const handleSubmit: SubmitHandler<LeadFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6 border-t pt-4 sm:pt-6">
        <h2 className="text-base sm:text-lg font-semibold text-primary mb-1">Persönliche Daten</h2>
        <p className="text-xs sm:text-sm text-slate-600">Für die Zusendung Ihrer detaillierten Auswertung</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">Vorname</FormLabel>
                  <FormControl>
                    <Input placeholder="Max" className="text-sm h-9 sm:h-10" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px] sm:text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">Nachname</FormLabel>
                  <FormControl>
                    <Input placeholder="Mustermann" className="text-sm h-9 sm:h-10" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px] sm:text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm">E-Mail</FormLabel>
                <FormControl>
                  <Input placeholder="name@firma.de" type="email" className="text-sm h-9 sm:h-10" {...field} />
                </FormControl>
                <FormMessage className="text-[10px] sm:text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm">WhatsApp Nummer (privat)</FormLabel>
                <FormControl>
                  <Input placeholder="+49 123 456789" type="tel" className="text-sm h-9 sm:h-10" {...field} />
                </FormControl>
                <FormDescription className="text-[10px] sm:text-xs">
                  Für die vertrauliche Zustellung Ihrer detaillierten Unternehmensbewertung
                </FormDescription>
                <FormMessage className="text-[10px] sm:text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyWebsite"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm">Unternehmens-Website</FormLabel>
                <FormControl>
                  <Input placeholder="firma.de" className="text-sm h-9 sm:h-10" {...field} />
                </FormControl>
                <FormDescription className="text-[10px] sm:text-xs">
                  Unsere KI analysiert Ihre Website, um den passenden Branchenschlüssel zu ermitteln und die Bewertung zu präzisieren
                </FormDescription>
                <FormMessage className="text-[10px] sm:text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privacy"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 sm:space-x-3 space-y-0 mt-6 sm:mt-8">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                </FormControl>
                <div className="space-y-0.5 sm:space-y-1 leading-tight sm:leading-none">
                  <FormLabel className="text-xs sm:text-sm">
                    Ich stimme zu, dass meine Daten gespeichert und für Beratungszwecke verwendet werden dürfen.
                  </FormLabel>
                  <FormDescription className="text-[10px] sm:text-xs">
                    Weitere Informationen finden Sie in unserer <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a>.
                  </FormDescription>
                </div>
                <FormMessage className="text-[10px] sm:text-xs" />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4 sm:pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[130px] sm:min-w-[150px] text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
            >
              {isSubmitting ? 'Wird gesendet...' : 'Ergebnisse zusenden'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}