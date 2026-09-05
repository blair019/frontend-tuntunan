import Link from "next/link";
import { SiteHeader } from "@/src/components/SiteHeaders";
import { BackgroundEffects } from "@/src/components/BackgroundEffects"

import {
    getRegisteredCafes,
    type RegisteredCafeApiResponse,
} from "@/src/features/cafes/api/registered-cafes.api";


export const dynamic = "force-dynamic";


export default async function RegisteredCafesPage() {
    let registeredCafes: RegisteredCafeApiResponse[] = [];

    let fetchError: string | null = null;


    try {
        registeredCafes =
            await getRegisteredCafes();
    } catch (error) {
        console.error(
            "Failed to load registered cafés:",
            error
        );

        fetchError =
            "We couldn't load the registered cafés right now.";
    }


    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white">
            <BackgroundEffects />

            <div className="relative z-10">
                <SiteHeader />

                <div className="mx-auto max-w-[1600px] px-5 pb-24 sm:px-8 lg:px-12">

                    {/* =====================================================
                        HERO
                    ===================================================== */}

                    <section className="border-b border-white/[0.08] pb-14 pt-16 lg:pb-20 lg:pt-24">

                        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">

                            <div>
                                <div className="flex items-center gap-3">

                                    <span className="h-2 w-2 rounded-full bg-[#b8ff65]" />

                                    <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
                                        Registered cafés
                                    </span>

                                </div>


                                <h1 className="mt-7 max-w-4xl text-[clamp(3.8rem,7vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.065em]">

                                    Cafés that

                                    <span className="block text-white/30">
                                        tell you more.
                                    </span>

                                </h1>
                            </div>


                            <div className="max-w-xl lg:justify-self-end">

                                <p className="text-base leading-7 text-white/45 sm:text-lg">

                                    Discover cafés that have registered
                                    directly with Tuntunan, with richer details
                                    about their space, amenities, and what kind
                                    of experience you can expect.

                                </p>


                                <Link
                                    href="/signup"
                                    className="group mt-7 inline-flex h-12 items-center gap-3 rounded-full bg-[#b8ff65] px-6 text-sm font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#c5ff7e]"
                                >

                                    Cafe Owner?

                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>

                                </Link>

                            </div>
                        </div>

                    </section>


                    {/* =====================================================
                        DIRECTORY
                    ===================================================== */}

                    <section className="pt-14 lg:pt-20">

                        <div className="mb-10 flex flex-col gap-7 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-end sm:justify-between">

                            <div>
                                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b8ff65]">
                                    Directory
                                </span>


                                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">

                                    {registeredCafes.length}{" "}

                                    {registeredCafes.length === 1
                                        ? "registered café"
                                        : "registered cafés"}

                                </h2>
                            </div>


                            <p className="max-w-sm text-sm leading-6 text-white/35">

                                These listings contain details submitted
                                directly by café owners.

                            </p>

                        </div>


                        {fetchError ? (
                            <DirectoryError
                                message={fetchError}
                            />
                        ) : registeredCafes.length === 0 ? (
                            <EmptyDirectory />
                        ) : (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                                {registeredCafes.map(
                                    (cafe) => (
                                        <RegisteredCafeCard
                                            key={cafe.id}
                                            cafe={cafe}
                                        />
                                    )
                                )}

                            </div>
                        )}

                    </section>

                </div>
            </div>
        </main>
    );
}


/* =========================================================
   REGISTERED CAFE CARD
========================================================= */

function RegisteredCafeCard({
                                cafe,
                            }: {
    cafe: RegisteredCafeApiResponse;
}) {
    const attributes =
        getCafeAttributes(cafe);


    const todayHours =
        getTodayOpeningHours(cafe);


    const image =
        getCafeImageUrl(
            cafe.cover_image_url
        );


    const locationLabel = [
        cafe.area,
        cafe.city,
    ]
        .filter(Boolean)
        .join(", ");


    return (
        <article className="group overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0e0e0e] transition duration-500 hover:-translate-y-1 hover:border-white/[0.16]">

            {/* =====================================================
                IMAGE
            ===================================================== */}

            <div className="relative h-[270px] overflow-hidden bg-[#111]">

                <img
                    src={image}
                    alt={cafe.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />


                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/20" />


                {/* REGISTERED BADGE */}

                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#b8ff65]/20 bg-black/65 px-3.5 py-2 text-[9px] font-medium uppercase tracking-[0.18em] text-[#b8ff65] backdrop-blur-xl">

                    <span className="h-1.5 w-1.5 rounded-full bg-[#b8ff65]" />

                    Registered

                </div>


                {/* LOCATION */}

                <div className="absolute bottom-5 left-5 right-5">

                    {cafe.area && (
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/45">
                            {cafe.area}
                        </p>
                    )}


                    <p className="mt-1 text-xs text-white/65">

                        {locationLabel ||
                            cafe.address}

                    </p>

                </div>

            </div>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div className="p-6 sm:p-7">

                <div className="flex items-start justify-between gap-5">

                    <div>

                        <h3 className="text-2xl font-semibold tracking-[-0.035em] transition duration-300 group-hover:text-[#b8ff65]">
                            {cafe.name}
                        </h3>


                        {cafe.description && (
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/40">

                                {cafe.description}

                            </p>
                        )}

                    </div>

                </div>


                {/* =====================================================
                    AMENITIES
                ===================================================== */}

                {attributes.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">

                        {attributes.map(
                            (attribute) => (
                                <span
                                    key={attribute}
                                    className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/45"
                                >
                                    {attribute}
                                </span>
                            )
                        )}

                    </div>
                )}


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <div className="mt-7 flex items-center justify-between gap-5 border-t border-white/[0.07] pt-5">

                    <div>

                        <p className="text-[9px] uppercase tracking-[0.17em] text-white/25">
                            Today
                        </p>


                        <p className="mt-1 text-xs text-white/55">
                            {todayHours}
                        </p>

                    </div>


                    <Link
                        href={`/cafes/${cafe.slug}`}
                        className="group/link inline-flex shrink-0 items-center gap-2 text-xs font-medium text-white/40 transition duration-300 hover:text-white"
                    >

                        View café

                        <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                            →
                        </span>

                    </Link>

                </div>

            </div>

        </article>
    );
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


    return attributes.slice(
        0,
        4
    );
}


/* =========================================================
   TODAY OPENING HOURS
========================================================= */

function getTodayOpeningHours(
    cafe: RegisteredCafeApiResponse
): string {
    const weekday =
        new Intl.DateTimeFormat(
            "en-US",
            {
                weekday:
                    "long",

                timeZone:
                    "Asia/Manila",
            }
        )
            .format(
                new Date()
            )
            .toLowerCase() as keyof typeof cafe.opening_hours;


    const hours =
        cafe.opening_hours[
            weekday
            ];


    if (!hours) {
        return "Hours unavailable";
    }


    if (!hours.enabled) {
        return "Closed";
    }


    if (
        hours.is_24_hours
    ) {
        return "Open 24 hours";
    }


    return `${formatTime(
        hours.open
    )} – ${formatTime(
        hours.close
    )}`;
}


/* =========================================================
   FORMAT TIME
========================================================= */

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
   EMPTY STATE
========================================================= */

function EmptyDirectory() {
    return (
        <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] px-6 py-20 text-center sm:px-10">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.1]">

                <span className="h-2 w-2 rounded-full bg-[#b8ff65]" />

            </div>


            <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">
                No registered cafés yet.
            </h3>


            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/35">

                Cafés registered directly
                with Tuntunan will appear
                here.

            </p>


            <Link
                href="/signup"
                className="mt-7 inline-flex h-11 items-center rounded-full border border-[#b8ff65]/25 px-5 text-xs font-semibold text-[#b8ff65] transition hover:bg-[#b8ff65] hover:text-black"
            >
                Register a café
            </Link>

        </div>
    );
}


/* =========================================================
   ERROR STATE
========================================================= */

function DirectoryError({
                            message,
                        }: {
    message: string;
}) {
    return (
        <div className="rounded-[30px] border border-red-400/15 bg-red-400/[0.04] px-6 py-16 text-center">

            <p className="text-sm text-red-200/70">
                {message}
            </p>

        </div>
    );
}

