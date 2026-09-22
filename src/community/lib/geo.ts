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

/**
 * Unwraps a ring so longitude counts continuously past ±180° instead of
 * wrapping (e.g. 178, 179, 181, 183 instead of 178, 179, -179, -177) —
 * i.e. never lets two consecutive points jump more than 180°.
 */
function unwrapRing(ring: Ring): { ring: Ring; crossed: boolean } {
  const out: Ring = [ring[0]];
  let crossed = false;
  for (let i = 1; i < ring.length; i++) {
    const prevLng = out[i - 1][0];
    let [lng, lat] = ring[i];
    while (lng - prevLng > 180) {
      lng -= 360;
      crossed = true;
    }
    while (lng - prevLng < -180) {
      lng += 360;
      crossed = true;
    }
    out.push([lng, lat]);
  }
  return { ring: out, crossed };
}

function shiftRings(rings: Ring[], deltaLng: number): Ring[] {
  return rings.map((ring) => ring.map(([lng, lat]) => [lng + deltaLng, lat] as [number, number]));
}

/**
 * A few countries (Russia, Fiji, Antarctica) cross the antimeridian; drawn
 * with raw [-180, 180]-wrapped coordinates, a ring jumps 360° between two
 * consecutive points, drawing a stray edge straight across the whole map —
 * and naively splitting/clipping the ring at that jump falls apart on a
 * shape as complex as Russia's coastline (self-intersecting fills). Instead,
 * unwrap each polygon's rings together so its coordinates flow continuously
 * past ±180°, then — for any polygon that actually crossed — also emit a
 * second copy shifted by -360°, so the shape still renders correctly
 * whichever side of the map the viewer is looking at.
 */
export function fixAntimeridian(geojson: GeoJSON.FeatureCollection): GeoJSON.FeatureCollection {
  function fixPolygon(rings: Ring[]): Ring[][] {
    let crossed = false;
    const unwrapped = rings.map((ring) => {
      const result = unwrapRing(ring);
      if (result.crossed) crossed = true;
      return result.ring;
    });
    return crossed ? [unwrapped, shiftRings(unwrapped, -360)] : [unwrapped];
  }

  return {
    ...geojson,
    features: geojson.features.map((f) => {
      const geom = f.geometry;
      const polygons: Ring[][] =
        geom.type === "Polygon"
          ? [geom.coordinates as unknown as Ring[]]
          : geom.type === "MultiPolygon"
            ? (geom.coordinates as unknown as Ring[][])
            : [];
      if (polygons.length === 0) return f;

      const outPolygons = polygons.flatMap(fixPolygon);
      return { ...f, geometry: { type: "MultiPolygon", coordinates: outPolygons } };
    }),
  } as GeoJSON.FeatureCollection;
}
