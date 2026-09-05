import type { Cafe } from "../types/cafe";

import { CafeCard } from "./CafeCard";

interface CafeGridProps {
    cafes: Cafe[];
    locationName?: string | null;
}

const MAX_VISIBLE_RESULTS = 18;

export function CafeGrid({
                             cafes,
                             locationName,
                         }: CafeGridProps) {
    if (cafes.length === 0) {
        return (
            <div className="rounded-[32px] border border-white/[0.08] bg-white/[0.025] px-8 py-20 text-center">
                <p className="text-sm text-white/35">
                    No cafés found in this area.
                </p>
            </div>
        );
    }

    const visibleCafes = cafes.slice(
        0,
        MAX_VISIBLE_RESULTS
    );

    return (
        <div>
            <div className="mb-10 flex flex-col justify-between gap-8 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-end">
                <div>
                    <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#b8ff65]">
              Nearby discoveries
            </span>

                        <span className="h-px w-10 bg-white/15" />
                    </div>

                    <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                        {cafes.length} places
                        <span className="text-white/25"> found.</span>
                    </h2>

                    {locationName && (
                        <p className="mt-3 text-sm text-white/35">
                            Around {locationName}
                        </p>
                    )}
                </div>

                <div className="flex gap-7 text-right">
                    <div>
            <span className="block text-2xl font-medium tracking-[-0.04em]">
              {cafes[0]?.display_distance}
            </span>

                        <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-white/25">
              Closest
            </span>
                    </div>

                    <div>
            <span className="block text-2xl font-medium tracking-[-0.04em]">
              {visibleCafes.length}
            </span>

                        <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-white/25">
              Showing
            </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleCafes.map((cafe, index) => (
                    <CafeCard
                        key={`${cafe.osm_type}-${cafe.osm_id}`}
                        cafe={cafe}
                        index={index}
                        featured={index === 0}
                    />
                ))}
            </div>

            {cafes.length > MAX_VISIBLE_RESULTS && (
                <div className="mt-10 flex items-center justify-between border-t border-white/[0.08] pt-6 text-xs text-white/30">
          <span>
            Showing {MAX_VISIBLE_RESULTS} of{" "}
              {cafes.length} results
          </span>

                    <span>
            More discovery controls coming next
          </span>
                </div>
            )}
        </div>
    );
}