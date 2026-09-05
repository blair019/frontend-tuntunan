"use client";

import { useEffect } from "react";

import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";

import L from "leaflet";

import type { Cafe } from "@/src/features/cafes/types/cafe";


interface DiscoveryMapProps {
    cafes: Cafe[];
    center: {
        latitude: number;
        longitude: number;
    } | null;
}


const userLocationIcon = L.divIcon({
    className: "",
    html: `
    <div
      style="
        width: 22px;
        height: 22px;
        border-radius: 9999px;
        background: #b8ff65;
        border: 5px solid rgba(184,255,101,0.22);
        box-shadow: 0 0 0 7px rgba(184,255,101,0.08);
      "
    ></div>
  `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
});


const cafeIcon = L.divIcon({
    className: "",
    html: `
    <div
      style="
        width: 14px;
        height: 14px;
        border-radius: 9999px;
        background: #ffffff;
        border: 3px solid #111111;
        box-shadow: 0 3px 14px rgba(0,0,0,0.45);
      "
    ></div>
  `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
});


export function DiscoveryMap({
                                 cafes,
                                 center,
                             }: DiscoveryMapProps) {
    if (!center) {
        return (
            <div className="flex h-full min-h-[520px] items-center justify-center bg-[#0d0d0d]">
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/25">
                        Map waiting
                    </p>

                    <p className="mt-3 text-sm text-white/40">
                        Search a location or use your current location.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <MapContainer
            center={[
                center.latitude,
                center.longitude,
            ]}
            zoom={15}
            scrollWheelZoom
            zoomControl={false}
            className="h-full min-h-[520px] w-full"
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater center={center} />

            <Marker
                position={[
                    center.latitude,
                    center.longitude,
                ]}
                icon={userLocationIcon}
            >
                <Popup>
                    Search center
                </Popup>
            </Marker>

            {cafes.map((cafe) => (
                <Marker
                    key={`${cafe.osm_type}-${cafe.osm_id}`}
                    position={[
                        cafe.latitude,
                        cafe.longitude,
                    ]}
                    icon={cafeIcon}
                >
                    <Popup>
                        <div className="min-w-[180px]">
                            <strong>{cafe.name}</strong>

                            <div style={{ marginTop: 6 }}>
                                {cafe.display_distance} away
                            </div>

                            {cafe.address && (
                                <div
                                    style={{
                                        marginTop: 4,
                                        opacity: 0.65,
                                    }}
                                >
                                    {cafe.address}
                                </div>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}


interface MapUpdaterProps {
    center: {
        latitude: number;
        longitude: number;
    };
}


function MapUpdater({
                        center,
                    }: MapUpdaterProps) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(
            [
                center.latitude,
                center.longitude,
            ],
            15,
            {
                duration: 1.2,
            }
        );
    }, [
        center.latitude,
        center.longitude,
        map,
    ]);

    return null;
}