import { Link } from "wouter";
import OxfordLogo from "./OxfordLogo";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-8 sm:py-10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <Logo />
              <p className="text-xs text-white/70">
                Ihr Partner für professionelle Unternehmensverkäufe und Exit-Strategien.
              </p>
            </div>
            
            <FooterLinks 
              title="Ressourcen"
              links={[
                { label: "Exit-Guide", href: "/exit-guide" },
                { label: "Blog", href: "/blog" },
                { label: "Fallstudien", href: "/fallstudien" },
                { label: "Wertermittlung", href: "/fragebogen" },
                { label: "Experten-Rechner", href: "/expert" }
              ]}
            />
            
            <FooterLinks 
              title="Unternehmen"
              links={[
                { label: "Über uns", href: "/ueber-uns" },
                { label: "Team", href: "/team" },
                { label: "Karriere", href: "/karriere" },
                { label: "Kontakt", href: "/kontakt" },
              ]}
            />
            
            <FooterLinks 
              title="Rechtliches"
              links={[
                { label: "Datenschutz", href: "/datenschutz" },
                { label: "AGB", href: "/agb" },
                { label: "Impressum", href: "/impressum" },
                { label: "Cookie-Einstellungen", href: "/cookies" },
              ]}
            />
          </div>
          
          <div className="border-t border-white/10 pt-3 sm:pt-4 flex justify-center">
            <div className="text-white/60 text-[10px] sm:text-xs">
              © {new Date().getFullYear()} exitcheck.de. Alle Rechte vorbehalten.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Logo() {
  return (
    <div className="flex items-center space-x-2 mb-2 sm:mb-3">
      <OxfordLogo size="sm" />
      <span className="text-sm sm:text-base font-semibold text-white">
        exit<span className="font-bold">check</span>.de
      </span>
    </div>
  );
}

interface FooterLinksProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <div>
      <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">{title}</h3>
      <ul className="space-y-1 sm:space-y-1.5">
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href}>
              <div className="text-white/70 hover:text-white text-[10px] sm:text-xs transition-colors cursor-pointer">
                {link.label}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
