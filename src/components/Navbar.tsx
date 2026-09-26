import { Instagram, Home } from "lucide-react";
import { Link } from "react-router-dom";
import CartDrawer from "@/components/CartDrawer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLang } from "@/lib/lang";

const navLinks = [
  { label: "DIVA COMMUNITY", href: "/#community" },
  { label: "DIVA RUN", href: "/diva-run" },
  { label: "BLOG", href: "/blog" },
  { label: "SHOP", href: "/shop" },
  { label: "RECRETE", href: "/recrete" },
  { label: "APP", href: "/community" },
];

const Navbar = () => {
  const { l } = useLang();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-foreground/95 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-12 lg:px-16 py-5 gap-4">
        {/* Instagram + language */}
        <div className="shrink-0 flex items-center gap-3 md:gap-4">
        <a
          href="https://www.instagram.com/diva_community_/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={18} />
        </a>
        <LanguageSwitcher />
        </div>

        {/* Fixed menu */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-6 lg:gap-x-8">
            <Link
              to="/"
              className="shrink-0 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              aria-label={l("Domov", "Home")}
            >
              <Home size={18} />
            </Link>

            {navLinks.map((link) =>


              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`shrink-0 font-body text-[10px] md:text-xs tracking-[0.2em] transition-colors uppercase ${
                    link.label === "SHOP"
                      ? "text-[hsl(var(--shop))] hover:text-[hsl(var(--shop))]"
                      : "text-primary-foreground/80 hover:text-primary-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={`shrink-0 font-body text-[10px] md:text-xs tracking-[0.2em] transition-colors uppercase ${
                    link.label === "SHOP"
                      ? "text-[hsl(var(--shop))] hover:text-[hsl(var(--shop))]"
                      : "text-primary-foreground/80 hover:text-primary-foreground"
                  }`}
                >
                  {link.label}
                </a>
              )
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="shrink-0">
          <CartDrawer />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
