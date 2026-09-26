import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "@/lib/lang";
import { DivaWordmark } from "@/components/DivaWordmark";

const links: { label: string; to: string }[] = [
  { label: "DIVA COMMUNITY", to: "/#community" },
  { label: "BLOG", to: "/blog" },
  { label: "SHOP", to: "/shop" },
  { label: "ReCRETE", to: "/recrete" },
  { label: "APP", to: "/community" },
];

const Footer = () => {
  const { l } = useLang();
  return (
    <footer className="bg-foreground px-6 py-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-8">
          <DivaWordmark motto={false} className="w-32 text-background/90" />

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
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/zasady-ochrany-udajov" className="font-body text-[10px] tracking-[0.15em] text-background/40 hover:text-background/70 transition-colors uppercase">
              {l("Ochrana osobných údajov", "Privacy")}
            </Link>
            <Link to="/podmienky-pouzivania" className="font-body text-[10px] tracking-[0.15em] text-background/40 hover:text-background/70 transition-colors uppercase">
              {l("Podmienky používania", "Terms")}
            </Link>
            <Link to="/cookies" className="font-body text-[10px] tracking-[0.15em] text-background/40 hover:text-background/70 transition-colors uppercase">
              Cookies
            </Link>
          </div>
          <div className="h-[1px] w-full max-w-xs bg-background/20" />
          <p className="font-body text-xs text-background/40 tracking-wide text-center">
            © 2026 DIVA Community. {l("Všetky práva vyhradené.", "All rights reserved.")}
          </p>
          <p className="font-body text-[10px] text-background/30 tracking-wide text-center">
            {l("Prevádza", "Run by")}: Tomáš Hofbauer, {l("IČO", "Company ID")} 50976869, A.Nográdyho 716/31, 96001 Zvolen{l("", ", Slovakia")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
