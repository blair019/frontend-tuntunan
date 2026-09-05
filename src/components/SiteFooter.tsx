import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="border-t border-white/[0.08]">

            <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 lg:px-12">

                <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <Link
                            href="/"
                            className="inline-flex items-center gap-3"
                        >
                            <span className="h-2 w-2 rounded-full bg-[#b8ff65]" />

                            <span className="text-xs font-semibold uppercase tracking-[0.24em]">
                                Tuntunan
                            </span>
                        </Link>


                        <p className="mt-4 max-w-sm text-xs leading-5 text-white/25">
                            Find the café that fits what you need right now.
                        </p>

                    </div>


                    <nav className="flex flex-wrap gap-6 text-xs text-white/35">

                        <Link
                            href="/"
                            className="transition hover:text-white"
                        >
                            Explore
                        </Link>


                        <Link
                            href="/cafes"
                            className="transition hover:text-white"
                        >
                            Registered Cafés
                        </Link>


                        <Link
                            href="/signup"
                            className="transition hover:text-white"
                        >
                            Register
                        </Link>


                        <Link
                            href="/about"
                            className="transition hover:text-white"
                        >
                            About
                        </Link>

                    </nav>

                </div>


                <div className="mt-10 border-t border-white/[0.06] pt-6">

                    <p className="text-[9px] uppercase tracking-[0.17em] text-white/15">
                        Built from a love for cafés.
                    </p>

                </div>

            </div>

        </footer>
    );
}