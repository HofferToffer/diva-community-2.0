import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/lib/lang";

export default function ResetPassword() {
  const { l } = useLang();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error(l("Heslo musí mať aspoň 8 znakov.", "Your password needs at least 8 characters."));
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(l("Heslo sa nepodarilo zmeniť. Odkaz mohol vypršať.", "We couldn't change your password. The link may have expired."));
      return;
    }
    toast.success(l("Heslo je nastavené.", "Your password is set."));
    navigate("/community");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h1 className="font-display text-3xl">{l("Nastav si nové heslo", "Set a new password")}</h1>
        <div className="space-y-2">
          <Label htmlFor="new-password">{l("Nové heslo", "New password")}</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {l("Uložiť heslo", "Save password")}
        </Button>
      </form>
    </div>
  );
}
