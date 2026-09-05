"use client";

import Link from "next/link";
import {
    useEffect,
    useState,
} from "react";


interface OwnerSession {
    cafeId: number;
    slug: string;
    cafeName: string;

    ownerName: string;
    ownerEmail: string;

    status: string;
}


export function SiteHeader() {
    const [
        owner,
        setOwner,
    ] = useState<OwnerSession | null>(
        null
    );

    const [
        sessionLoaded,
        setSessionLoaded,
    ] = useState(false);


    useEffect(() => {
        const storedOwner =
            localStorage.getItem(
                "tuntunan_owner"
            );


        if (!storedOwner) {
            setSessionLoaded(true);

            return;
        }


        try {
            const parsedOwner =
                JSON.parse(
                    storedOwner
                ) as OwnerSession;


            setOwner(
                parsedOwner
            );

        } catch {
            localStorage.removeItem(
                "tuntunan_owner"
            );
        }


        setSessionLoaded(true);

    }, []);


    return (
        <header className="border-b border-white/[0.08]">

            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">

                {/* =====================================================
                    LOGO
                ===================================================== */}

                <Link
                    href="/"
                    className="group flex items-center gap-4"
                >

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition duration-300 group-hover:border-[#b8ff65]/40">

                        <div className="h-2.5 w-2.5 rounded-full bg-[#b8ff65] shadow-[0_0_18px_rgba(184,255,101,0.25)]" />

                    </div>


                    <span className="text-sm font-semibold uppercase tracking-[0.24em]">
                        Tuntunan
                    </span>

                </Link>



                {/* =====================================================
                    DESKTOP NAV
                ===================================================== */}

                <div className="hidden items-center gap-10 md:flex">

                    <nav className="flex items-center gap-8 text-xs">

                        <Link
                            href="/"
                            className="text-white/45 transition duration-300 hover:text-white"
                        >
                            Explore
                        </Link>


                        <Link
                            href="/cafes"
                            className="text-white/45 transition duration-300 hover:text-white"
                        >
                            Registered Cafés
                        </Link>


                        <Link
                            href="/about"
                            className="text-white/45 transition duration-300 hover:text-white"
                        >
                            About
                        </Link>

                    </nav>



                    {/* =================================================
                        SESSION AREA
                    ================================================= */}

                    {sessionLoaded && (
                        <>
                            {owner ? (

                                <Link
                                    href="/dashboard"
                                    className="group inline-flex h-10 items-center gap-3 rounded-full border border-[#b8ff65]/25 bg-[#b8ff65]/[0.07] px-5 transition duration-300 hover:border-[#b8ff65] hover:bg-[#b8ff65] hover:text-black"
                                >

                                    <span className="h-1.5 w-1.5 rounded-full bg-[#b8ff65] transition group-hover:bg-black" />


                                    <div className="flex items-center gap-2">

                                        <span className="max-w-[150px] truncate text-[10px] font-semibold text-[#b8ff65] transition group-hover:text-black">
                                            {owner.cafeName}
                                        </span>


                                        <span className="text-[9px] uppercase tracking-[0.12em] text-[#b8ff65]/50 transition group-hover:text-black/50">
                                            Dashboard
                                        </span>

                                    </div>


                                    <span className="text-[11px] text-[#b8ff65] transition duration-300 group-hover:translate-x-0.5 group-hover:text-black">
                                        →
                                    </span>

                                </Link>

                            ) : (

                                <Link
                                    href="/signup"
                                    className="group inline-flex h-10 items-center gap-2 rounded-full border border-[#b8ff65]/25 bg-[#b8ff65]/[0.07] px-5 text-[11px] font-semibold text-[#b8ff65] transition duration-300 hover:border-[#b8ff65] hover:bg-[#b8ff65] hover:text-black"
                                >

                                    Cafe Owner?

                                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                                        →
                                    </span>

                                </Link>

                            )}
                        </>
                    )}

                </div>



                {/* =====================================================
                    MOBILE
                ===================================================== */}

                <div className="md:hidden">

                    {sessionLoaded && (
                        <>
                            {owner ? (

                                <Link
                                    href="/dashboard"
                                    className="inline-flex h-10 items-center gap-2 rounded-full border border-[#b8ff65]/25 bg-[#b8ff65]/[0.07] px-4 text-[10px] font-semibold text-[#b8ff65]"
                                >

                                    <span className="h-1.5 w-1.5 rounded-full bg-[#b8ff65]" />

                                    Dashboard

                                </Link>

                            ) : (

                                <Link
                                    href="/signup"
                                    className="inline-flex h-10 items-center rounded-full border border-[#b8ff65]/25 bg-[#b8ff65]/[0.07] px-4 text-[10px] font-semibold text-[#b8ff65]"
                                >
                                    Cafe Owner?
                                </Link>

                            )}
                        </>
                    )}

                </div>

            </div>

        </header>
    );
}