import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type FeedProfile = {
  id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
};

export type FeedActivity = {
  id: string;
  profile_id: string;
  kind: "run" | "move";
  activity_type: string;
  activity_date: string;
  duration_seconds: number;
  distance_km: number | null;
  pace_seconds: number | null;
  photo_url: string | null;
  note: string | null;
  visibility: string;
  created_at: string;
  profile: FeedProfile | null;
  activity_likes: { profile_id: string }[];
  activity_comments: { id: string }[];
};

const FEED_SELECT =
  "id, profile_id, kind, activity_type, activity_date, duration_seconds, distance_km, pace_seconds, photo_url, note, visibility, created_at, profile:profiles!activities_profile_id_fkey(id, name, username, avatar_url), activity_likes(profile_id), activity_comments(id)";

export function useFeed(limit = 20) {
  return useQuery({
    queryKey: ["community-feed", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select(FEED_SELECT)
        .eq("visibility", "public")
        .order("activity_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as FeedActivity[];
    },
  });
}

export function useProfileActivities(profileId: string | undefined, kind?: "run" | "move") {
  return useQuery({
    queryKey: ["community-profile-activities", profileId, kind ?? "all"],
    enabled: !!profileId,
    queryFn: async () => {
      let query = supabase
        .from("activities")
        .select(FEED_SELECT)
        .eq("profile_id", profileId!)
        .order("activity_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(100);
      if (kind) query = query.eq("kind", kind);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as FeedActivity[];
    },
  });
}

export function useActivityById(activityId: string | undefined) {
  return useQuery({
    queryKey: ["community-activity", activityId],
    enabled: !!activityId,
    queryFn: async () => {
      const { data, error } = await supabase.from("activities").select(FEED_SELECT).eq("id", activityId!).maybeSingle();
      if (error) throw error;
      return data as unknown as FeedActivity | null;
    },
  });
}

export type ProfileStats = {
  total_km: number;
  total_runs: number;
  total_workouts: number;
  total_minutes: number;
  month_km: number;
  month_runs: number;
  month_workouts: number;
  streak_days: number;
};

export function useProfileStats(profileId: string | undefined) {
  return useQuery({
    queryKey: ["community-profile-stats", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("profile_stats", { _profile_id: profileId! });
      if (error) throw error;
      const row = (Array.isArray(data) ? data[0] : data) as ProfileStats | undefined;
      return (
        row ?? {
          total_km: 0,
          total_runs: 0,
          total_workouts: 0,
          total_minutes: 0,
          month_km: 0,
          month_runs: 0,
          month_workouts: 0,
          streak_days: 0,
        }
      );
    },
  });
}

export type Challenge = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  start_date: string;
  end_date: string;
  goal: number;
  goal_type: string;
  active: boolean;
};

export function useChallenges() {
  return useQuery({
    queryKey: ["community-challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Challenge[];
    },
  });
}

export function useActiveChallenge() {
  const { data, ...rest } = useChallenges();
  const today = new Date().toISOString().slice(0, 10);
  const active =
    data?.find((c) => c.active && c.start_date <= today && c.end_date >= today) ??
    data?.find((c) => c.active) ??
    null;
  return { data: active, ...rest };
}

export function useChallenge(id: string | undefined) {
  return useQuery({
    queryKey: ["community-challenge", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("challenges").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data as unknown as Challenge | null;
    },
  });
}

export type ChallengeInput = {
  id?: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  goal: number;
  goal_type: string;
  active: boolean;
  image_url?: string | null;
};

export function useSaveChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ChallengeInput) => {
      const payload = {
        title: input.title,
        description: input.description,
        start_date: input.start_date,
        end_date: input.end_date,
        goal: input.goal,
        goal_type: input.goal_type,
        active: input.active,
        image_url: input.image_url ?? null,
      };
      if (input.id) {
        const { error } = await supabase.from("challenges").update(payload).eq("id", input.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("challenges").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["community-challenge"] });
    },
  });
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("challenges").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-challenges"] });
    },
  });
}

export type ChallengeProgress = { progress: number; participants: number; my_contribution: number };

export function useChallengeProgress(challengeId: string | undefined) {
  return useQuery({
    queryKey: ["community-challenge-progress", challengeId],
    enabled: !!challengeId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("challenge_progress", { _challenge_id: challengeId! });
      if (error) throw error;
      const row = (Array.isArray(data) ? data[0] : data) as ChallengeProgress | undefined;
      return row ?? { progress: 0, participants: 0, my_contribution: 0 };
    },
  });
}

export type LeaderboardRow = {
  profile_id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  value: number;
  activities: number;
};

export function useLeaderboard(challengeId: string | undefined, metric: "km" | "activities" | "minutes") {
  return useQuery({
    queryKey: ["community-leaderboard", challengeId, metric],
    enabled: !!challengeId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("challenge_leaderboard", {
        _challenge_id: challengeId!,
        _metric: metric,
      });
      if (error) throw error;
      return (data ?? []) as unknown as LeaderboardRow[];
    },
  });
}

export function useChallengeFeed(
  challengeId: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  limit = 50,
) {
  return useQuery({
    queryKey: ["community-challenge-feed", challengeId, startDate, endDate, limit],
    enabled: !!challengeId && !!startDate && !!endDate,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select(FEED_SELECT)
        .eq("visibility", "public")
        .gt("distance_km", 0)
        .gte("activity_date", startDate!)
        .lte("activity_date", endDate!)
        .order("activity_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as FeedActivity[];
    },
  });
}

export function useChallengeParticipation(challengeId: string | undefined, profileId: string | undefined) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["community-challenge-participation", challengeId, profileId],
    enabled: !!challengeId && !!profileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenge_participants")
        .select("id")
        .eq("challenge_id", challengeId!)
        .eq("profile_id", profileId!)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  const toggle = useMutation({
    mutationFn: async (joined: boolean) => {
      if (joined) {
        const { error } = await supabase
          .from("challenge_participants")
          .delete()
          .eq("challenge_id", challengeId!)
          .eq("profile_id", profileId!);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("challenge_participants")
          .insert({ challenge_id: challengeId!, profile_id: profileId! });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-challenge-participation"] });
      queryClient.invalidateQueries({ queryKey: ["community-challenge-progress"] });
    },
  });

  return { joined: query.data ?? false, isLoading: query.isLoading, toggle };
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      activityId,
      profileId,
      liked,
    }: {
      activityId: string;
      profileId: string;
      liked: boolean;
    }) => {
      if (liked) {
        const { error } = await supabase
          .from("activity_likes")
          .delete()
          .eq("activity_id", activityId)
          .eq("profile_id", profileId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("activity_likes")
          .insert({ activity_id: activityId, profile_id: profileId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      queryClient.invalidateQueries({ queryKey: ["community-challenge-feed"] });
      queryClient.invalidateQueries({ queryKey: ["community-profile-activities"] });
    },
  });
}

export type Comment = {
  id: string;
  body: string;
  created_at: string;
  profile_id: string;
  profile: FeedProfile | null;
};

export function useComments(activityId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["community-comments", activityId],
    enabled: !!activityId && enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_comments")
        .select(
          "id, body, created_at, profile_id, profile:profiles!activity_comments_profile_id_fkey(id, name, username, avatar_url)",
        )
        .eq("activity_id", activityId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Comment[];
    },
  });
}

export function useCommentMutations(activityId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["community-comments", activityId] });
    queryClient.invalidateQueries({ queryKey: ["community-feed"] });
    queryClient.invalidateQueries({ queryKey: ["community-challenge-feed"] });
  };

  const add = useMutation({
    mutationFn: async ({ profileId, body }: { profileId: string; body: string }) => {
      const { error } = await supabase
        .from("activity_comments")
        .insert({ activity_id: activityId, profile_id: profileId, body });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from("activity_comments").delete().eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { add, remove };
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activityId: string) => {
      const { error } = await supabase.from("activities").delete().eq("id", activityId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      queryClient.invalidateQueries({ queryKey: ["community-challenge-feed"] });
      queryClient.invalidateQueries({ queryKey: ["community-profile-activities"] });
      queryClient.invalidateQueries({ queryKey: ["community-profile-stats"] });
      queryClient.invalidateQueries({ queryKey: ["community-challenge-progress"] });
    },
  });
}

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

export function useNotifications(profileId: string | undefined) {
  return useQuery({
    queryKey: ["community-notifications", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as unknown as Notification[];
    },
  });
}

export type DailyFeeling = {
  id: string;
  profile_id: string;
  feeling_date: string;
  mood: "radostna" | "smutna" | "nahnevana" | "prekvapena" | "hrozne" | "bojazliva" | "znechutena" | "vycerpana" | "neutralna" | "dobre" | "skvelo";
  feeling_detail: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export function useDailyFeelings(profileId: string | undefined) {
  return useQuery({
    queryKey: ["community-daily-feelings", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_feelings")
        .select("*")
        .eq("profile_id", profileId ?? "")
        .order("feeling_date", { ascending: false })
        .limit(365);
      if (error) throw error;
      return (data ?? []) as DailyFeeling[];
    },
  });
}

export function useSaveDailyFeeling(profileId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ mood, detail, note, date }: { mood: DailyFeeling["mood"]; detail: string | null; note: string; date: string }) => {
      if (!profileId) throw new Error("Chýba profil členky.");
      const { error } = await supabase.from("daily_feelings").upsert(
        {
          profile_id: profileId,
          feeling_date: date,
          mood,
          feeling_detail: detail,
          note: note.trim() || null,
        },
        { onConflict: "profile_id,feeling_date" },
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community-daily-feelings", profileId] }),
  });
}

export function useIntimacyLogs(profileId: string | undefined) {
  return useQuery({
    queryKey: ["community-intimacy-logs", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("intimacy_logs")
        .select("log_date")
        .eq("profile_id", profileId ?? "");
      if (error) throw error;
      return new Set((data ?? []).map((row) => row.log_date));
    },
  });
}

export function useToggleIntimacyLog(profileId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ date, logged }: { date: string; logged: boolean }) => {
      if (!profileId) throw new Error("Chýba profil členky.");
      if (logged) {
        const { error } = await supabase.from("intimacy_logs").delete().eq("profile_id", profileId).eq("log_date", date);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("intimacy_logs").insert({ profile_id: profileId, log_date: date });
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community-intimacy-logs", profileId] }),
  });
}

export type Achievement = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  metric: string;
  threshold: number;
};

export function useAchievements() {
  return useQuery({
    queryKey: ["community-achievements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("achievements").select("*").order("threshold");
      if (error) throw error;
      return (data ?? []) as unknown as Achievement[];
    },
  });
}

export function useProfileByUsername(username: string | undefined) {
  return useQuery({
    queryKey: ["community-profile-by-username", username],
    enabled: !!username,
    queryFn: async () => {
      // Only the public-facing fields — never cycle/pregnancy/menopause or other
      // personal health data, which stays visible to the owner only.
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, username, avatar_url, bio, gifts, city, country, interests, is_public")
        .eq("username", username!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useProfileById(profileId: string | undefined) {
  return useQuery({
    queryKey: ["community-profile-by-id", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, username, avatar_url")
        .eq("id", profileId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

export function useConversation(meId: string | undefined, otherId: string | undefined) {
  return useQuery({
    queryKey: ["community-conversation", meId, otherId],
    enabled: !!meId && !!otherId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${meId},recipient_id.eq.${otherId}),and(sender_id.eq.${otherId},recipient_id.eq.${meId})`)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });
}

export type ConversationSummary = {
  otherId: string;
  otherName: string;
  otherUsername: string | null;
  otherAvatar: string | null;
  lastBody: string;
  lastCreatedAt: string;
  unreadCount: number;
};

export function useConversations(meId: string | undefined) {
  return useQuery({
    queryKey: ["community-conversations", meId],
    enabled: !!meId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          "id, sender_id, recipient_id, body, created_at, read_at, sender:profiles!messages_sender_id_fkey(id,name,username,avatar_url), recipient:profiles!messages_recipient_id_fkey(id,name,username,avatar_url)",
        )
        .or(`sender_id.eq.${meId},recipient_id.eq.${meId}`)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const byOther = new Map<string, ConversationSummary>();
      for (const row of data ?? []) {
        const mine = row.sender_id === meId;
        const other = mine ? row.recipient : row.sender;
        if (!other) continue;
        const isUnread = !mine && !row.read_at;
        const existing = byOther.get(other.id);
        if (existing) {
          if (isUnread) existing.unreadCount += 1;
        } else {
          byOther.set(other.id, {
            otherId: other.id,
            otherName: other.name,
            otherUsername: other.username,
            otherAvatar: other.avatar_url,
            lastBody: row.body,
            lastCreatedAt: row.created_at,
            unreadCount: isUnread ? 1 : 0,
          });
        }
      }
      return Array.from(byOther.values());
    },
  });
}

export function useSendMessage(meId: string | undefined, otherId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: string) => {
      if (!meId || !otherId) throw new Error("Chýba profil.");
      const { error } = await supabase.from("messages").insert({ sender_id: meId, recipient_id: otherId, body });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-conversation", meId, otherId] });
      queryClient.invalidateQueries({ queryKey: ["community-conversations", meId] });
    },
  });
}

export function useMarkMessagesRead(meId: string | undefined, otherId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!meId || !otherId) return;
      const { error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("sender_id", otherId)
        .eq("recipient_id", meId)
        .is("read_at", null);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-conversation", meId, otherId] });
      queryClient.invalidateQueries({ queryKey: ["community-conversations", meId] });
      queryClient.invalidateQueries({ queryKey: ["community-notifications"] });
    },
  });
}

export function useIsAdmin() {
  return useQuery({
    queryKey: ["community-is-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_admin");
      if (error) throw error;
      return Boolean(data);
    },
  });
}

export type AdminStats = {
  members_total: number;
  members_7d: number;
  members_30d: number;
  members_confirmed: number;
  profiles_total: number;
  profiles_onboarded: number;
  profiles_public: number;
  profiles_with_avatar: number;
  profiles_with_cycle: number;
  activities_total: number;
  activities_7d: number;
  activities_30d: number;
  active_members_30d: number;
  km_total: number;
  km_30d: number;
  minutes_total: number;
  feelings_total: number;
  feelings_7d: number;
  likes_total: number;
  comments_total: number;
  follows_total: number;
  challenges_active: number;
  challenge_participants: number;
  challenge_entries: number;
  strava_connections: number;
  orders_total: number;
  orders_paid: number;
  orders_revenue_cents: number;
  activity_types: { activity_type: string; count: number }[];
};

export function useAdminStats(enabled: boolean) {
  return useQuery({
    queryKey: ["admin-stats"],
    enabled,
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_stats");
      if (error) throw error;
      return data as unknown as AdminStats;
    },
  });
}

export type AdminMember = {
  profile_id: string;
  user_id: string;
  name: string;
  username: string | null;
  email: string;
  city: string | null;
  is_public: boolean;
  onboarding_completed: boolean;
  avatar_url: string | null;
  registered_at: string;
  last_sign_in_at: string | null;
  email_confirmed: boolean;
  activities: number;
  km: number;
  feelings: number;
  last_activity: string | null;
  is_admin: boolean;
};

export function useAdminMembers(enabled: boolean) {
  return useQuery({
    queryKey: ["admin-members"],
    enabled,
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_members");
      if (error) throw error;
      return (data ?? []) as unknown as AdminMember[];
    },
  });
}

export type AdminDay = { day: string; signups: number; activities: number; feelings: number };

export function useAdminSeries(enabled: boolean, days = 30) {
  return useQuery({
    queryKey: ["admin-series", days],
    enabled,
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_daily_series", { _days: days });
      if (error) throw error;
      return (data ?? []) as unknown as AdminDay[];
    },
  });
}

export type DivaProfile = {
  id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  city: string | null;
  bio: string | null;
  interests: string[] | null;
  /** Life chapter — null unless the diva has opted in to sharing it. */
  chapter: string | null;
};

/** Selected from the `profiles_directory` view, which only computes `chapter` when the diva opted in — the raw is_pregnant/is_menopause/etc. flags never leave the database for anyone but the owner. */
const DIVA_SELECT = "id, name, username, avatar_url, city, bio, interests, chapter";

export type DivaFilters = { city?: string; interest?: string; chapter?: string };

export function useSearchDivas(term: string, filters: DivaFilters = {}) {
  const query = term.trim();
  const { city, interest, chapter } = filters;
  return useQuery({
    queryKey: ["community-search-divas", query, city, interest, chapter],
    enabled: query.length >= 2,
    queryFn: async () => {
      let q = supabase
        .from("profiles_directory")
        .select(DIVA_SELECT)
        .not("user_id", "is", null)
        .eq("is_demo", false)
        .or(`name.ilike.%${query}%,username.ilike.%${query}%`);
      if (city) q = q.ilike("city", `%${city}%`);
      if (interest) q = q.contains("interests", [interest]);
      if (chapter) q = q.eq("chapter", chapter);
      const { data, error } = await q.order("name").limit(30);
      if (error) throw error;
      return (data ?? []) as unknown as DivaProfile[];
    },
  });
}

export function useSuggestedDivas(filters: DivaFilters = {}) {
  const { city, interest, chapter } = filters;
  return useQuery({
    queryKey: ["community-suggested-divas", city, interest, chapter],
    queryFn: async () => {
      let q = supabase
        .from("profiles_directory")
        .select(DIVA_SELECT)
        .not("user_id", "is", null)
        .eq("is_demo", false);
      if (city) q = q.ilike("city", `%${city}%`);
      if (interest) q = q.contains("interests", [interest]);
      if (chapter) q = q.eq("chapter", chapter);
      const hasFilters = !!(city || interest || chapter);
      const { data, error } = hasFilters
        ? await q.order("name").limit(30)
        : await q.order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return (data ?? []) as unknown as DivaProfile[];
    },
  });
}

export function useFriends(profileId: string | undefined) {
  return useQuery({
    queryKey: ["community-friends", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follows")
        .select(`following_id, following:profiles!follows_following_id_fkey(${DIVA_SELECT})`)
        .eq("follower_id", profileId!);
      if (error) throw error;
      return (data ?? []) as unknown as { following_id: string; following: DivaProfile | null }[];
    },
  });
}

export function useToggleFriend(profileId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ targetId, isFriend }: { targetId: string; isFriend: boolean }) => {
      if (!profileId) throw new Error("no profile");
      if (isFriend) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", profileId)
          .eq("following_id", targetId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: profileId, following_id: targetId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-friends"] });
    },
  });
}

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  gallery_image_urls: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export function useBlogPosts(includeUnpublished: boolean) {
  return useQuery({
    queryKey: ["blog-posts", includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (!includeUnpublished) query = query.eq("published", true);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as BlogPost[];
    },
  });
}

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ["blog-post", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return data as BlogPost | null;
    },
  });
}

export type BlogPostInput = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  gallery_image_urls: string[];
  published: boolean;
  published_at: string | null;
};

export function useSaveBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: BlogPostInput) => {
      const { id, ...rest } = post;
      if (id) {
        const { error } = await supabase.from("blog_posts").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post"] });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}
