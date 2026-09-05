import Link from "next/link";
import { SiteHeader } from "@/src/components/SiteHeaders";
import { SiteFooter } from "@/src/components/SiteFooter"
import { BackgroundEffects } from "@/src/components/BackgroundEffects"


export default function AboutPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white">
            <BackgroundEffects />

            <div className="relative z-10">
                <SiteHeader />

                {/* =====================================================
                    HERO
                ===================================================== */}

                <section className="border-b border-white/[0.08]">
                    <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-16 sm:px-8 lg:px-12 lg:pb-24 lg:pt-24">

                        <div className="grid items-end gap-14 lg:grid-cols-[0.92fr_1.08fr]">

                            <div className="relative z-10">

                                <div className="mb-8 flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-[#b8ff65]" />

                                    <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
                                        About Tuntunan
                                    </span>
                                </div>


                                <h1 className="max-w-[850px] text-[clamp(4rem,7.7vw,8.6rem)] font-semibold leading-[0.83] tracking-[-0.075em]">
                                    Find the café

                                    <span className="block text-white/28">
                                        you actually need.
                                    </span>
                                </h1>


                                <p className="mt-9 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
                                    Tuntunan was created from a love for cafés
                                    and the frustration of trying to find one
                                    that actually fits what you need in the
                                    moment.
                                </p>


                                <div className="mt-8 flex flex-wrap gap-3">

                                    <Link
                                        href="/"
                                        className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#b8ff65] px-6 text-sm font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#c5ff7e]"
                                    >
                                        Explore cafés

                                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </Link>


                                    <Link
                                        href="/signup"
                                        className="inline-flex h-12 items-center rounded-full border border-white/[0.1] px-6 text-sm text-white/50 transition duration-300 hover:border-white/20 hover:text-white"
                                    >
                                        Register a café
                                    </Link>

                                </div>
                            </div>


                            {/* HERO IMAGE */}

                            <div className="relative">

                                <div className="relative aspect-[1.08/1] overflow-hidden rounded-[34px] border border-white/[0.09] bg-[#111]">

                                    <img
                                        src="/images/about/cafe-hero.jpg"
                                        alt="Warm café interior"
                                        className="h-full w-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/15" />

                                    <div className="absolute inset-y-0 left-0 w-[35%] bg-gradient-to-r from-black/45 to-transparent" />


                                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6 rounded-[24px] border border-white/10 bg-black/55 p-5 backdrop-blur-xl">

                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.22em] text-[#b8ff65]">
                                                The idea
                                            </p>

                                            <p className="mt-2 max-w-sm text-sm leading-6 text-white/65">
                                                Somewhere nearby might already
                                                be exactly what you need.
                                            </p>
                                        </div>


                                        <span className="hidden font-mono text-[10px] text-white/25 sm:block">
                                            TUNTUNAN
                                        </span>

                                    </div>

                                </div>


                                <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#b8ff65]/[0.05] blur-[100px]" />

                            </div>

                        </div>

                    </div>
                </section>


                {/* =====================================================
                    ORIGIN
                ===================================================== */}

                <section className="border-b border-white/[0.08]">
                    <div className="mx-auto grid max-w-[1600px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:px-12 lg:py-28">

                        {/* IMAGE */}

                        <div className="relative">

                            <div className="sticky top-10 overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#111]">

                                <div className="aspect-[4/5]">

                                    <img
                                        src="/images/about/developer-cafe.jpg"
                                        alt="Developer working on a laptop in a café"
                                        className="h-full w-full object-cover"
                                    />

                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/15" />


                                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">

                                    <span className="text-[9px] uppercase tracking-[0.22em] text-[#b8ff65]">
                                        Where it started
                                    </span>

                                    <p className="mt-3 max-w-md text-xl font-medium leading-7 tracking-[-0.025em]">
                                        A developer, a laptop, a coffee —
                                        and the constant search for the right
                                        place to work.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* COPY */}

                        <div className="lg:py-8">

                            <span className="text-[10px] uppercase tracking-[0.24em] text-[#b8ff65]">
                                Why Tuntunan exists
                            </span>


                            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-6xl">
                                Built from a developer&apos;s café habit.
                            </h2>


                            <p className="mt-9 text-xl leading-8 tracking-[-0.02em] text-white/70 sm:text-2xl sm:leading-9">
                                Tuntunan started because its developer genuinely
                                loves cafés — but finding the right café was
                                often more complicated than it should be.
                            </p>


                            <div className="mt-10 space-y-6 text-base leading-8 text-white/38">

                                <p>
                                    Sometimes you&apos;re somewhere unfamiliar
                                    and simply want a café nearby. But nearby
                                    does not always mean useful.
                                </p>

                                <p>
                                    A place might already be closed, too far
                                    from where you actually are, or missing
                                    something you need.
                                </p>

                                <p>
                                    For developers, students, and remote workers,
                                    the small details matter. You start asking:
                                    does it have Wi-Fi? Are there outlets?
                                    Can I stay long enough to work? Is it open
                                    right now?
                                </p>

                                <p>
                                    Finding those answers usually means jumping
                                    between map apps, reviews, social media,
                                    websites, and sometimes outdated information.
                                </p>

                            </div>


                            <div className="mt-10 border-l border-[#b8ff65]/40 pl-6 sm:pl-8">

                                <p className="text-xl font-medium leading-8 tracking-[-0.025em] text-white/85">
                                    Tuntunan was built to make that decision
                                    easier.
                                </p>

                            </div>

                        </div>

                    </div>
                </section>


                {/* =====================================================
                    THE QUESTION
                ===================================================== */}

                <section className="border-b border-white/[0.08]">
                    <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">

                        <div className="grid gap-14 lg:grid-cols-[0.28fr_1.72fr]">

                            <div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
                                    The problem
                                </span>
                            </div>


                            <div>

                                <h2 className="max-w-6xl text-4xl font-medium leading-[1.05] tracking-[-0.055em] text-white/90 sm:text-6xl lg:text-7xl">
                                    Finding a café shouldn&apos;t mean opening
                                    five different apps.

                                    <span className="mt-5 block text-white/25">
                                        You should be able to find a place
                                        nearby that fits what you need right now.
                                    </span>
                                </h2>

                            </div>

                        </div>

                    </div>
                </section>


                {/* =====================================================
                    DEV NEEDS + IMAGE
                ===================================================== */}

                <section className="border-b border-white/[0.08]">
                    <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">

                        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">

                            <div className="relative overflow-hidden rounded-[34px] border border-white/[0.08] bg-[#111]">

                                <div className="aspect-[1.08/1]">

                                    <img
                                        src="/images/about/laptop-outlet.jpg"
                                        alt="Laptop, coffee and charging outlet in a café"
                                        className="h-full w-full object-cover"
                                    />

                                </div>


                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />


                                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9">

                                    <p className="text-[9px] uppercase tracking-[0.22em] text-[#b8ff65]">
                                        The practical stuff
                                    </p>

                                    <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                                        Sometimes a café becomes your workspace.
                                    </h2>

                                </div>

                            </div>


                            <div className="grid gap-px overflow-hidden rounded-[34px] border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">

                                <NeedCard
                                    number="01"
                                    title="Wi-Fi"
                                    text="For developers, students, and remote workers, internet access can be essential."
                                />

                                <NeedCard
                                    number="02"
                                    title="Outlets"
                                    text="Your work session can end quickly when your battery is low and there is nowhere to plug in."
                                />

                                <NeedCard
                                    number="03"
                                    title="Open now"
                                    text="A good café is not useful if it closes before you can actually settle in."
                                />

                                <NeedCard
                                    number="04"
                                    title="Close enough"
                                    text="The café should make sense for where you are at that exact moment."
                                />

                            </div>

                        </div>

                    </div>
                </section>


                {/* =====================================================
                    COMMUNITY IMAGE
                ===================================================== */}

                <section className="border-b border-white/[0.08]">
                    <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">

                        <div className="grid gap-14 lg:grid-cols-[0.68fr_1.32fr] lg:items-center">

                            <div>

                                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b8ff65]">
                                    More than a pin
                                </span>


                                <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-5xl">
                                    A café is a place people actually use.
                                </h2>


                                <p className="mt-7 max-w-lg text-base leading-8 text-white/38">
                                    People go to cafés to work, study, meet,
                                    think, wait, reset, or just enjoy a cup of
                                    coffee. Tuntunan should help people find
                                    places that fit those real situations.
                                </p>


                                <p className="mt-5 max-w-lg text-base leading-8 text-white/38">
                                    That means showing more than a name and a
                                    location. It means showing the details that
                                    help someone decide whether a place actually
                                    fits.
                                </p>

                            </div>


                            <div className="relative">

                                <div className="overflow-hidden rounded-[34px] border border-white/[0.08]">

                                    <div className="aspect-[16/9]">

                                        <img
                                            src="/images/about/cafe-community.jpg"
                                            alt="People working and spending time in a café"
                                            className="h-full w-full object-cover"
                                        />

                                    </div>

                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

                                </div>

                            </div>

                        </div>

                    </div>
                </section>


                {/* =====================================================
                    SOLUTION
                ===================================================== */}

                <section className="border-b border-white/[0.08]">
                    <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">

                        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

                            <div>

                                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b8ff65]">
                                    What Tuntunan does
                                </span>


                                <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
                                    One place to understand your options.
                                </h2>

                            </div>


                            <p className="max-w-lg text-sm leading-7 text-white/35">
                                Tuntunan combines nearby discovery with
                                practical café information so you can spend
                                less time researching and more time actually
                                going somewhere.
                            </p>

                        </div>


                        <div className="grid gap-px overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 xl:grid-cols-4">

                            <ValueCard
                                number="01"
                                title="Search nearby"
                                text="Use your current location or search another area to discover cafés around it."
                            />

                            <ValueCard
                                number="02"
                                title="Check the details"
                                text="Look for useful information like Wi-Fi, outlets, seating, accessibility, and hours."
                            />

                            <ValueCard
                                number="03"
                                title="See richer listings"
                                text="Registered cafés can provide more information directly about their space."
                            />

                            <ValueCard
                                number="04"
                                title="Choose faster"
                                text="Get enough context to decide where you want to go without endless searching."
                            />

                        </div>

                    </div>
                </section>


                {/* =====================================================
                    PRINCIPLE
                ===================================================== */}

                <section className="border-b border-white/[0.08]">
                    <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">

                        <div className="grid gap-14 lg:grid-cols-[0.3fr_1.7fr]">

                            <div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
                                    Tuntunan
                                </span>
                            </div>


                            <div>

                                <blockquote className="max-w-6xl text-4xl font-medium leading-[1.05] tracking-[-0.055em] text-white/90 sm:text-6xl lg:text-7xl">
                                    A map can tell you where a café is.

                                    <span className="mt-5 block text-white/25">
                                        Tuntunan should help you decide whether
                                        it&apos;s the right café for you right now.
                                    </span>
                                </blockquote>

                            </div>

                        </div>

                    </div>
                </section>


                {/* =====================================================
                    OWNER CTA
                ===================================================== */}

                <section>
                    <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">

                        <div className="relative overflow-hidden rounded-[36px] border border-white/[0.09] bg-[#0e0e0e] px-7 py-12 sm:px-10 lg:px-14 lg:py-16">

                            <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#b8ff65]/[0.06] blur-[120px]" />


                            <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">

                                <div>

                                    <span className="text-[10px] uppercase tracking-[0.24em] text-[#b8ff65]">
                                        For café owners
                                    </span>


                                    <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                                        Help people know whether your café fits.
                                    </h2>

                                </div>


                                <div className="lg:justify-self-end">

                                    <p className="max-w-md text-sm leading-7 text-white/38">
                                        Add your location, opening hours,
                                        amenities, photos, and description so
                                        people can understand your café before
                                        they arrive.
                                    </p>


                                    <Link
                                        href="/signup"
                                        className="group mt-7 inline-flex h-12 items-center gap-3 rounded-full bg-[#b8ff65] px-6 text-sm font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#c5ff7e]"
                                    >
                                        Register your café

                                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>
                </section>


                <SiteFooter />
            </div>
        </main>
    );
}


/* =========================================================
   NEED CARD
========================================================= */

function NeedCard({
                      number,
                      title,
                      text,
                  }: {
    number: string;
    title: string;
    text: string;
}) {
    return (
        <article className="group relative min-h-[260px] bg-[#0d0d0d] p-7 transition duration-300 hover:bg-[#111111]">

            <span className="font-mono text-[10px] text-white/20">
                {number}
            </span>


            <div className="absolute bottom-7 left-7 right-7">

                <h3 className="text-2xl font-semibold tracking-[-0.035em] transition duration-300 group-hover:text-[#b8ff65]">
                    {title}
                </h3>


                <p className="mt-4 text-sm leading-6 text-white/32">
                    {text}
                </p>

            </div>

        </article>
    );
}


/* =========================================================
   VALUE CARD
========================================================= */

function ValueCard({
                       number,
                       title,
                       text,
                   }: {
    number: string;
    title: string;
    text: string;
}) {
    return (
        <article className="group min-h-[280px] bg-[#0d0d0d] p-7 transition duration-300 hover:bg-[#111] sm:p-8">

            <span className="font-mono text-[10px] text-white/20">
                {number}
            </span>


            <div className="mt-16">

                <h3 className="text-2xl font-semibold tracking-[-0.035em] transition group-hover:text-[#b8ff65]">
                    {title}
                </h3>


                <p className="mt-4 max-w-sm text-sm leading-6 text-white/32">
                    {text}
                </p>

            </div>

        </article>
    );
}


