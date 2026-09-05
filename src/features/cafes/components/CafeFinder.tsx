"use client";

import {
    useMemo,
    useState,
} from "react";

import { SiteHeader } from "@/src/components/SiteHeaders";
import { BackgroundEffects } from "@/src/components/BackgroundEffects"

import { LocationSearch } from "@/src/features/cafes/components/LocationSearch";
import { DiscoveryMapClient } from "@/src/features/cafes/components/DiscoveryMapClient";
import { CafeGrid } from "@/src/features/cafes/components/CafeGrid";

import type { LocationSearchResult } from "@/src/features/cafes/types/location";

import type {
    Cafe,
    Coordinates,
} from "@/src/features/cafes/types/cafe";

import { getNearbyCafes } from "@/src/features/cafes/api/cafes.api";

import {
    getRegisteredCafes,
    type RegisteredCafeApiResponse,
} from "@/src/features/cafes/api/registered-cafes.api";

import { useGeolocation } from "@/src/features/cafes/hooks/useGeolocation";


const SEARCH_RADIUS_METERS = 3000;


export function CafeFinder() {
    const [cafes, setCafes] =
        useState<Cafe[]>([]);

    const [
        isLoadingCafes,
        setIsLoadingCafes,
    ] = useState(false);

    const [
        fetchError,
        setFetchError,
    ] = useState<string | null>(null);

    const [
        hasSearched,
        setHasSearched,
    ] = useState(false);

    const [
        selectedLocationName,
        setSelectedLocationName,
    ] = useState<string | null>(null);

    const [
        searchCenter,
        setSearchCenter,
    ] = useState<Coordinates | null>(
        null
    );

    const {
        coordinates,
        status: locationStatus,
        error: locationError,
        requestLocation,
    } = useGeolocation();

    const isLoading =
        locationStatus === "loading" ||
        isLoadingCafes;

    const nearestCafe = useMemo(
        () => cafes[0] ?? null,
        [cafes]
    );


    async function loadNearbyCafes(
        targetCoordinates: Coordinates
    ) {
        setFetchError(null);
        setHasSearched(false);
        setIsLoadingCafes(true);

        try {
            /*
             * OSM is the primary discovery source.
             *
             * Registered cafes are loaded separately so
             * a temporary failure in that endpoint does
             * not prevent normal discovery.
             */
            const [
                nearbyResponse,
                registeredResult,
            ] = await Promise.all([
                getNearbyCafes({
                    ...targetCoordinates,
                    radius:
                    SEARCH_RADIUS_METERS,
                }),

                getRegisteredCafes()
                    .then((data) => ({
                        success: true as const,
                        data,
                    }))
                    .catch(() => ({
                        success: false as const,
                        data: [],
                    })),
            ]);

            const osmCafes =
                nearbyResponse.cafes;

            const registeredCafes =
                registeredResult.success
                    ? registeredResult.data
                        .map(
                            (
                                registeredCafe
                            ) =>
                                convertRegisteredCafe(
                                    registeredCafe,
                                    targetCoordinates
                                )
                        )
                        .filter(
                            (
                                cafe
                            ): cafe is Cafe =>
                                cafe !== null
                        )
                        .filter(
                            (cafe) =>
                                cafe.distance_meters <=
                                SEARCH_RADIUS_METERS
                        )
                    : [];

            const mergedCafes =
                mergeCafeSources(
                    osmCafes,
                    registeredCafes
                );

            setCafes(mergedCafes);
            setHasSearched(true);
        } catch (error) {
            setCafes([]);

            setFetchError(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."
            );
        } finally {
            setIsLoadingCafes(false);
        }
    }


    async function handleUseMyLocation() {
        setSelectedLocationName(
            "Current location"
        );

        setFetchError(null);

        try {
            const currentCoordinates =
                await requestLocation();

            setSearchCenter(
                currentCoordinates
            );

            await loadNearbyCafes(
                currentCoordinates
            );
        } catch {
            /*
             * Geolocation-specific errors
             * are handled by useGeolocation.
             */
        }
    }


    async function handleLocationSelect(
        location: LocationSearchResult
    ) {
        setSelectedLocationName(
            location.name
        );

        const targetCoordinates: Coordinates =
            {
                latitude:
                location.latitude,

                longitude:
                location.longitude,
            };

        setSearchCenter(
            targetCoordinates
        );

        await loadNearbyCafes(
            targetCoordinates
        );
    }


    const error =
        locationError ?? fetchError;


    return (
        <div className="relative min-h-screen overflow-hidden bg-[#080808]">
            <BackgroundEffects />

            <div className="relative z-10">
                <SiteHeader />

                <div className="mx-auto max-w-[1600px] px-5 pb-20 sm:px-8 lg:px-12">
                    <section className="grid min-h-[640px] items-center gap-16 border-b border-white/[0.08] py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
                        <div>
                            <div className="mb-8 flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-[#b8ff65]" />

                                <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/45">
                                    Discover places
                                    around you
                                </span>
                            </div>

                            <h1 className="max-w-[850px] text-[clamp(4rem,8vw,8.7rem)] font-semibold leading-[0.84] tracking-[-0.07em]">
                                Find your

                                <span className="block text-white/35">
                                    next place.
                                </span>
                            </h1>

                            <div className="mt-10 max-w-2xl">
                                <p className="max-w-xl text-base leading-7 text-white/45 sm:text-lg">
                                    Search
                                    neighborhoods,
                                    landmarks and
                                    cities, or let
                                    Tuntunan discover
                                    cafés around your
                                    current location.
                                </p>

                                <div className="mt-8">
                                    <LocationSearch
                                        onSelect={
                                            handleLocationSelect
                                        }
                                        disabled={
                                            isLoading
                                        }
                                    />
                                </div>

                                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <button
                                        type="button"
                                        onClick={
                                            handleUseMyLocation
                                        }
                                        disabled={
                                            isLoading
                                        }
                                        className="group inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-full bg-[#b8ff65] px-7 text-sm font-semibold text-black transition duration-300 hover:scale-[1.02] hover:bg-[#c5ff7e] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <span>
                                            {isLoading
                                                ? "Finding places..."
                                                : "Use my location"}
                                        </span>

                                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </button>

                                    {selectedLocationName && (
                                        <div className="flex items-center gap-2 text-sm text-white/40">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />

                                            <span>
                                                Exploring{" "}

                                                <strong className="font-medium text-white/75">
                                                    {
                                                        selectedLocationName
                                                    }
                                                </strong>
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {coordinates &&
                                    selectedLocationName ===
                                    "Current location" && (
                                        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-white/25">
                                            {coordinates.latitude.toFixed(
                                                5
                                            )}{" "}
                                            /{" "}
                                            {coordinates.longitude.toFixed(
                                                5
                                            )}
                                        </p>
                                    )}

                                {error && (
                                    <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-sm text-red-200">
                                        {
                                            error
                                        }
                                    </div>
                                )}
                            </div>
                        </div>

                        <DiscoveryVisual
                            cafeCount={
                                cafes.length
                            }
                            nearestCafe={
                                nearestCafe
                            }
                            locationName={
                                selectedLocationName
                            }
                            isLoading={
                                isLoading
                            }
                            cafes={cafes}
                            center={
                                searchCenter
                            }
                        />
                    </section>

                    <section className="pt-14 lg:pt-20">
                        {hasSearched ? (
                            <CafeGrid
                                cafes={cafes}
                                locationName={
                                    selectedLocationName
                                }
                            />
                        ) : (
                            <EmptyDiscoveryState />
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}


/*
 * =========================================================
 * REGISTERED CAFE NORMALIZATION
 * =========================================================
 */

function convertRegisteredCafe(
    registeredCafe: RegisteredCafeApiResponse,
    searchCenter: Coordinates
): Cafe | null {
    if (
        registeredCafe.latitude === null ||
        registeredCafe.longitude === null
    ) {
        return null;
    }

    const distanceMeters =
        calculateDistanceMeters(
            searchCenter.latitude,
            searchCenter.longitude,
            registeredCafe.latitude,
            registeredCafe.longitude
        );

    const distanceKm =
        distanceMeters / 1000;

    return {
        /*
         * Synthetic OSM-compatible identifiers.
         *
         * Existing grid/map code can continue
         * using osm_id and osm_type.
         */
        osm_id:
            -Math.abs(
                registeredCafe.id
            ),

        osm_type: "registered",

        name:
        registeredCafe.name,

        latitude:
        registeredCafe.latitude,

        longitude:
        registeredCafe.longitude,

        distance_meters:
        distanceMeters,

        distance_km:
        distanceKm,

        display_distance:
            formatDistance(
                distanceMeters
            ),

        address:
        registeredCafe.address,

        phone: null,

        website:
        registeredCafe.website,

        facebook: null,

        instagram:
        registeredCafe.instagram,

        has_contact_info:
            Boolean(
                registeredCafe.website ||
                registeredCafe.instagram
            ),

        opening_hours:
            formatOpeningHours(
                registeredCafe
            ),

        cuisine: null,

        wifi:
        registeredCafe.amenities
            .wifi,

        outdoor_seating:
        registeredCafe.amenities
            .outdoor_seating,

        wheelchair:
            registeredCafe.amenities
                .wheelchair_accessible
                ? "yes"
                : null,

        takeaway: null,
        delivery: null,

        source: "registered",

        registered_id:
        registeredCafe.id,

        slug:
        registeredCafe.slug,

        city:
        registeredCafe.city,

        area:
        registeredCafe.area,

        description:
        registeredCafe.description,

        cover_image_url:
        registeredCafe.cover_image_url,

        gallery_image_urls:
        registeredCafe.gallery_image_urls,

        outlets:
        registeredCafe.amenities
            .outlets,

        work_friendly:
        registeredCafe.amenities
            .work_friendly,

        pet_friendly:
        registeredCafe.amenities
            .pet_friendly,

        wheelchair_accessible:
        registeredCafe.amenities
            .wheelchair_accessible,
    };
}


/*
 * =========================================================
 * MERGE SOURCES
 * =========================================================
 */

function mergeCafeSources(
    osmCafes: Cafe[],
    registeredCafes: Cafe[]
): Cafe[] {
    /*
     * If a registered cafe appears to be the
     * same establishment as an OSM result,
     * prefer the registered Tuntunan record.
     *
     * We compare:
     * - normalized cafe name
     * - physical distance under 100m
     */

    const filteredOsmCafes =
        osmCafes.filter(
            (osmCafe) => {
                return !registeredCafes.some(
                    (
                        registeredCafe
                    ) => {
                        const sameName =
                            normalizeCafeName(
                                osmCafe.name
                            ) ===
                            normalizeCafeName(
                                registeredCafe.name
                            );

                        if (!sameName) {
                            return false;
                        }

                        const separation =
                            calculateDistanceMeters(
                                osmCafe.latitude,
                                osmCafe.longitude,
                                registeredCafe.latitude,
                                registeredCafe.longitude
                            );

                        return (
                            separation <= 100
                        );
                    }
                );
            }
        );

    return [
        ...filteredOsmCafes,
        ...registeredCafes,
    ].sort(
        (a, b) =>
            a.distance_meters -
            b.distance_meters
    );
}


function normalizeCafeName(
    name: string
): string {
    return name
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            ""
        );
}


/*
 * =========================================================
 * DISTANCE
 * =========================================================
 */

function calculateDistanceMeters(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number
): number {
    const EARTH_RADIUS_METERS =
        6371000;

    const lat1 =
        degreesToRadians(
            latitude1
        );

    const lat2 =
        degreesToRadians(
            latitude2
        );

    const deltaLatitude =
        degreesToRadians(
            latitude2 - latitude1
        );

    const deltaLongitude =
        degreesToRadians(
            longitude2 - longitude1
        );

    const a =
        Math.sin(
            deltaLatitude / 2
        ) **
        2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(
            deltaLongitude / 2
        ) **
        2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return Math.round(
        EARTH_RADIUS_METERS * c
    );
}


function degreesToRadians(
    degrees: number
): number {
    return (
        degrees *
        (Math.PI / 180)
    );
}


function formatDistance(
    distanceMeters: number
): string {
    if (distanceMeters < 1000) {
        return `${Math.round(
            distanceMeters
        )} m`;
    }

    return `${(
        distanceMeters / 1000
    ).toFixed(1)} km`;
}


/*
 * =========================================================
 * OPENING HOURS
 * =========================================================
 */

function formatOpeningHours(
    cafe: RegisteredCafeApiResponse
): string | null {
    const today =
        new Intl.DateTimeFormat(
            "en-US",
            {
                weekday: "long",
            }
        )
            .format(new Date())
            .toLowerCase();

    const hours =
        cafe.opening_hours[
            today as keyof typeof cafe.opening_hours
            ];

    if (!hours) {
        return null;
    }

    if (!hours.enabled) {
        return "Closed";
    }

    if (hours.is_24_hours) {
        return "Open 24 hours";
    }

    return `${hours.open} - ${hours.close}`;
}



/*
 * =========================================================
 * DISCOVERY VISUAL
 * =========================================================
 */

interface DiscoveryVisualProps {
    cafeCount: number;

    nearestCafe: Cafe | null;

    locationName: string | null;

    isLoading: boolean;

    cafes: Cafe[];

    center: Coordinates | null;
}


function DiscoveryVisual({
                             cafeCount,
                             nearestCafe,
                             locationName,
                             isLoading,
                             cafes,
                             center,
                         }: DiscoveryVisualProps) {
    return (
        <div className="relative mx-auto w-full max-w-[680px]">
            <div className="relative aspect-[1.06/1] overflow-hidden rounded-[36px] border border-white/[0.09] bg-[#101010]">
                {!center && (
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src="/images/bg-cafe-finder.png"
                            alt=""
                            className="h-full w-full scale-[1.02] object-cover opacity-80"
                        />

                        <div className="absolute inset-0 bg-black/25" />

                        <div className="absolute inset-0 bg-[#b8ff65]/[0.015]" />

                        <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-black/70 via-black/25 to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black via-black/55 to-transparent" />

                        <div className="absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-black/45 to-transparent" />

                        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_center,white_0.8px,transparent_0.8px)] [background-size:16px_16px]" />
                    </div>
                )}

                {center && (
                    <div className="absolute inset-0">
                        <DiscoveryMapClient
                            cafes={cafes}
                            center={center}
                        />
                    </div>
                )}

                {center && (
                    <>
                        <div className="pointer-events-none absolute inset-x-0 top-0 z-[400] h-36 bg-gradient-to-b from-black/75 via-black/30 to-transparent" />

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[400] h-60 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    </>
                )}

                <div className="absolute left-6 top-6 z-[500] rounded-full border border-white/10 bg-black/65 px-4 py-2 shadow-lg backdrop-blur-xl">
                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/55">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#b8ff65]" />

                        Live discovery
                    </span>
                </div>

                {cafeCount > 0 &&
                    center && (
                        <div className="absolute right-6 top-6 z-[500] rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-lg">
                            {cafeCount} places
                        </div>
                    )}

                {locationName &&
                    center && (
                        <div className="absolute left-6 top-20 z-[500] max-w-[65%] truncate rounded-full border border-white/[0.06] bg-black/50 px-3 py-2 text-[11px] text-white/50 backdrop-blur-xl">
                            {
                                locationName
                            }
                        </div>
                    )}

                {!center &&
                    !isLoading && (
                        <div className="pointer-events-none absolute inset-0 z-[450] flex items-center justify-center px-10 pb-24 text-center">
                            <div>
                                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-lg">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#b8ff65] shadow-[0_0_25px_rgba(184,255,101,0.45)]" />
                                </div>

                                <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-white/40">
                                    Somewhere is
                                    waiting
                                </p>

                                <p className="mx-auto mt-3 max-w-[300px] text-sm leading-6 text-white/55">
                                    Search a
                                    location or
                                    use your
                                    current
                                    location.
                                </p>
                            </div>
                        </div>
                    )}

                <div className="absolute bottom-6 left-6 right-6 z-[500] rounded-[26px] border border-white/10 bg-black/75 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-6">
                    {isLoading ? (
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#b8ff65]">
                                Searching
                            </p>

                            <p className="mt-3 text-xl font-medium text-white/80">
                                Looking around
                                the area...
                            </p>
                        </div>
                    ) : nearestCafe ? (
                        <div className="flex items-end justify-between gap-6">
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-[0.22em] text-[#b8ff65]">
                                    Closest
                                    discovery
                                </p>

                                <h2 className="mt-2 truncate text-2xl font-semibold tracking-[-0.03em]">
                                    {
                                        nearestCafe.name
                                    }
                                </h2>

                                <p className="mt-2 truncate text-sm text-white/40">
                                    {nearestCafe.address ??
                                        "Location details unavailable"}
                                </p>
                            </div>

                            <div className="shrink-0 text-right">
                                <div className="text-3xl font-semibold tracking-[-0.05em]">
                                    {
                                        nearestCafe.display_distance
                                    }
                                </div>

                                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/30">
                                    away
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">
                                Ready to
                                explore
                            </p>

                            <h2 className="mt-3 max-w-sm text-2xl font-semibold leading-tight tracking-[-0.03em]">
                                Find somewhere
                                worth going.
                            </h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


/*
 * =========================================================
 * EMPTY DISCOVERY STATE
 * =========================================================
 */

function EmptyDiscoveryState() {
    return (
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
                <span className="text-[10px] uppercase tracking-[0.24em] text-white/30">
                    Discovery
                </span>

                <h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                    Start somewhere.

                    <span className="block text-white/30">
                        We&apos;ll find
                        what&apos;s nearby.
                    </span>
                </h2>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
                {[
                    {
                        number: "01",
                        title:
                            "Search anywhere",
                        icon: SearchIcon,
                    },
                    {
                        number: "02",
                        title:
                            "Use your location",
                        icon: LocationIcon,
                    },
                    {
                        number: "03",
                        title:
                            "Explore nearby",
                        icon: CompassIcon,
                    },
                ].map(
                    ({
                         number,
                         title,
                         icon: Icon,
                     }) => (
                        <div
                            key={number}
                            className="group relative min-h-[220px] overflow-hidden bg-[#0d0d0d] p-7 transition duration-300 hover:bg-[#111111]"
                        >
                            <span className="font-mono text-[10px] text-white/20">
                                {
                                    number
                                }
                            </span>

                            <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-white/35 transition duration-300 group-hover:border-[#b8ff65]/25 group-hover:bg-[#b8ff65]/[0.07] group-hover:text-[#b8ff65]">
                                <Icon />
                            </div>

                            <p className="mt-8 text-lg font-medium tracking-[-0.02em] text-white/90 transition duration-300 group-hover:text-white">
                                {
                                    title
                                }
                            </p>

                            <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#b8ff65]/0 blur-[70px] transition duration-500 group-hover:bg-[#b8ff65]/[0.04]" />
                        </div>
                    )
                )}
            </div>
        </div>
    );
}


function SearchIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle
                cx="11"
                cy="11"
                r="6.5"
            />

            <path d="M16 16L21 21" />
        </svg>
    );
}


function LocationIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="7"
            />

            <circle
                cx="12"
                cy="12"
                r="2.5"
            />

            <path d="M12 2V5" />
            <path d="M12 19V22" />
            <path d="M2 12H5" />
            <path d="M19 12H22" />
        </svg>
    );
}


function CompassIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="8.5"
            />

            <path d="M15.5 8.5L13.5 13.5L8.5 15.5L10.5 10.5L15.5 8.5Z" />
        </svg>
    );
}


