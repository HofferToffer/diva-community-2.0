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

type Ring = [number, number][];

function splitRingAtAntimeridian(ring: Ring): Ring[] {
  const segments: Ring[] = [];
  let current: Ring = [ring[0]];
  for (let i = 1; i < ring.length; i++) {
    const [prevLng] = ring[i - 1];
    const [lng] = ring[i];
    if (Math.abs(lng - prevLng) > 180) {
      segments.push(current);
      current = [];
    }
    current.push(ring[i]);
  }
  segments.push(current);
  return segments.filter((s) => s.length > 1);
}

/**
 * A few countries (Russia, Fiji, Antarctica) cross the antimeridian; left as-is,
 * their rings draw one long edge straight across the whole map. Splits each ring
 * into segments wherever it jumps more than 180° of longitude.
 */
export function fixAntimeridian(geojson: GeoJSON.FeatureCollection): GeoJSON.FeatureCollection {
  return {
    ...geojson,
    features: geojson.features.map((f) => {
      const geom = f.geometry;
      if (geom.type === "Polygon") {
        const rings = (geom.coordinates as unknown as Ring[]).flatMap(splitRingAtAntimeridian);
        return { ...f, geometry: { type: "MultiPolygon", coordinates: rings.map((r) => [r]) } };
      }
      if (geom.type === "MultiPolygon") {
        const polys = (geom.coordinates as unknown as Ring[][]).flatMap((poly) =>
          poly.flatMap(splitRingAtAntimeridian).map((r) => [r]),
        );
        return { ...f, geometry: { type: "MultiPolygon", coordinates: polys } };
      }
      return f;
    }),
  } as GeoJSON.FeatureCollection;
}
