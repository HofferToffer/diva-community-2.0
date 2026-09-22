import L from "leaflet";
import "leaflet.markercluster";
import { createElementObject, createLayerComponent, extendContext } from "@react-leaflet/core";

/**
 * A LayerGroup-shaped wrapper around leaflet.markercluster (there's no
 * official React-18-compatible one). Built the same way react-leaflet's own
 * <LayerGroup> is: it creates the Leaflet layer, then hands nested
 * <Marker>/<Popup> children a context whose layerContainer is that layer, so
 * they attach to the cluster group instead of the map directly — meaning
 * ProfileAvatar and other real React children inside popups keep working.
 */
export const MarkerClusterGroup = createLayerComponent(function createMarkerClusterGroup(
  { children: _children, ...options }: L.MarkerClusterGroupOptions & { children?: React.ReactNode },
  ctx,
) {
  const group = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    iconCreateFunction: (cluster) =>
      L.divIcon({
        html: `<div class="diva-cluster">${cluster.getChildCount()}</div>`,
        className: "",
        iconSize: L.point(40, 40),
      }),
    ...options,
  });
  return createElementObject(group, extendContext(ctx, { layerContainer: group }));
});
