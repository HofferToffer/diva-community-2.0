import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSeo } from "@/lib/seo";
import { useLang } from "@/lib/lang";

const NotFound = () => {
  const location = useLocation();
  const { l } = useLang();
  useSeo({ title: l("Stránka sa nenašla", "Page not found"), noindex: true });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{l("Ups, táto stránka neexistuje.", "Oops, this page doesn't exist.")}</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          {l("Späť na hlavnú", "Back to home")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
