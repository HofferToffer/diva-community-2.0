/** A small deterministic pseudo-random number in [0, 1) seeded by a string id. */
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0) / 4294967296;
}

/**
 * Nudges a diva's marker a small, deterministic distance (up to ~2km) from
 * her city's centroid, so several women in the same city don't render as a
 * single overlapping dot once you zoom in — while still never revealing
 * anything more precise than "somewhere in this city".
 */
export function jitterCoords(id: string, lat: number, lng: number): [number, number] {
  const angle = seededRandom(`${id}-angle`) * 2 * Math.PI;
  const distanceKm = seededRandom(`${id}-dist`) * 2;
  const latOffset = (distanceKm / 111) * Math.cos(angle);
  const lngOffset = (distanceKm / (111 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);
  return [lat + latOffset, lng + lngOffset];
}
