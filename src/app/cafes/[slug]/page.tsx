import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/src/components/SiteHeaders";
import { SiteFooter } from "@/src/components/SiteFooter"
import { BackgroundEffects } from "@/src/components/BackgroundEffects"

import {
    getRegisteredCafe,
    type RegisteredCafeApiResponse,
} from "@/src/features/cafes/api/registered-cafes.api";


export const dynamic = "force-dynamic";


interface CafePageProps {
    params: Promise<{
        slug: string;
    }>;
}


export default async function CafePage({
                                           params,
                                       }: CafePageProps) {
    const { slug } = await params;

    let cafe: RegisteredCafeApiResponse;

    try {
        cafe =
            await getRegisteredCafe(
                slug
            );
    } catch {
        notFound();
    }


    const coverImage =
        getCafeImageUrl(
            cafe.cover_image_url
        );


    const galleryImages =
        cafe.gallery_image_urls.map(
            (image) =>
                getCafeImageUrl(
                    image
                )
        );


    const attributes =
        getCafeAttributes(
            cafe
        );


    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white">
            <BackgroundEffects />

            <div className="relative z-10">

                <SiteHeader />


                {/* =====================================================
                    HERO
                ===================================================== */}

                <section>
                    <div className="mx-auto max-w-[1600px] px-5 pb-14 pt-10 sm:px-8 lg:px-12 lg:pb-20 lg:pt-16">

                        <Link
                            href="/cafes"
                            className="group inline-flex items-center gap-2 text-xs text-white/35 transition hover:text-white"
                        >
                            <span className="transition-transform group-hover:-translate-x-1">
                                ←
                            </span>

                            Registered cafés
                        </Link>


                        <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">

                            {/* =================================================
                                COVER
                            ================================================= */}

                            <div className="relative min-h-[520px] overflow-hidden rounded-[36px] border border-white/[0.08] bg-[#111] lg:min-h-[680px]">

                                <img
                                    src={coverImage}
                                    alt={cafe.name}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />


                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/10" />


                                <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-[#b8ff65]/20 bg-black/60 px-4 py-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[#b8ff65] backdrop-blur-xl">

                                    <span className="h-1.5 w-1.5 rounded-full bg-[#b8ff65]" />

                                    Registered

                                </div>


                                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10">

                                    <div className="flex flex-wrap items-center gap-3">

                                        {cafe.area && (
                                            <span className="text-[9px] uppercase tracking-[0.2em] text-white/45">
                                                {cafe.area}
                                            </span>
                                        )}


                                        {cafe.area && (
                                            <span className="h-1 w-1 rounded-full bg-white/25" />
                                        )}


                                        <span className="text-[9px] uppercase tracking-[0.2em] text-white/45">
                                            {cafe.city}
                                        </span>

                                    </div>


                                    <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-7xl">
                                        {cafe.name}
                                    </h1>

                                </div>

                            </div>


                            {/* =================================================
                                INFO
                            ================================================= */}

                            <div className="flex flex-col">

                                <div className="rounded-[34px] border border-white/[0.08] bg-[#0d0d0d] p-7 sm:p-9">

                                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#b8ff65]">
                                        About this café
                                    </p>


                                    {cafe.description ? (
                                        <p className="mt-6 text-xl leading-8 tracking-[-0.015em] text-white/68">
                                            {cafe.description}
                                        </p>
                                    ) : (
                                        <p className="mt-6 text-base leading-7 text-white/30">
                                            No description has been added yet.
                                        </p>
                                    )}


                                    {attributes.length >
                                        0 && (
                                            <div className="mt-8 flex flex-wrap gap-2">

                                                {attributes.map(
                                                    (
                                                        attribute
                                                    ) => (
                                                        <span
                                                            key={
                                                                attribute
                                                            }
                                                            className="rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-[10px] text-white/50"
                                                        >
                                                        {
                                                            attribute
                                                        }
                                                    </span>
                                                    )
                                                )}

                                            </div>
                                        )}


                                    <div className="mt-9 border-t border-white/[0.07] pt-7">

                                        <p className="text-[9px] uppercase tracking-[0.19em] text-white/25">
                                            Address
                                        </p>


                                        <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
                                            {cafe.address}
                                        </p>

                                    </div>

                                </div>


                                {/* =============================================
                                    HOURS
                                ============================================= */}

                                <div className="mt-5 flex-1 rounded-[34px] border border-white/[0.08] bg-[#0d0d0d] p-7 sm:p-9">

                                    <div className="flex items-center justify-between gap-5">

                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b8ff65]">
                                                Opening hours
                                            </p>

                                            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                                                When to visit.
                                            </h2>
                                        </div>


                                        <span className="h-2 w-2 rounded-full bg-[#b8ff65]" />

                                    </div>


                                    <div className="mt-8">

                                        {Object.entries(
                                            cafe.opening_hours
                                        ).map(
                                            ([
                                                 day,
                                                 hours,
                                             ]) => (
                                                <OpeningHoursRow
                                                    key={
                                                        day
                                                    }
                                                    day={
                                                        day
                                                    }
                                                    hours={
                                                        hours
                                                    }
                                                />
                                            )
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </section>


                {/* =====================================================
                    DETAILS
                ===================================================== */}

                <section className="border-t border-white/[0.08]">
                    <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.6fr_1.4fr] lg:px-12 lg:py-28">

                        <div>

                            <span className="text-[10px] uppercase tracking-[0.24em] text-[#b8ff65]">
                                The details
                            </span>


                            <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-5xl">
                                Know before you go.
                            </h2>

                        </div>


                        <div className="grid gap-px overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">

                            <DetailCard
                                label="Wi-Fi"
                                value={
                                    cafe.amenities
                                        .wifi
                                        ? "Available"
                                        : "Not listed"
                                }
                            />


                            <DetailCard
                                label="Power outlets"
                                value={
                                    cafe.amenities
                                        .outlets
                                        ? "Available"
                                        : "Not listed"
                                }
                            />


                            <DetailCard
                                label="Work friendly"
                                value={
                                    cafe.amenities
                                        .work_friendly
                                        ? "Yes"
                                        : "Not listed"
                                }
                            />


                            <DetailCard
                                label="Outdoor seating"
                                value={
                                    cafe.amenities
                                        .outdoor_seating
                                        ? "Available"
                                        : "Not listed"
                                }
                            />


                            <DetailCard
                                label="Pet friendly"
                                value={
                                    cafe.amenities
                                        .pet_friendly
                                        ? "Yes"
                                        : "Not listed"
                                }
                            />


                            <DetailCard
                                label="Wheelchair access"
                                value={
                                    cafe.amenities
                                        .wheelchair_accessible
                                        ? "Accessible"
                                        : "Not listed"
                                }
                            />

                        </div>

                    </div>
                </section>


                {/* =====================================================
                    GALLERY
                ===================================================== */}

                {galleryImages.length >
                    0 && (
                        <section className="border-t border-white/[0.08]">

                            <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">

                                <div className="mb-10">

                                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b8ff65]">
                                    Gallery
                                </span>


                                    <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                                        Inside {cafe.name}.
                                    </h2>

                                </div>


                                <div className="grid gap-4 md:grid-cols-2">

                                    {galleryImages.map(
                                        (
                                            image,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    image
                                                }
                                                className={[
                                                    "overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#111]",
                                                    index ===
                                                    0
                                                        ? "md:col-span-2"
                                                        : "",
                                                ].join(
                                                    " "
                                                )}
                                            >
                                                <div
                                                    className={
                                                        index ===
                                                        0
                                                            ? "aspect-[16/7]"
                                                            : "aspect-[4/3]"
                                                    }
                                                >
                                                    <img
                                                        src={
                                                            image
                                                        }
                                                        alt={`${cafe.name} gallery ${index + 1}`}
                                                        className="h-full w-full object-cover transition duration-700 hover:scale-[1.025]"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}

                                </div>

                            </div>

                        </section>
                    )}


                {/* =====================================================
                    LINKS
                ===================================================== */}

                {(cafe.instagram ||
                    cafe.website) && (
                    <section className="border-t border-white/[0.08]">

                        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12">

                            <div className="flex flex-col gap-7 rounded-[30px] border border-white/[0.08] bg-[#0d0d0d] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">

                                <div>

                                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#b8ff65]">
                                        Find out more
                                    </p>


                                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">
                                        Visit {cafe.name} online.
                                    </h2>

                                </div>


                                <div className="flex flex-wrap gap-3">

                                    {cafe.instagram && (
                                        <a
                                            href={
                                                normalizeInstagramUrl(
                                                    cafe.instagram
                                                )
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex h-11 items-center rounded-full border border-white/[0.1] px-5 text-xs text-white/50 transition hover:border-white/25 hover:text-white"
                                        >
                                            Instagram
                                        </a>
                                    )}


                                    {cafe.website && (
                                        <a
                                            href={
                                                cafe.website
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex h-11 items-center rounded-full bg-[#b8ff65] px-5 text-xs font-semibold text-black transition hover:bg-[#c5ff7e]"
                                        >
                                            Website →
                                        </a>
                                    )}

                                </div>

                            </div>

                        </div>

                    </section>
                )}


                <SiteFooter />

            </div>
        </main>
    );
}


/* =========================================================
   OPENING HOURS
========================================================= */

interface DayHours {
    enabled: boolean;
    open: string;
    close: string;
    is_24_hours: boolean;
}


function OpeningHoursRow({
                             day,
                             hours,
                         }: {
    day: string;
    hours: DayHours;
}) {
    return (
        <div className="flex items-center justify-between gap-5 border-b border-white/[0.06] py-3.5 last:border-b-0">

            <span className="text-xs capitalize text-white/35">
                {day}
            </span>


            <span
                className={[
                    "text-xs",
                    hours.enabled
                        ? "text-white/65"
                        : "text-white/20",
                ].join(" ")}
            >
                {formatDayHours(
                    hours
                )}
            </span>

        </div>
    );
}


function formatDayHours(
    hours: DayHours
): string {
    if (!hours.enabled) {
        return "Closed";
    }


    if (hours.is_24_hours) {
        return "Open 24 hours";
    }


    return `${formatTime(
        hours.open
    )} – ${formatTime(
        hours.close
    )}`;
}


function formatTime(
    value: string
): string {
    const [
        hourString,
        minuteString,
    ] =
        value.split(
            ":"
        );


    const hour =
        Number(
            hourString
        );


    const minute =
        Number(
            minuteString
        );


    if (
        Number.isNaN(
            hour
        ) ||
        Number.isNaN(
            minute
        )
    ) {
        return value;
    }


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    const displayHour =
        hour % 12 || 12;


    return `${displayHour}:${String(
        minute
    ).padStart(
        2,
        "0"
    )} ${period}`;
}


/* =========================================================
   DETAIL CARD
========================================================= */

function DetailCard({
                        label,
                        value,
                    }: {
    label: string;
    value: string;
}) {
    return (
        <div className="group min-h-[190px] bg-[#0d0d0d] p-7 transition hover:bg-[#111] sm:p-8">

            <p className="text-[9px] uppercase tracking-[0.19em] text-white/22">
                {label}
            </p>


            <div className="mt-14 flex items-end justify-between gap-5">

                <p className="text-2xl font-semibold tracking-[-0.035em] transition group-hover:text-[#b8ff65]">
                    {value}
                </p>


                <span className="h-2 w-2 rounded-full bg-[#b8ff65]" />

            </div>

        </div>
    );
}


/* =========================================================
   ATTRIBUTES
========================================================= */

function getCafeAttributes(
    cafe: RegisteredCafeApiResponse
): string[] {
    const attributes: string[] = [];


    if (cafe.amenities.wifi) {
        attributes.push(
            "Wi-Fi"
        );
    }


    if (cafe.amenities.outlets) {
        attributes.push(
            "Outlets"
        );
    }


    if (
        cafe.amenities
            .work_friendly
    ) {
        attributes.push(
            "Work friendly"
        );
    }


    if (
        cafe.amenities
            .outdoor_seating
    ) {
        attributes.push(
            "Outdoor"
        );
    }


    if (
        cafe.amenities
            .pet_friendly
    ) {
        attributes.push(
            "Pet friendly"
        );
    }


    if (
        cafe.amenities
            .wheelchair_accessible
    ) {
        attributes.push(
            "Accessible"
        );
    }


    return attributes;
}


/* =========================================================
   IMAGE URL
========================================================= */

function getCafeImageUrl(
    path: string | null
): string {
    if (!path) {
        return "/images/bg-cafe-finder.png";
    }


    if (
        path.startsWith(
            "http://"
        ) ||
        path.startsWith(
            "https://"
        )
    ) {
        return path;
    }


    const API_URL =
        process.env
            .NEXT_PUBLIC_API_URL;


    if (!API_URL) {
        return "/images/bg-cafe-finder.png";
    }


    const normalizedApiUrl =
        API_URL.endsWith("/")
            ? API_URL.slice(
                0,
                -1
            )
            : API_URL;


    const normalizedPath =
        path.startsWith("/")
            ? path
            : `/${path}`;


    return `${normalizedApiUrl}${normalizedPath}`;
}


/* =========================================================
   INSTAGRAM
========================================================= */

function normalizeInstagramUrl(
    value: string
): string {
    if (
        value.startsWith(
            "http://"
        ) ||
        value.startsWith(
            "https://"
        )
    ) {
        return value;
    }


    const username =
        value
            .replace(
                "@",
                ""
            )
            .trim();


    return `https://www.instagram.com/${username}/`;
}


