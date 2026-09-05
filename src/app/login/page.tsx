"use client";

import Link from "next/link";
import {
    FormEvent,
    useState,
} from "react";
import { useRouter } from "next/navigation";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL;


interface LoginResponse {
    success: boolean;

    cafe_id: number;
    slug: string;
    cafe_name: string;

    owner_name: string;
    owner_email: string;

    status: string;
}


export default function LoginPage() {
    const router = useRouter();


    const [email, setEmail] =
        useState("");


    const [password, setPassword] =
        useState("");


    const [isSubmitting, setIsSubmitting] =
        useState(false);


    const [error, setError] =
        useState<string | null>(
            null
        );


    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);


        if (!email.trim()) {
            setError(
                "Please enter your email address."
            );

            return;
        }


        if (!password) {
            setError(
                "Please enter your password."
            );

            return;
        }


        if (!API_URL) {
            setError(
                "API URL is not configured."
            );

            return;
        }


        try {
            setIsSubmitting(true);


            const response =
                await fetch(
                    `${API_URL}/api/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            email:
                                email
                                    .trim()
                                    .toLowerCase(),

                            password,
                        }),
                    }
                );


            if (!response.ok) {
                let message =
                    "Unable to sign in.";


                try {
                    const data =
                        await response.json();


                    if (
                        typeof data.detail ===
                        "string"
                    ) {
                        message =
                            data.detail;
                    }
                } catch {
                    // Keep default message
                }


                if (
                    response.status ===
                    401
                ) {
                    message =
                        "Invalid email or password.";
                }


                setError(
                    message
                );

                return;
            }


            const data: LoginResponse =
                await response.json();


            /*
             * Temporary local session.
             *
             * We'll replace this with a secure
             * server-side session / HTTP-only
             * cookie after the dashboard flow
             * is working.
             */

            localStorage.setItem(
                "tuntunan_owner",
                JSON.stringify({
                    cafeId:
                    data.cafe_id,

                    slug:
                    data.slug,

                    cafeName:
                    data.cafe_name,

                    ownerName:
                    data.owner_name,

                    ownerEmail:
                    data.owner_email,

                    status:
                    data.status,
                })
            );


            router.push(
                "/dashboard"
            );

            router.refresh();

        } catch (error) {
            console.error(
                "Login request failed:",
                error
            );


            setError(
                "Unable to connect to Tuntunan. Please make sure the API is running."
            );

        } finally {
            setIsSubmitting(
                false
            );
        }
    }


    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white">

            <BackgroundEffects />


            <div className="relative z-10">

                <SiteHeader />


                <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1600px] items-center gap-16 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">


                    {/* =====================================================
                        LEFT
                    ===================================================== */}

                    <section>

                        <div className="flex items-center gap-3">

                            <span className="h-2 w-2 rounded-full bg-[#b8ff65]" />


                            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
                                Café owners
                            </span>

                        </div>


                        <h1 className="mt-8 max-w-[760px] text-[clamp(4rem,7vw,7.5rem)] font-semibold leading-[0.86] tracking-[-0.07em]">

                            Welcome

                            <span className="block text-white/28">
                                back.
                            </span>

                        </h1>


                        <p className="mt-8 max-w-xl text-base leading-7 text-white/40 sm:text-lg">

                            Sign in to manage your café
                            listing, update your details,
                            opening hours, amenities, and
                            photos.

                        </p>


                        <div className="mt-10 grid max-w-xl gap-px overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">

                            <InfoCard
                                number="01"
                                title="Manage details"
                                text="Keep your café information accurate."
                            />


                            <InfoCard
                                number="02"
                                title="Stay current"
                                text="Update hours, amenities, and photos."
                            />

                        </div>

                    </section>



                    {/* =====================================================
                        FORM
                    ===================================================== */}

                    <section className="lg:justify-self-end">

                        <div className="w-full max-w-[620px] overflow-hidden rounded-[34px] border border-white/[0.09] bg-[#0d0d0d] shadow-[0_40px_120px_rgba(0,0,0,0.35)]">


                            <div className="border-b border-white/[0.07] px-7 py-6 sm:px-9">

                                <p className="text-[10px] uppercase tracking-[0.24em] text-[#b8ff65]">
                                    Sign in
                                </p>


                                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                                    Manage your café.
                                </h2>

                            </div>



                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="p-7 sm:p-9"
                            >

                                <div className="grid gap-6">


                                    {/* EMAIL */}

                                    <Field
                                        label="Email"
                                    >

                                        <input
                                            type="email"
                                            value={
                                                email
                                            }
                                            onChange={(
                                                event
                                            ) => {
                                                setEmail(
                                                    event.target
                                                        .value
                                                );

                                                if (
                                                    error
                                                ) {
                                                    setError(
                                                        null
                                                    );
                                                }
                                            }}
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            disabled={
                                                isSubmitting
                                            }
                                            className={
                                                inputClassName
                                            }
                                        />

                                    </Field>



                                    {/* PASSWORD */}

                                    <Field
                                        label="Password"
                                    >

                                        <input
                                            type="password"
                                            value={
                                                password
                                            }
                                            onChange={(
                                                event
                                            ) => {
                                                setPassword(
                                                    event.target
                                                        .value
                                                );

                                                if (
                                                    error
                                                ) {
                                                    setError(
                                                        null
                                                    );
                                                }
                                            }}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            disabled={
                                                isSubmitting
                                            }
                                            className={
                                                inputClassName
                                            }
                                        />

                                    </Field>

                                </div>



                                {/* ERROR */}

                                {error && (
                                    <div className="mt-6 rounded-[18px] border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-sm leading-6 text-red-200">

                                        {error}

                                    </div>
                                )}



                                {/* SUBMIT */}

                                <button
                                    type="submit"
                                    disabled={
                                        isSubmitting
                                    }
                                    className="group mt-8 inline-flex h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#b8ff65] px-7 text-sm font-semibold text-black transition duration-300 hover:bg-[#c5ff7e] disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {isSubmitting
                                        ? "Signing in..."
                                        : "Sign in"}


                                    {!isSubmitting && (
                                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    )}

                                </button>



                                {/* REGISTER */}

                                <div className="mt-8 border-t border-white/[0.07] pt-7 text-center">

                                    <p className="text-xs text-white/25">
                                        Don&apos;t have an account?
                                    </p>


                                    <Link
                                        href="/signup"
                                        className="mt-3 inline-flex text-xs font-medium text-[#b8ff65] transition hover:text-[#c5ff7e]"
                                    >
                                        Register your café →
                                    </Link>

                                </div>

                            </form>

                        </div>

                    </section>

                </div>

            </div>

        </main>
    );
}



/* =========================================================
   FIELD
========================================================= */

function Field({
                   label,
                   children,
               }: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">

            <span className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-white/32">
                {label}
            </span>


            {children}

        </label>
    );
}


const inputClassName =
    "h-14 w-full rounded-[18px] border border-white/[0.08] bg-white/[0.025] px-5 text-sm text-white outline-none transition placeholder:text-white/18 hover:border-white/[0.14] focus:border-[#b8ff65]/40 focus:bg-[#b8ff65]/[0.025] disabled:cursor-not-allowed disabled:opacity-50";



/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
                      number,
                      title,
                      text,
                  }: {
    number: string;
    title: string;
    text: string;
}) {
    return (
        <div className="min-h-[190px] bg-[#0d0d0d] p-6">

            <span className="font-mono text-[9px] text-white/18">
                {number}
            </span>


            <h3 className="mt-10 text-lg font-semibold tracking-[-0.025em]">
                {title}
            </h3>


            <p className="mt-3 text-xs leading-5 text-white/30">
                {text}
            </p>

        </div>
    );
}



/* =========================================================
   HEADER
========================================================= */

function SiteHeader() {
    return (
        <header className="border-b border-white/[0.08]">

            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">


                <Link
                    href="/"
                    className="group flex items-center gap-4"
                >

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition duration-300 group-hover:border-[#b8ff65]/40">

                        <div className="h-2.5 w-2.5 rounded-full bg-[#b8ff65]" />

                    </div>


                    <span className="text-sm font-semibold uppercase tracking-[0.24em]">
                        Tuntunan
                    </span>

                </Link>


                <Link
                    href="/"
                    className="text-xs text-white/35 transition hover:text-white"
                >
                    Close
                </Link>

            </div>

        </header>
    );
}



/* =========================================================
   BACKGROUND
========================================================= */

function BackgroundEffects() {
    return (
        <>

            <div className="pointer-events-none absolute -left-40 top-20 h-[600px] w-[600px] rounded-full bg-[#b8ff65]/[0.035] blur-[150px]" />


            <div className="pointer-events-none absolute right-0 top-0 h-[700px] w-[700px] rounded-full bg-white/[0.015] blur-[170px]" />


            <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_center,white_0.8px,transparent_0.8px)] [background-size:18px_18px]" />

        </>
    );
}