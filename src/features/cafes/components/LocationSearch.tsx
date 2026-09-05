"use client";

import { useState } from "react";

import { useLocationSearch } from "../hooks/useLocationSearch";
import type { LocationSearchResult } from "../types/location";

interface LocationSearchProps {
    onSelect: (location: LocationSearchResult) => void;
    disabled?: boolean;
}

export function LocationSearch({
                                   onSelect,
                                   disabled = false,
                               }: LocationSearchProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const {
        results,
        isLoading,
        error,
    } = useLocationSearch(query);

    function handleSelect(
        location: LocationSearchResult
    ) {
        setQuery(location.name);
        setIsOpen(false);

        onSelect(location);
    }

    return (
        <div className="relative w-full">
            <label
                htmlFor="location-search"
                className="sr-only"
            >
                Search location
            </label>

            <div className="group relative">
                <div className="absolute left-6 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-white/30 transition group-focus-within:border-[#b8ff65] group-focus-within:bg-[#b8ff65]" />

                <input
                    id="location-search"
                    type="search"
                    value={query}
                    disabled={disabled}
                    placeholder="Search neighborhood, city or landmark"
                    autoComplete="off"
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (query.trim().length >= 2) {
                            setIsOpen(true);
                        }
                    }}
                    className="h-[68px] w-full rounded-[22px] border border-white/10 bg-white/[0.045] pl-12 pr-20 text-[15px] text-white outline-none transition duration-300 placeholder:text-white/25 hover:border-white/20 focus:border-[#b8ff65]/40 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                />

                <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/25">
                    Search
                </div>
            </div>

            {isLoading && (
                <div className="absolute right-5 top-[78px] z-30 text-[10px] uppercase tracking-[0.15em] text-white/30">
                    Searching...
                </div>
            )}

            {error && (
                <p className="mt-3 text-xs text-red-300">
                    {error}
                </p>
            )}

            {isOpen && results.length > 0 && (
                <div className="absolute left-0 right-0 z-40 mt-3 overflow-hidden rounded-[24px] border border-white/10 bg-[#111111]/95 p-2 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
                    {results.map((location, index) => (
                        <button
                            key={`${location.osm_type}-${location.osm_id}-${location.place_id}`}
                            type="button"
                            onClick={() => handleSelect(location)}
                            className="group flex w-full items-start gap-4 rounded-[18px] px-4 py-4 text-left transition hover:bg-white/[0.06]"
                        >
              <span className="mt-0.5 font-mono text-[10px] text-white/20">
                {String(index + 1).padStart(2, "0")}
              </span>

                            <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-white">
                  {location.name}
                </span>

                                <span className="mt-1 block truncate text-xs text-white/35">
                  {location.display_name}
                </span>
                            </div>

                            <span className="text-sm text-white/20 transition group-hover:translate-x-1 group-hover:text-[#b8ff65]">
                →
              </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}