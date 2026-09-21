import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

type Status = "loading" | "valid" | "confirming" | "success" | "error";

const Unsubscribe = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) {
      setStatus("error");
      return;
    }
    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const response = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: supabaseAnonKey } }
        );
        if (!response.ok) throw new Error("invalid");
        const data = await response.json();
        if (data?.valid) {
          setEmail(data.email ?? null);
          setStatus("valid");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };
    validate();
  }, [token]);

  const confirmUnsubscribe = async () => {
    if (!token) return;
    setStatus("confirming");
    const { error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    setStatus(error ? "error" : "success");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-10 px-6 md:px-12 lg:px-24 bg-foreground">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide text-primary-foreground">
            Odhlásenie z e-mailov
          </h1>
          <div className="mx-auto mt-4 w-16 h-[1px] bg-accent" />
        </div>
      </section>

      <section className="mx-auto max-w-xl px-6 md:px-12 py-20 text-center">
        {status === "loading" && (
          <p className="font-body text-sm text-muted-foreground">Overujem váš odkaz…</p>
        )}

        {status === "error" && (
          <p className="font-body text-sm text-muted-foreground">
            Tento odkaz je neplatný alebo už bol použitý.
          </p>
        )}

        {(status === "valid" || status === "confirming") && (
          <>
            <p className="font-body text-sm leading-relaxed text-muted-foreground mb-8">
              {email
                ? `Naozaj si prajete odhlásiť adresu ${email} z odberu e-mailov?`
                : "Naozaj si prajete odhlásiť sa z odberu e-mailov?"}
            </p>
            <button
              onClick={confirmUnsubscribe}
              disabled={status === "confirming"}
              className="border border-foreground bg-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase text-background hover:bg-background hover:text-foreground transition-all disabled:opacity-50"
            >
              {status === "confirming" ? "Odhlasujem…" : "Potvrdiť odhlásenie"}
            </button>
          </>
        )}

        {status === "success" && (
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            Odhlásenie prebehlo úspešne. Už vám nebudeme posielať e-maily.
          </p>
        )}

        <Link
          to="/"
          className="mt-10 inline-block font-body text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors uppercase"
        >
          Späť na hlavnú stránku
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Unsubscribe;
