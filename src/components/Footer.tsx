import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const links: { label: string; to: string }[] = [
  { label: "DIVA COMMUNITY", to: "/#community" },
  { label: "BLOG", to: "/blog" },
  { label: "SHOP", to: "/shop" },
  { label: "ReCRETE", to: "/recrete" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground px-6 py-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-8">
          <span className="font-heading text-2xl uppercase tracking-[0.2em] text-background/90">Diva Community</span>

          <div className="flex gap-6">
            <a href="https://www.instagram.com/diva_community_/" target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-background transition-colors">
              <Instagram size={18} />
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="font-body text-xs tracking-[0.2em] text-background/60 hover:text-background transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="h-[1px] w-full max-w-xs bg-background/20" />
          <p className="font-body text-xs text-background/40 tracking-wide text-center">
            © 2026 DIVA Community. Všetky práva vyhradené.
          </p>
          <p className="font-body text-[10px] text-background/30 tracking-wide text-center">
            Prevádza: Tomáš Hofbauer, IČO 50976869, A.Nográdyho 716/31, 96001 Zvolen
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
