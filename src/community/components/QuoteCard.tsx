import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Download, ImagePlus, RefreshCw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CARD_H, CARD_W, QUOTE_BACKGROUNDS, defaultBgIndex, drawQuoteCard } from "@/community/lib/quoteCard";

interface QuoteCardProps {
  quote: string;
  variant?: "compact" | "full";
  className?: string;
}

export function QuoteCard({ quote, variant = "full", className }: QuoteCardProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bgIndex, setBgIndex] = useState(defaultBgIndex);
  const [customBg, setCustomBg] = useState<File | null>(null);
  const [sharing, setSharing] = useState(false);
  const activeBg = customBg ?? QUOTE_BACKGROUNDS[bgIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    const draw = () => void drawQuoteCard(canvas, quote, activeBg);
    if (fonts?.ready) fonts.ready.then(draw);
    else draw();
  }, [quote, activeBg]);

  const getBlob = () =>
    new Promise<Blob | null>((resolve) => canvasRef.current?.toBlob((blob) => resolve(blob), "image/png"));

  const share = async () => {
    setSharing(true);
    try {
      const blob = await getBlob();
      if (!blob) throw new Error("no blob");
      const file = new File([blob], "diva-citat.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "DIVA Community" });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diva-citat.png";
        a.click();
        URL.revokeObjectURL(url);
        toast.info(t("quoteCard.downloadedManualUpload"));
      }
    } catch {
      toast.error(t("quoteCard.shareFailed"));
    } finally {
      setSharing(false);
    }
  };

  const download = async () => {
    const blob = await getBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diva-citat.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const pickOwnPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCustomBg(file);
  };

  return (
    <div className={className}>
      <div className="mx-auto max-w-xs overflow-hidden rounded-2xl border border-border shadow-elevated-sm">
        <canvas
          ref={canvasRef}
          width={CARD_W}
          height={CARD_H}
          className="block w-full"
          aria-label={t("quoteCard.ariaLabel", { quote })}
        />
      </div>

      {variant === "full" && (
        <div className="mt-4 flex justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setCustomBg(null);
              setBgIndex((i) => (i + 1) % QUOTE_BACKGROUNDS.length);
            }}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {t("quoteCard.otherPhotoButton")}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {t("quoteCard.customPhotoButton")}
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={pickOwnPhoto} />
        </div>
      )}

      <div className="mx-auto mt-4 max-w-xs space-y-2">
        <Button className="w-full" size="lg" onClick={share} disabled={sharing}>
          <Share2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
          {sharing ? t("quoteCard.preparing") : t("quoteCard.shareButton")}
        </Button>
        {variant === "full" && (
          <Button variant="ghost" className="w-full" onClick={download}>
            <Download className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {t("quoteCard.downloadImageButton")}
          </Button>
        )}
      </div>
    </div>
  );
}
