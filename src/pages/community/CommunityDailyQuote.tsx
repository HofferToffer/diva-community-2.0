import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Download, Moon, Share2, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { quoteForDate } from "@/community/lib/quotes";

const CARD_W = 1080;
const CARD_H = 1920;

const THEMES = {
  light: { bg: "hsl(30, 25%, 85%)", text: "hsl(30, 15%, 20%)", accent: "hsl(344, 28%, 62%)" },
  dark: { bg: "hsl(30, 15%, 14%)", text: "hsl(40, 30%, 90%)", accent: "hsl(344, 37%, 65%)" },
};

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

function drawCard(canvas: HTMLCanvasElement, quote: string, theme: "light" | "dark") {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { bg, text, accent } = THEMES[theme];

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.fillStyle = text;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "italic 600 76px 'Cormorant Garamond', serif";

  const maxWidth = CARD_W - 220;
  const lines = wrapLines(ctx, `"${quote}"`, maxWidth);
  const lineHeight = 96;
  const startY = CARD_H / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => ctx.fillText(line, CARD_W / 2, startY + i * lineHeight));

  const ruleY = startY + lines.length * lineHeight + 10;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(CARD_W / 2 - 60, ruleY);
  ctx.lineTo(CARD_W / 2 + 60, ruleY);
  ctx.stroke();

  ctx.font = "500 34px 'Josefin Sans', sans-serif";
  ctx.fillStyle = accent;
  ctx.fillText("D I V A   C O M M U N I T Y", CARD_W / 2, CARD_H - 140);
}

export default function CommunityDailyQuote() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [sharing, setSharing] = useState(false);
  const quote = quoteForDate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(() => drawCard(canvas, quote, theme));
    } else {
      drawCard(canvas, quote, theme);
    }
  }, [quote, theme]);

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

      <div className="flex justify-center gap-2">
        <Button
          type="button"
          variant={theme === "light" ? "default" : "outline"}
          size="icon"
          aria-label="Svetlá karta"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={theme === "dark" ? "default" : "outline"}
          size="icon"
          aria-label="Tmavá karta"
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-4 w-4" />
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
