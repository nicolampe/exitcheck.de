import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#233656] mb-2 sm:mb-4">
              Das sagen Unternehmer über exitcheck.de
            </h2>
            <p className="text-sm text-[#64748B] max-w-lg mx-auto">
              Erfahren Sie, wie andere Unternehmer mit unserer Analyse ihren Exit optimiert haben.
            </p>
          </div>
          
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
            <TestimonialCard 
              name="Michael Becker"
              role="SaaS-Gründer, München"
              testimonial="Die Analyse hat mir präzise die Schwachstellen in meinem Geschäftsmodell aufgezeigt. Nach 6 Monaten Optimierung konnte ich mein Unternehmen für das 1,5-fache des ursprünglich geschätzten Preises verkaufen."
              stars={5}
              imageUrl="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80"
            />
            
            <TestimonialCard 
              name="Sarah Müller"
              role="E-Commerce Unternehmerin, Berlin"
              testimonial="Ich war überrascht, wie genau die Exit-Bewertung war. Die klaren Handlungsempfehlungen haben mir geholfen, in nur 12 Monaten meinen Exit-Readiness Score von 48% auf 89% zu steigern."
              stars={4.5}
              imageUrl="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  name: string;
  role: string;
  testimonial: string;
  stars: number;
  imageUrl: string;
}

function TestimonialCard({ name, role, testimonial, stars, imageUrl }: TestimonialCardProps) {
  return (
    <Card className="bg-[#F8F9FB] border-none shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center mb-3 sm:mb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <svg 
              className="h-full w-full text-gray-400" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="ml-3 sm:ml-4">
            <h3 className="text-sm sm:text-base font-semibold text-[#233656]">{name}</h3>
            <p className="text-xs sm:text-sm text-[#64748B]">{role}</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#64748B] italic leading-relaxed">{testimonial}</p>
        <div className="mt-3 sm:mt-4 flex text-primary">
          {Array.from({ length: Math.floor(stars) }).map((_, i) => (
            <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" />
          ))}
          {stars % 1 !== 0 && <StarHalf className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" />}
        </div>
      </CardContent>
    </Card>
  );
}
