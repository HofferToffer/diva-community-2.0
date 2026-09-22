import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { MarkerClusterGroup } from "@/community/components/MarkerClusterGroup";
import { ProfileAvatar } from "@/community/components/StoredImage";
import { EmptyState } from "@/community/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { fadeUp } from "@/community/lib/motion";
import { jitterCoords } from "@/community/lib/geo";
import { PHASE_LABEL, type LifePhase } from "@/community/lib/quotes";
import { useMapDivas, type MapDiva } from "@/community/hooks/queries";

const divaIcon = L.divIcon({
  html: `<div class="diva-map-pin"></div>`,
  className: "",
  iconSize: L.point(16, 16),
});

function FitToDivas({ points }: { points: [number, number][] }) {
  const map = useMap();
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
        Divy
      </Link>

      <motion.header {...fadeUp(0)} className="space-y-1">
        <h1 className="font-display text-3xl">Mapa Divy</h1>
        <p className="text-sm text-muted-foreground">
          Kde všade sme. Ukazujeme len mesto, nikdy presnú adresu — ak si niekoho nájdeš nablízku, napíš jej.
        </p>
      </motion.header>

      {isLoading && <Skeleton className="h-[60vh] w-full rounded-2xl" />}

      {!isLoading && points.length === 0 && (
        <EmptyState title="Zatiaľ tu nikto nie je" description="Keď si Divy vyplnia mesto v profile, uvidíš ich tu." />
      )}

      {!isLoading && points.length > 0 && (
        <motion.div
          {...fadeUp(1)}
          className="overflow-hidden rounded-2xl border border-border/50 shadow-sm"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <MapContainer
            center={[48.7, 19.5]}
            zoom={5}
            scrollWheelZoom
            style={{ height: "65vh", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              detectRetina
            />
            <FitToDivas points={bounds} />
            <MarkerClusterGroup>
              {points.map(({ diva, coords }) => (
                <DivaMarker key={diva.id} diva={diva} coords={coords} isMe={diva.id === profile?.id} />
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </motion.div>
      )}
    </div>
  );
}

function DivaMarker({ diva, coords, isMe }: { diva: MapDiva; coords: [number, number]; isMe: boolean }) {
  return (
    <Marker position={coords} icon={divaIcon}>
      <Popup>
        <div className="flex min-w-40 items-center gap-2">
          <ProfileAvatar path={diva.avatar_url} name={diva.name} size={36} />
          <div className="min-w-0">
            <p className="truncate font-display text-base leading-tight">
              {diva.name} {isMe && "(ty)"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{diva.city}</p>
            {diva.chapter && (
              <p className="truncate text-xs text-primary">{PHASE_LABEL[diva.chapter as LifePhase] ?? diva.chapter}</p>
            )}
            {diva.username && !isMe && (
              <Link to={`/community/divy/${diva.username}`} className="text-xs underline">
                Pozrieť profil
              </Link>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
