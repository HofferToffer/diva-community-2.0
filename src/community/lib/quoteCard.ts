import quoteBg1 from "@/assets/quotes/quote-bg-1.jpg";
import quoteBg2 from "@/assets/quotes/quote-bg-2.jpg";
import quoteBg3 from "@/assets/quotes/quote-bg-3.jpg";
import quoteBg4 from "@/assets/quotes/quote-bg-4.jpg";
import quoteBg5 from "@/assets/quotes/quote-bg-5.jpg";
import quoteBg6 from "@/assets/quotes/quote-bg-6.jpg";
import quoteBg7 from "@/assets/quotes/quote-bg-7.jpg";
import quoteBg8 from "@/assets/quotes/quote-bg-8.jpg";
import quoteBg9 from "@/assets/quotes/quote-bg-9.jpg";
import quoteBg10 from "@/assets/quotes/quote-bg-10.jpg";

export const QUOTE_BACKGROUNDS = [
  quoteBg1,
  quoteBg2,
  quoteBg3,
  quoteBg4,
  quoteBg5,
  quoteBg6,
  quoteBg7,
  quoteBg8,
  quoteBg9,
  quoteBg10,
];

export const CARD_W = 1080;
export const CARD_H = 1920;

export function defaultBgIndex(): number {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86400000);
  return dayOfYear % QUOTE_BACKGROUNDS.length;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Photos from phones carry an EXIF orientation tag; drawing them to canvas
 * via a plain <img> ignores it on some browsers (notably iOS Safari), which
 * is why an uploaded portrait photo can come out sideways/"crooked". Decoding
 * through createImageBitmap with imageOrientation: "from-image" applies the
 * tag correctly before it ever reaches the canvas.
 */
function loadBackgroundImage(bg: string | File): Promise<HTMLImageElement | ImageBitmap> {
  if (bg instanceof File) {
    return createImageBitmap(bg, { imageOrientation: "from-image" });
  }
  return loadImage(bg);
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

export async function drawQuoteCard(canvas: HTMLCanvasElement, quote: string, bgSrc: string | File) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = await loadBackgroundImage(bgSrc);
  // Canvas text doesn't wait for web fonts on its own — make sure the brand fonts are ready.
  await Promise.all([
    document.fonts.load("italic 400 72px 'Cormorant Garamond'"),
    document.fonts.load("400 32px 'Jost'"),
  ]).catch(() => undefined);
  const scale = Math.max(CARD_W / img.width, CARD_H / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  ctx.drawImage(img, (CARD_W - drawW) / 2, (CARD_H - drawH) / 2, drawW, drawH);

  const overlay = ctx.createLinearGradient(0, 0, 0, CARD_H);
  overlay.addColorStop(0, "rgba(74, 47, 56, 0.35)");
  overlay.addColorStop(0.55, "rgba(58, 36, 44, 0.6)");
  overlay.addColorStop(1, "rgba(40, 24, 30, 0.8)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.fillStyle = "#F4ECE3";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "italic 400 72px 'Cormorant Garamond', serif"; // brand: Cormorant never bold

  const maxWidth = CARD_W - 200;
  const lines = wrapLines(ctx, `"${quote}"`, maxWidth);
  const lineHeight = 92;
  const centerY = CARD_H * 0.62;
  const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => ctx.fillText(line, CARD_W / 2, startY + i * lineHeight));

  const ruleY = startY + lines.length * lineHeight + 8;
  ctx.strokeStyle = "#E3B9A7";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(CARD_W / 2 - 60, ruleY);
  ctx.lineTo(CARD_W / 2 + 60, ruleY);
  ctx.stroke();

  ctx.font = "400 32px 'Jost', sans-serif";
  ctx.fillStyle = "#F4ECE3";
  ctx.fillText("D I V A   C O M M U N I T Y", CARD_W / 2, CARD_H - 130);
}
