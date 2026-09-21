import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { CommunityAuthProvider, useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { CommunityShell } from "@/community/components/CommunityShell";
import { CommunityGate } from "@/community/components/CommunityGate";

import CommunityAuth from "./community/CommunityAuth";
import CommunityOnboarding from "./community/CommunityOnboarding";
import CommunityHome from "./community/CommunityHome";
import CommunityDivy from "./community/CommunityDivy";
import CommunityAddActivity from "./community/CommunityAddActivity";
import CommunityChallenges from "./community/CommunityChallenges";
import CommunityChallengeDetail from "./community/CommunityChallengeDetail";
import CommunityProfile from "./community/CommunityProfile";
import CommunitySettings from "./community/CommunitySettings";
import CommunityNotifications from "./community/CommunityNotifications";
import CommunityDailyFeeling from "./community/CommunityDailyFeeling";
import CommunityFeelingHistory from "./community/CommunityFeelingHistory";
import CommunityCycle from "./community/CommunityCycle";
import CommunityDivaKruh from "./community/CommunityDivaKruh";
import CommunityStravaCallback from "./community/CommunityStravaCallback";
import CommunityAdmin from "./community/CommunityAdmin";

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-display text-2xl tracking-[0.2em] text-muted-foreground">DIVA</p>
    </div>
  );
}

function CommunityRoutes() {
  const { session, profile, loadingAuth, loadingProfile } = useCommunityAuth();
  const location = useLocation();

  if (loadingAuth || (session && loadingProfile)) return <Loading />;

  if (!session) {
    if (location.pathname === "/community/vitaj") return <CommunityAuth />;
    return <Navigate to="/community/vitaj" replace />;
  }

  if (profile && !profile.onboarding_completed) return <CommunityOnboarding />;

  return (
    <CommunityShell>
      <Routes>
        <Route path="/" element={<CommunityHome />} />
        <Route path="vitaj" element={<Navigate to="/community" replace />} />
        <Route path="pridat" element={<Navigate to="/community/pridat/run" replace />} />
        <Route path="pridat/:kind" element={<CommunityAddActivity />} />
        <Route path="pocit" element={<CommunityDailyFeeling />} />
        <Route path="pocit/historia" element={<CommunityFeelingHistory />} />
        <Route path="cyklus" element={<CommunityCycle />} />
        <Route path="challenges" element={<CommunityChallenges />} />
        <Route path="challenges/:id" element={<CommunityChallengeDetail />} />
        <Route path="divy" element={<CommunityDivy />} />
        <Route path="diva-kruh" element={<CommunityDivaKruh />} />
        <Route path="profil" element={<CommunityProfile />} />
        <Route path="divy/:username" element={<CommunityProfile />} />
        <Route path="nastavenia" element={<CommunitySettings />} />
        <Route path="notifikacie" element={<CommunityNotifications />} />
        <Route path="admin" element={<CommunityAdmin />} />
        <Route path="strava/callback" element={<CommunityStravaCallback />} />
        <Route path="*" element={<Navigate to="/community" replace />} />
      </Routes>
    </CommunityShell>
  );
}

export default function CommunityApp() {
  return (
    <CommunityGate>
      <CommunityAuthProvider>
        <CommunityRoutes />
      </CommunityAuthProvider>
    </CommunityGate>
  );
}

