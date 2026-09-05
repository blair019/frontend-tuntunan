"use client";

import dynamic from "next/dynamic";

import type { Cafe } from "@/src/features/cafes/types/cafe";


const DiscoveryMap = dynamic(
    () =>
        import(
            "@/src/features/cafes/components/DiscoveryMap"
            ).then(
            (module) =>
                module.DiscoveryMap
        ),
    {
        ssr: false,

        loading: () => (
            <div className="flex h-full min-h-[520px] items-center justify-center bg-[#0d0d0d]">
        <span className="text-[10px] uppercase tracking-[0.22em] text-white/25">
          Loading map...
        </span>
            </div>
        ),
    }
);


interface DiscoveryMapClientProps {
    cafes: Cafe[];

    center: {
        latitude: number;
        longitude: number;
    } | null;
}


export function DiscoveryMapClient({
                                       cafes,
                                       center,
                                   }: DiscoveryMapClientProps) {
    return (
        <DiscoveryMap
            cafes={cafes}
            center={center}
        />
    );
}