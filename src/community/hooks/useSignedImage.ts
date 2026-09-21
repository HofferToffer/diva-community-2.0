import { useQuery } from "@tanstack/react-query";
import { resolveImageUrl } from "../lib/storage";

export function useSignedImage(stored: string | null | undefined) {
  const { data } = useQuery({
    queryKey: ["signed-image", stored],
    queryFn: () => resolveImageUrl(stored),
    enabled: !!stored,
    staleTime: 1000 * 60 * 60,
  });
  return data ?? null;
}
