import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Download, RefreshCw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { quoteForDate } from "@/community/lib/quotes";
import quoteBg1 from "@/assets/quotes/quote-bg-1.jpg";
import quoteBg2 from "@/assets/quotes/quote-bg-2.jpg";
import quoteBg3 from "@/assets/quotes/quote-bg-3.jpg";
import quoteBg4 from "@/assets/quotes/quote-bg-4.jpg";
import quoteBg5 from "@/assets/quotes/quote-bg-5.jpg";

const BACKGROUNDS = [quoteBg1, quoteBg2, quoteBg3, quoteBg4, quoteBg5];

const CARD_W = 1080;
const CARD_H = 1920;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function drawCard(canvas: HTMLCanvasElement, quote: string, bgSrc: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = await loadImage(bgSrc);
  const scale = Math.max(CARD_W / img.width, CARD_H / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  ctx.drawImage(img, (CARD_W - drawW) / 2, (CARD_H - drawH) / 2, drawW, drawH);

  const overlay = ctx.createLinearGradient(0, 0, 0, CARD_H);
  overlay.addColorStop(0, "rgba(30, 20, 20, 0.35)");
  overlay.addColorStop(0.55, "rgba(20, 12, 12, 0.55)");
  overlay.addColorStop(1, "rgba(15, 8, 8, 0.75)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.fillStyle = "hsl(40, 30%, 96%)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "italic 600 72px 'Cormorant Garamond', serif";

  const maxWidth = CARD_W - 200;
  const lines = wrapLines(ctx, `"${quote}"`, maxWidth);
  const lineHeight = 92;
  const centerY = CARD_H * 0.62;
  const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => ctx.fillText(line, CARD_W / 2, startY + i * lineHeight));

  const ruleY = startY + lines.length * lineHeight + 8;
  ctx.strokeStyle = "hsl(344, 55%, 72%)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(CARD_W / 2 - 60, ruleY);
  ctx.lineTo(CARD_W / 2 + 60, ruleY);
  ctx.stroke();

  ctx.font = "500 32px 'Josefin Sans', sans-serif";
  ctx.fillStyle = "hsl(40, 30%, 96%)";
  ctx.fillText("D I V A   C O M M U N I T Y", CARD_W / 2, CARD_H - 130);
}

export default function CommunityDailyQuote() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgIndex, setBgIndex] = useState(() => {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86400000);
    return dayOfYear % BACKGROUNDS.length;
  });
  const [sharing, setSharing] = useState(false);
  const quote = quoteForDate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    const draw = () => void drawCard(canvas, quote, BACKGROUNDS[bgIndex]);
    if (fonts?.ready) fonts.ready.then(draw);
    else draw();
  }, [quote, bgIndex]);

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
        toast.info("Obrázok je stiahnutý — nahraj si ho do Instagram Stories ručne.");
      }
    } catch {
      toast.error("Zdieľanie sa nepodarilo. Skús to znova.");
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

  return (
    <div className="space-y-6">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Domov
      </Link>

      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Citát dňa</p>
        <h1 className="mt-2 font-display text-3xl">Pre teba, diva</h1>
      </header>

      <div className="mx-auto max-w-xs overflow-hidden rounded-2xl border border-border shadow-sm">
        <canvas ref={canvasRef} width={CARD_W} height={CARD_H} className="block w-full" aria-label={`Citát dňa: ${quote}`} />
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setBgIndex((i) => (i + 1) % BACKGROUNDS.length)}
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
          Iná fotka
        </Button>
      </div>

      <div className="mx-auto max-w-xs space-y-2">
        <Button className="w-full" size="lg" onClick={share} disabled={sharing}>
          <Share2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
          {sharing ? "Pripravujem..." : "Zdieľať"}
        </Button>
        <Button variant="ghost" className="w-full" onClick={download}>
          <Download className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Stiahnuť obrázok
        </Button>
      </div>
    </div>
  );
}
