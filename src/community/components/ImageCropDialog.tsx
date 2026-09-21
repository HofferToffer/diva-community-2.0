import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ImageCropDialogProps {
  /** Object/data URL of the chosen file; dialog opens when set. */
  image: string | null;
  /** Crop area aspect ratio (e.g. 1 for avatar, 4/3 for activity photos). */
  aspect: number;
  /** Show a circular crop indicator (profile photos). */
  round?: boolean;
  title?: string;
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void> | void;
}

async function cropToFile(src: string, area: Area): Promise<File> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = src;
  });
  const canvas = document.createElement("canvas");
  const size = Math.min(Math.max(Math.round(Math.min(area.width, area.height)), 128), 1600);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas nie je dostupný.");
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, size, size);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  if (!blob) throw new Error("Fotku sa nepodarilo orezať.");
  return new File([blob], "fotka.jpg", { type: "image/jpeg" });
}

/** Modal that lets the user pan & zoom a photo and confirm the cropped area. */
export function ImageCropDialog({ image, aspect, round, title, onCancel, onConfirm }: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), []);

  const confirm = async () => {
    if (!image || !area) return;
    setSaving(true);
    try {
      await onConfirm(await cropToFile(image, area));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!image} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{title ?? "Uprav si fotku"}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-square w-full touch-none overflow-hidden rounded-xl bg-foreground/5">

          {image && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={round ? "round" : "rect"}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <div className="flex items-center gap-3 px-1">
          <span className="text-xs text-muted-foreground">Priblíženie</span>
          <Slider min={1} max={3} step={0.01} value={[zoom]} onValueChange={([v]) => setZoom(v)} aria-label="Priblíženie" />
        </div>
        <p className="text-center text-xs text-muted-foreground">Potiahni fotku a vyber výrez.</p>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Zrušiť
          </Button>
          <Button onClick={confirm} disabled={saving || !area}>
            {saving ? "Ukladám…" : "Použiť výrez"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
