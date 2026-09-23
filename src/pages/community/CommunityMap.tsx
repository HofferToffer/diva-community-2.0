import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MapContainer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { feature } from "topojson-client";
import countriesTopology from "world-atlas/countries-110m.json";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { MarkerClusterGroup } from "@/community/components/MarkerClusterGroup";
import { ProfileAvatar } from "@/community/components/StoredImage";
import { EmptyState } from "@/community/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { fadeUp } from "@/community/lib/motion";
import { jitterCoords, fixAntimeridian } from "@/community/lib/geo";
import { PHASE_LABEL, type LifePhase } from "@/community/lib/quotes";
import { useMapDivas, type MapDiva } from "@/community/hooks/queries";

const divaIcon = L.divIcon({
  html: `<div class="diva-map-pin"></div>`,
  className: "",
  iconSize: L.point(16, 16),
});

// A distinct gold pin just for "me", so she can spot herself among the crowd at a glance.
const myDivaIcon = L.divIcon({
  html: `<div class="diva-map-pin diva-map-pin--me"></div>`,
  className: "",
  iconSize: L.point(18, 18),
});

// Bundled at build time (no tile server, no API key) — a flat, engraved-map look:
// warm parchment countries on a deep ground, borders only, no roads or labels.
const COUNTRIES_GEOJSON = fixAntimeridian(
  feature(
    countriesTopology as never,
    (countriesTopology as unknown as { objects: { countries: never } }).objects.countries,
  ) as unknown as GeoJSON.FeatureCollection,
);

const COUNTRY_STYLE = {
  fillColor: "#E9D8AE",
  fillOpacity: 1,
  color: "#6B5738",
  weight: 0.7,
};

function FitToDivas({ points }: { points: [number, number][] }) {
  const map = useMap();

  // Belt-and-suspenders against Leaflet measuring its container mid-layout-shift.
  useEffect(() => {
    const id = requestAnimationFrame(() => map.invalidateSize());
    return () => cancelAnimationFrame(id);
  }, [map]);

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 11);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 12 });
  }, [map, points]);
  return null;
}

export default function CommunityMap() {
  const { t } = useTranslation();
  const { profile } = useCommunityAuth();
  const { data: divas, isLoading } = useMapDivas();

  const points = useMemo(
    () =>
      (divas ?? []).map((d) => ({
        diva: d,
        coords: jitterCoords(d.id, d.city_lat, d.city_lng),
      })),
    [divas],
  );
  const bounds = useMemo(() => points.map((p) => p.coords), [points]);

  return (
    <div className="space-y-6">
      <Link to="/community/divy" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("divy.title")}
      </Link>

      <motion.header {...fadeUp(0)} className="space-y-1">
        <h1 className="font-display text-3xl">{t("map.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("map.subtitle")}</p>
      </motion.header>

      {isLoading && <Skeleton className="h-[60vh] w-full rounded-2xl" />}

      {!isLoading && points.length === 0 && (
        <EmptyState title={t("map.emptyTitle")} description={t("map.emptyDescription")} />
      )}

      {!isLoading && points.length > 0 && (
        // A plain div, not motion.div — Leaflet measures its container on mount, and
        // sitting inside a transform-animated element (fadeUp's translateY) made it
        // read the wrong size/position, rendering the tiles skewed.
        <div className="diva-map-frame relative overflow-hidden rounded-2xl border border-border/50 shadow-sm">
          <MapContainer
            center={[48.7, 19.5]}
            zoom={5}
            minZoom={2}
            maxZoom={12}
            zoomSnap={0.25}
            zoomDelta={0.75}
            wheelPxPerZoomLevel={90}
            // South cut at -60° on purpose — Antarctica has no Divy and, at this
            // Mercator-style projection, renders wildly oversized near the pole,
            // which reads as a confusing blob rather than a continent.
            maxBounds={[[-60, -200], [85, 200]]}
            maxBoundsViscosity={1.0}
            scrollWheelZoom
            style={{ height: "65vh", width: "100%", background: "#221C18" }}
          >
            {/* interactive=false — otherwise every filled country becomes a touch
                target, which fights with pinch-zoom/pan on mobile since almost
                the whole map is "country". */}
            <GeoJSON data={COUNTRIES_GEOJSON} style={() => COUNTRY_STYLE} interactive={false} />
            <FitToDivas points={bounds} />
            <MarkerClusterGroup>
              {points.map(({ diva, coords }) => (
                <DivaMarker key={diva.id} diva={diva} coords={coords} isMe={diva.id === profile?.id} />
              ))}
            </MarkerClusterGroup>
          </MapContainer>
          {/* Vignette — a soft engraved-map frame, purely decorative (no pointer capture). */}
          <div className="diva-map-vignette pointer-events-none absolute inset-0" />
        </div>
      )}
    </div>
  );
}

function DivaMarker({ diva, coords, isMe }: { diva: MapDiva; coords: [number, number]; isMe: boolean }) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  return (
    <Marker position={coords} icon={isMe ? myDivaIcon : divaIcon}>
      <Popup>
        <div className="flex min-w-40 items-center gap-2">
          <ProfileAvatar path={diva.avatar_url} name={diva.name} size={36} />
          <div className="min-w-0">
            <p className="truncate font-display text-base leading-tight">
              {diva.name} {isMe && t("map.meMarker")}
            </p>
            <p className="truncate text-xs text-muted-foreground">{diva.city}</p>
            {diva.chapter && (
              <p className="truncate text-xs text-primary">
                {isEnglish
                  ? t(`phaseLabel.${diva.chapter}`, { defaultValue: diva.chapter })
                  : PHASE_LABEL[diva.chapter as LifePhase] ?? diva.chapter}
              </p>
            )}
            {diva.username && !isMe && (
              <Link to={`/community/divy/${diva.username}`} className="text-xs underline">
                {t("map.viewProfile")}
              </Link>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
