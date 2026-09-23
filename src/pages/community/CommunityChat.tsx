import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileAvatar } from "@/community/components/StoredImage";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { useConversation, useMarkMessagesRead, useProfileById, useSendMessage } from "@/community/hooks/queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { fadeUp } from "@/community/lib/motion";
import { cn } from "@/lib/utils";

function formatTime(iso: string, locale: "sk" | "en" = "sk") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "sk-SK", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export default function CommunityChat() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>();
  const { profile: me } = useCommunityAuth();
  const { data: other, isLoading: loadingOther } = useProfileById(profileId);
  const { data: messages, isLoading: loadingMessages } = useConversation(me?.id, profileId);
  const sendMessage = useSendMessage(me?.id, profileId);
  const markRead = useMarkMessagesRead(me?.id, profileId);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (me?.id && profileId) markRead.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.id, profileId, messages?.length]);

  useEffect(() => {
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [messages?.length]);

  useEffect(() => {
    if (!me?.id) return;
    const channel = supabase
      .channel(`messages-${me.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `recipient_id=eq.${me.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["community-conversation"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [me?.id, queryClient]);

  const submit = async () => {
    const body = draft.trim();
    if (!body) return;
    try {
      await sendMessage.mutateAsync(body);
      setDraft("");
    } catch {
      toast.error(t("chat.sendFailed"));
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("nav.home")}
      </Link>

      {loadingOther ? (
        <Skeleton className="h-12 w-48" />
      ) : other ? (
        <button
          type="button"
          className="flex items-center gap-3 text-left"
          onClick={() => other.username && navigate(`/community/divy/${other.username}`)}
        >
          <ProfileAvatar path={other.avatar_url} name={other.name ?? "Diva"} size={40} />
          <p className="font-display text-xl">{other.name}</p>
        </button>
      ) : (
        <p className="text-sm text-muted-foreground">{t("chat.profileNotFound")}</p>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
        {loadingMessages && <Skeleton className="h-24 w-full" />}
        {!loadingMessages && messages?.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("chat.emptyConversation")}
          </p>
        )}
        {messages?.map((m, i) => {
          const mine = m.sender_id === me?.id;
          return (
            <motion.div key={m.id} {...fadeUp(Math.min(i, 3))} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                  mine ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                )}
              >
                <p className="leading-relaxed">{m.body}</p>
                <p className={cn("mt-1 text-[0.65rem] opacity-70")}>{formatTime(m.created_at, isEnglish ? "en" : "sk")}</p>
              </div>
            </motion.div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="flex items-end gap-2">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("chat.placeholder")}
          rows={1}
          maxLength={1000}
          className="min-h-11 flex-1 resize-none rounded-2xl border-border/50 text-base shadow-sm lg:text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
        />
        <Button size="lg" onClick={submit} disabled={!draft.trim() || sendMessage.isPending}>
          {t("chat.sendButton")}
        </Button>
      </div>
    </div>
  );
}
