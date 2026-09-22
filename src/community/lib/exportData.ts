import { supabase } from "@/integrations/supabase/client";

/**
 * GDPR "right to access" self-service export — pulls every row that belongs
 * to the signed-in woman (her own RLS already scopes these queries to her
 * data) and hands back a plain JSON object she can download.
 */
export async function exportMyData(profileId: string) {
  const [profile, activities, comments, feelings, messagesSent, messagesReceived] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", profileId).maybeSingle(),
    supabase.from("activities").select("*").eq("profile_id", profileId),
    supabase.from("activity_comments").select("*").eq("profile_id", profileId),
    supabase.from("daily_feelings").select("*").eq("profile_id", profileId),
    supabase.from("messages").select("*").eq("sender_id", profileId),
    supabase.from("messages").select("*").eq("recipient_id", profileId),
  ]);

  return {
    exported_at: new Date().toISOString(),
    profile: profile.data ?? null,
    activities: activities.data ?? [],
    activity_comments: comments.data ?? [],
    daily_feelings: feelings.data ?? [],
    messages_sent: messagesSent.data ?? [],
    messages_received: messagesReceived.data ?? [],
  };
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
