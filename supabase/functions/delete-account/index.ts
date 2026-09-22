import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/**
 * GDPR "right to erasure" self-service delete. Two steps, deliberately kept
 * separate: (1) delete_my_account_data() runs as the calling user via RLS-safe
 * RPC and removes every row tied to her profile in one transaction — it can
 * only ever touch her own data, since it looks up the profile from her own
 * auth.uid(); (2) only once that succeeds does this function use the service
 * role to delete the auth user itself (auth.users deletion needs the Admin
 * API, not a plain SQL DELETE, so Supabase's own auth cleanup hooks run).
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return json({ error: "Neprihlásená používateľka." }, 401);
  const userId = userData.user.id;

  const { error: dataError } = await userClient.rpc("delete_my_account_data");
  if (dataError) {
    console.error("delete-account: delete_my_account_data failed", dataError);
    return json({ error: "Vymazanie údajov zlyhalo. Skús to prosím znova." }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey);

  // Uploaded photos live under a per-user folder ({userId}/...) in each bucket,
  // independent of the profile row, so clear those folders too.
  for (const bucket of ["avatars", "activity-photos", "profile-gallery", "profile-cover"]) {
    const { data: files } = await admin.storage.from(bucket).list(userId);
    if (files && files.length > 0) {
      await admin.storage.from(bucket).remove(files.map((f) => `${userId}/${f.name}`));
    }
  }

  const { error: authDeleteError } = await admin.auth.admin.deleteUser(userId);
  if (authDeleteError) {
    console.error("delete-account: auth.admin.deleteUser failed", authDeleteError);
    return json(
      { error: "Tvoje údaje sú vymazané, no samotné konto sa nepodarilo zrušiť. Napíš nám prosím." },
      500,
    );
  }

  return json({ success: true });
});
