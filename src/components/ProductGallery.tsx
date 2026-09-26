import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/lang";


const ProductGallery = ({
  images,
  name,
  comingSoon,
  to,
}: {
  images: string[];
  name: string;
  comingSoon?: boolean;
  to?: string;
}) => {
  const { l } = useLang();

  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const goTo = (index: number) => {
    setCurrent((index + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diffX = touchStart.x - e.changedTouches[0].clientX;
    const diffY = touchStart.y - e.changedTouches[0].clientY;
    // Require a clearly horizontal swipe so scrolling past the gallery
    // doesn't accidentally flip the photo.
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      goTo(current + (diffX > 0 ? 1 : -1));
    }
    setTouchStart(null);
  };

  return (
    <div
      className="relative overflow-hidden bg-muted"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {to ? (
        <Link to={to} className="block">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${name} – ${i + 1}`}
                className={`w-full flex-shrink-0 aspect-[3/4] object-cover ${comingSoon ? "blur-sm" : ""}`}
                loading="lazy"
              />
            ))}
          </div>
        </Link>
      ) : (
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${name} – ${i + 1}`}
              className={`w-full flex-shrink-0 aspect-[3/4] object-cover ${comingSoon ? "blur-sm" : ""}`}
              loading="lazy"
            />
          ))}
        </div>
      )}

      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 pointer-events-none">
          <span className="font-body text-xs tracking-[0.3em] text-background uppercase border border-background/80 px-5 py-2">
            Coming Soon
          </span>
        </div>
      )}


      {!comingSoon && images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              goTo(current - 1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm rounded-full p-1.5 text-foreground hover:bg-background/80 transition-colors"
            aria-label={l("Predchádzajúca fotka", "Previous photo")}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              goTo(current + 1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm rounded-full p-1.5 text-foreground hover:bg-background/80 transition-colors"
            aria-label={l("Ďalšia fotka", "Next photo")}
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrent(i);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === current ? "bg-background" : "bg-background/40"
                }`}
                aria-label={`Fotka ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductGallery;
