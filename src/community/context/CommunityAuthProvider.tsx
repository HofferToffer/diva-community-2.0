import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  user_id: string | null;
  name: string;
  username: string | null;
  bio: string | null;
  gifts: string | null;
  city: string | null;
  country: string | null;
  avatar_url: string | null;
  interests: string[];
  is_public: boolean;
  onboarding_completed: boolean;
  notify_likes: boolean;
  notify_comments: boolean;
  notify_challenges: boolean;
  cycle_length_days: number | null;
  last_period_date: string | null;
  is_pregnant: boolean;
  is_menopause: boolean;
  is_postpartum: boolean;
  postpartum_since: string | null;
  is_trying_to_conceive: boolean;
  date_of_birth: string | null;
  dynamic_theme: boolean;
  created_at: string;
};

type Ctx = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loadingAuth: boolean;
  loadingProfile: boolean;
  refreshProfile: () => void;
  signOut: () => Promise<void>;
};

const CommunityAuthContext = createContext<Ctx | undefined>(undefined);

export function CommunityAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoadingAuth(false);
      queryClient.invalidateQueries({ queryKey: ["community-profile"] });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingAuth(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient]);

  const userId = session?.user?.id ?? null;

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["community-profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      if (data) return data as unknown as Profile;
      // Fallback if the signup trigger has not created the row yet.
      const { data: created, error: insertError } = await supabase
        .from("profiles")
        .insert({ user_id: userId!, name: "" })
        .select("*")
        .single();
      if (insertError) throw insertError;
      return created as unknown as Profile;
    },
  });

  return (
    <CommunityAuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile: profile ?? null,
        loadingAuth,
        loadingProfile: !!userId && loadingProfile,
        refreshProfile: () => queryClient.invalidateQueries({ queryKey: ["community-profile"] }),
        signOut: async () => {
          await supabase.auth.signOut();
          queryClient.clear();
        },
      }}
    >
      {children}
    </CommunityAuthContext.Provider>
  );
}

export function useCommunityAuth() {
  const ctx = useContext(CommunityAuthContext);
  if (!ctx) throw new Error("useCommunityAuth must be used inside CommunityAuthProvider");
  return ctx;
}
