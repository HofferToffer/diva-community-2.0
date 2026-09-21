import { useSignedImage } from "../hooks/useSignedImage";
import { cn } from "@/lib/utils";

type Props = {
  path: string | null | undefined;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
};

export function StoredImage({ path, alt, className, loading = "lazy" }: Props) {
  const url = useSignedImage(path);
  if (!url) return <div className={cn("bg-muted", className)} aria-hidden="true" />;
  return <img src={url} alt={alt} loading={loading} className={className} />;
}

export function ProfileAvatar({
  path,
  name,
  size = 40,
  className,
}: {
  path: string | null | undefined;
  name: string;
  size?: number;
  className?: string;
}) {
  const url = useSignedImage(path);
  const initials = (name || "D")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary font-display text-secondary-foreground",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {url ? (
        <img src={url} alt={name} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  );
}
