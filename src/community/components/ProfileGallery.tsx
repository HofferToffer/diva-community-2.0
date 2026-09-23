import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StoredImage } from "@/community/components/StoredImage";

const MAX_PHOTOS = 12;

export function ProfileGallery({
  photos,
  isMe,
  uploading,
  onAdd,
  onRemove,
}: {
  photos: string[];
  isMe: boolean;
  uploading?: boolean;
  onAdd?: (files: File[]) => void;
  onRemove?: (index: number) => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (photos.length === 0 && !isMe) return null;

  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl">Fotoalbum</h2>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, i) => (
          <div key={photo} className="group relative aspect-square overflow-hidden rounded-xl bg-muted">
            <button type="button" className="h-full w-full" onClick={() => setLightboxIndex(i)}>
              <StoredImage path={photo} alt="" className="h-full w-full object-cover" />
            </button>
            {isMe && onRemove && (
              <button
                type="button"
                aria-label="Odstrániť fotku"
                onClick={() => onRemove(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/60 text-background opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
        {isMe && onAdd && photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-50"
          >
            <Plus className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>
      {isMe && (
        <>
          <p className="text-xs text-muted-foreground">
            {uploading ? "Nahrávam…" : `Až ${MAX_PHOTOS} fotiek. Vidí ich, kto vidí tvoj profil.`}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              // Copy the chosen files out before clearing the input — resetting
              // `value` empties the live FileList in Chromium.
              const files = Array.from(e.target.files ?? []);
              e.target.value = "";
              if (files.length > 0 && onAdd) onAdd(files);
            }}
          />
        </>
      )}

      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent className="max-w-2xl border-none bg-transparent p-0 shadow-none [&>button]:text-white">
          {lightboxIndex !== null && (
            <div className="relative">
              <StoredImage
                path={photos[lightboxIndex]}
                alt=""
                className="max-h-[85vh] w-full rounded-xl object-contain"
              />
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Predchádzajúca fotka"
                    onClick={() =>
                      setLightboxIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length))
                    }
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/50 text-background"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Ďalšia fotka"
                    onClick={() => setLightboxIndex((i) => (i === null ? i : (i + 1) % photos.length))}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/50 text-background"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
