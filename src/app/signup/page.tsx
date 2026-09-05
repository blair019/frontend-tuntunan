"use client";

import Link from "next/link";
import { SiteHeader } from "@/src/components/SiteHeaders";
import { BackgroundEffects } from "@/src/components/BackgroundEffects"

import {
    FormEvent,
    useMemo,
    useState,
} from "react";

import { LocationSearch } from "@/src/features/cafes/components/LocationSearch";

import type { LocationSearchResult } from "@/src/features/cafes/types/location";

import {
    registerCafe,
    type CafeRegistrationPayload,
    type RegisteredCafeApiResponse,
} from "@/src/features/cafes/api/registered-cafes.api";


type Step =
    | 1
    | 2
    | 3
    | 4
    | 5;


interface DayHours {
    enabled: boolean;
    open: string;
    close: string;
    is24Hours: boolean;
}


interface OpeningHours {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
}


interface SignupForm {
    cafeName: string;

    city: string;
    area: string;
    address: string;

    latitude: number | null;
    longitude: number | null;

    wifi: boolean;
    outlets: boolean;
    outdoorSeating: boolean;
    workFriendly: boolean;
    petFriendly: boolean;
    wheelchairAccessible: boolean;

    openingHours: OpeningHours;

    instagram: string;
    website: string;
    description: string;

    ownerName: string;
    email: string;
    password: string;
}


const DEFAULT_DAY_HOURS: DayHours = {
    enabled: true,
    open: "08:00",
    close: "20:00",
    is24Hours: false,
};


const INITIAL_FORM: SignupForm = {
    cafeName: "",

    city: "",
    area: "",
    address: "",

    latitude: null,
    longitude: null,

    wifi: false,
    outlets: false,
    outdoorSeating: false,
    workFriendly: false,
    petFriendly: false,
    wheelchairAccessible: false,

    openingHours: {
        monday: {
            ...DEFAULT_DAY_HOURS,
        },

        tuesday: {
            ...DEFAULT_DAY_HOURS,
        },

        wednesday: {
            ...DEFAULT_DAY_HOURS,
        },

        thursday: {
            ...DEFAULT_DAY_HOURS,
        },

        friday: {
            ...DEFAULT_DAY_HOURS,
        },

        saturday: {
            ...DEFAULT_DAY_HOURS,
        },

        sunday: {
            ...DEFAULT_DAY_HOURS,
        },
    },

    instagram: "",
    website: "",
    description: "",

    ownerName: "",
    email: "",
    password: "",
};


const STEPS = [
    {
        number: 1,
        eyebrow: "Your café",
        title: "Start with the basics.",
    },

    {
        number: 2,
        eyebrow: "Your space",
        title: "What can people expect?",
    },

    {
        number: 3,
        eyebrow: "Details",
        title: "Help people understand the place.",
    },

    {
        number: 4,
        eyebrow: "Photos",
        title: "Give people a reason to visit.",
    },

    {
        number: 5,
        eyebrow: "Owner",
        title: "Create your account.",
    },
] as const;


/* =========================================================
   PAGE
========================================================= */

export default function CafeOwnerSignupPage() {
    const [step, setStep] =
        useState<Step>(1);

    const [form, setForm] =
        useState<SignupForm>(
            INITIAL_FORM
        );

    const [
        coverImage,
        setCoverImage,
    ] =
        useState<File | null>(
            null
        );

    const [
        galleryImages,
        setGalleryImages,
    ] =
        useState<File[]>([]);

    const [
        isSubmitting,
        setIsSubmitting,
    ] =
        useState(false);

    const [
        submitError,
        setSubmitError,
    ] =
        useState<string | null>(
            null
        );

    const [
        createdCafe,
        setCreatedCafe,
    ] =
        useState<RegisteredCafeApiResponse | null>(
            null
        );

    const currentStep =
        useMemo(
            () =>
                STEPS.find(
                    (item) =>
                        item.number ===
                        step
                ) ??
                STEPS[0],
            [step]
        );


    function updateField<
        K extends keyof SignupForm
    >(
        field: K,
        value: SignupForm[K]
    ) {
        setForm(
            (current) => ({
                ...current,
                [field]: value,
            })
        );
    }


    function nextStep() {
        setSubmitError(null);

        const validationError =
            validateStep(
                step,
                form
            );

        if (validationError) {
            setSubmitError(
                validationError
            );

            return;
        }

        setStep(
            (current) =>
                Math.min(
                    current + 1,
                    5
                ) as Step
        );
    }


    function previousStep() {
        setSubmitError(null);

        setStep(
            (current) =>
                Math.max(
                    current - 1,
                    1
                ) as Step
        );
    }


    function handleLocationSelect(
        location: LocationSearchResult
    ) {
        updateField(
            "latitude",
            location.latitude
        );

        updateField(
            "longitude",
            location.longitude
        );

        /*
         * LocationSearch's display name is useful
         * as a fallback address, but don't overwrite
         * an address the owner already typed.
         */
        if (
            !form.address.trim()
        ) {
            updateField(
                "address",
                location.name
            );
        }
    }


    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setSubmitError(null);

        const validationError =
            validateStep(
                5,
                form
            );

        if (validationError) {
            setSubmitError(
                validationError
            );

            return;
        }

        /*
         * Exact coordinates are required for
         * Tuntunan discovery.
         */
        if (
            form.latitude === null ||
            form.longitude === null
        ) {
            setSubmitError(
                "Please select your café location in Step 1 so Tuntunan knows where to place it on the map."
            );

            setStep(1);

            return;
        }

        const payload =
            buildRegistrationPayload(
                form
            );

        try {
            setIsSubmitting(true);

            const created =
                await registerCafe({
                    payload,
                    coverImage,
                    galleryImages,
                });

            setCreatedCafe(
                created
            );
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while registering your café."
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

                <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pb-28 lg:pt-16">
                    <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">

                        {/* =====================================================
                            LEFT
                        ===================================================== */}

                        <aside className="lg:sticky lg:top-12 lg:self-start">

                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-[#b8ff65]" />

                                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
                                    For café owners
                                </span>
                            </div>

                            <h1 className="mt-8 max-w-[650px] text-[clamp(3.8rem,6.8vw,7.2rem)] font-semibold leading-[0.87] tracking-[-0.065em]">
                                Put your café

                                <span className="block text-white/30">
                                    on Tuntunan.
                                </span>
                            </h1>

                            <p className="mt-8 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
                                Create a richer listing,
                                show what makes your space
                                worth visiting, and help
                                people discover your café
                                for the right reasons.
                            </p>

                            <div className="mt-10 grid max-w-xl gap-px overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">
                                <Feature
                                    icon={
                                        <CompassIcon />
                                    }
                                    title="Get discovered"
                                    text="Appear in nearby discovery and the registered café directory."
                                />

                                <Feature
                                    icon={
                                        <PhotoIcon />
                                    }
                                    title="Add your photos"
                                    text="Show the real atmosphere of your space."
                                />

                                <Feature
                                    icon={
                                        <CoffeeIcon />
                                    }
                                    title="Show amenities"
                                    text="Wi-Fi, outlets, seating and more."
                                />

                                <Feature
                                    icon={
                                        <MapIcon />
                                    }
                                    title="Add your location"
                                    text="Place your café accurately on Tuntunan's map."
                                />
                            </div>

                            <div className="mt-8 rounded-[24px] border border-[#b8ff65]/10 bg-[#b8ff65]/[0.035] p-6">
                                <p className="text-[9px] uppercase tracking-[0.22em] text-[#b8ff65]">
                                    What happens next?
                                </p>

                                <p className="mt-3 max-w-md text-sm leading-6 text-white/42">
                                    Your café will be saved
                                    directly to Tuntunan and
                                    can appear in the
                                    registered café directory
                                    and nearby discovery.
                                </p>
                            </div>
                        </aside>


                        {/* =====================================================
                            FORM
                        ===================================================== */}

                        <section>
                            <div className="overflow-hidden rounded-[34px] border border-white/[0.09] bg-[#0d0d0d] shadow-[0_40px_120px_rgba(0,0,0,0.35)]">

                                {!createdCafe && (
                                    <Progress
                                        step={
                                            step
                                        }
                                        onStepChange={
                                            setStep
                                        }
                                    />
                                )}

                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                >
                                    <div className="p-6 sm:p-9 lg:p-11">

                                        {createdCafe ? (
                                            <SuccessState
                                                cafe={
                                                    createdCafe
                                                }
                                            />
                                        ) : (
                                            <>
                                                <div className="mb-10">
                                                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#b8ff65]">
                                                        {
                                                            currentStep.eyebrow
                                                        }
                                                    </p>

                                                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                                                        {
                                                            currentStep.title
                                                        }
                                                    </h2>

                                                    <p className="mt-3 text-sm leading-6 text-white/32">
                                                        Step{" "}
                                                        {
                                                            step
                                                        }{" "}
                                                        of 5
                                                    </p>
                                                </div>


                                                {step ===
                                                    1 && (
                                                        <CafeBasicsStep
                                                            form={
                                                                form
                                                            }
                                                            updateField={
                                                                updateField
                                                            }
                                                            onLocationSelect={
                                                                handleLocationSelect
                                                            }
                                                        />
                                                    )}


                                                {step ===
                                                    2 && (
                                                        <CafeSpaceStep
                                                            form={
                                                                form
                                                            }
                                                            updateField={
                                                                updateField
                                                            }
                                                        />
                                                    )}


                                                {step ===
                                                    3 && (
                                                        <CafeDetailsStep
                                                            form={
                                                                form
                                                            }
                                                            updateField={
                                                                updateField
                                                            }
                                                        />
                                                    )}


                                                {step ===
                                                    4 && (
                                                        <CafePhotosStep
                                                            coverImage={
                                                                coverImage
                                                            }
                                                            setCoverImage={
                                                                setCoverImage
                                                            }
                                                            galleryImages={
                                                                galleryImages
                                                            }
                                                            setGalleryImages={
                                                                setGalleryImages
                                                            }
                                                        />
                                                    )}


                                                {step ===
                                                    5 && (
                                                        <OwnerStep
                                                            form={
                                                                form
                                                            }
                                                            updateField={
                                                                updateField
                                                            }
                                                        />
                                                    )}


                                                {submitError && (
                                                    <div className="mt-8 rounded-[20px] border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-sm leading-6 text-red-200">
                                                        {
                                                            submitError
                                                        }
                                                    </div>
                                                )}


                                                <div className="mt-12 flex items-center justify-between border-t border-white/[0.07] pt-7">

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            previousStep
                                                        }
                                                        disabled={
                                                            step ===
                                                            1 ||
                                                            isSubmitting
                                                        }
                                                        className="inline-flex h-12 items-center gap-2 rounded-full px-2 text-sm text-white/35 transition hover:text-white disabled:pointer-events-none disabled:opacity-0"
                                                    >
                                                        ← Back
                                                    </button>


                                                    {step <
                                                    5 ? (
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                nextStep
                                                            }
                                                            className="group inline-flex h-12 cursor-pointer items-center gap-3 rounded-full bg-[#b8ff65] px-6 text-sm font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#c5ff7e]"
                                                        >
                                                            Continue

                                                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                                                →
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            className="group inline-flex h-12 cursor-pointer items-center gap-3 rounded-full bg-[#b8ff65] px-6 text-sm font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#c5ff7e] disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {isSubmitting
                                                                ? "Creating café..."
                                                                : "Create my café"}

                                                            {!isSubmitting && (
                                                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                                                    →
                                                                </span>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {!createdCafe && (
                                <p className="mt-5 text-center text-xs text-white/20">
                                    Already registered?{" "}

                                    <Link
                                        href="/login"
                                        className="text-white/45 underline decoration-white/15 underline-offset-4 transition hover:text-white"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}


/* =========================================================
   PROGRESS
========================================================= */

function Progress({
                      step,
                      onStepChange,
                  }: {
    step: Step;
    onStepChange: (
        step: Step
    ) => void;
}) {
    return (
        <div className="border-b border-white/[0.07] p-5 sm:p-7">
            <div className="flex items-center gap-2">
                {STEPS.map(
                    (item) => {
                        const isActive =
                            item.number ===
                            step;

                        const isComplete =
                            item.number <
                            step;

                        return (
                            <button
                                key={
                                    item.number
                                }
                                type="button"
                                onClick={() =>
                                    onStepChange(
                                        item.number as Step
                                    )
                                }
                                className="group flex min-w-0 flex-1 items-center gap-2"
                            >
                                <span
                                    className={[
                                        "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border font-mono text-[9px] transition",
                                        isActive
                                            ? "border-[#b8ff65] bg-[#b8ff65] text-black"
                                            : isComplete
                                                ? "border-[#b8ff65]/30 bg-[#b8ff65]/[0.08] text-[#b8ff65]"
                                                : "border-white/[0.08] bg-white/[0.02] text-white/20",
                                    ].join(
                                        " "
                                    )}
                                >
                                    {String(
                                        item.number
                                    ).padStart(
                                        2,
                                        "0"
                                    )}
                                </span>

                                {item.number <
                                    STEPS.length && (
                                        <span
                                            className={[
                                                "h-px flex-1 transition",
                                                item.number <
                                                step
                                                    ? "bg-[#b8ff65]/25"
                                                    : "bg-white/[0.08]",
                                            ].join(
                                                " "
                                            )}
                                        />
                                    )}
                            </button>
                        );
                    }
                )}
            </div>
        </div>
    );
}


/* =========================================================
   STEP 01
========================================================= */

function CafeBasicsStep({
                            form,
                            updateField,
                            onLocationSelect,
                        }: StepProps & {
    onLocationSelect: (
        location: LocationSearchResult
    ) => void;
}) {
    const hasCoordinates =
        form.latitude !== null &&
        form.longitude !== null;

    return (
        <div className="grid gap-6">

            <Field
                label="Cafe name"
                required
            >
                <input
                    value={
                        form.cafeName
                    }
                    onChange={(
                        event
                    ) =>
                        updateField(
                            "cafeName",
                            event.target
                                .value
                        )
                    }
                    placeholder="e.g. Sunday Coffee"
                    className={
                        inputClassName
                    }
                />
            </Field>


            <div className="grid gap-6 sm:grid-cols-2">

                <Field
                    label="City"
                    required
                >
                    <input
                        value={
                            form.city
                        }
                        onChange={(
                            event
                        ) =>
                            updateField(
                                "city",
                                event
                                    .target
                                    .value
                            )
                        }
                        placeholder="Makati"
                        className={
                            inputClassName
                        }
                    />
                </Field>


                <Field label="Area / neighborhood">
                    <input
                        value={
                            form.area
                        }
                        onChange={(
                            event
                        ) =>
                            updateField(
                                "area",
                                event
                                    .target
                                    .value
                            )
                        }
                        placeholder="Legazpi Village"
                        className={
                            inputClassName
                        }
                    />
                </Field>
            </div>


            <Field
                label="Full address"
                required
            >
                <textarea
                    value={
                        form.address
                    }
                    onChange={(
                        event
                    ) =>
                        updateField(
                            "address",
                            event.target
                                .value
                        )
                    }
                    rows={4}
                    placeholder="Building, street, barangay, city..."
                    className={`${inputClassName} min-h-[120px] resize-none py-4`}
                />
            </Field>


            <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6">

                <div className="mb-5">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#b8ff65]">
                        Map location
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/38">
                        Search for your café
                        or its exact location
                        so it can appear in
                        nearby discovery.
                    </p>
                </div>


                <LocationSearch
                    onSelect={
                        onLocationSelect
                    }
                    disabled={
                        false
                    }
                />


                {hasCoordinates ? (
                    <div className="mt-5 flex items-center gap-3 rounded-[18px] border border-[#b8ff65]/20 bg-[#b8ff65]/[0.05] px-4 py-3">
                        <span className="h-2 w-2 rounded-full bg-[#b8ff65]" />

                        <div>
                            <p className="text-xs font-medium text-[#b8ff65]">
                                Location set
                            </p>

                            <p className="mt-1 font-mono text-[9px] text-white/30">
                                {
                                    form.latitude?.toFixed(
                                        6
                                    )
                                }
                                {" / "}
                                {
                                    form.longitude?.toFixed(
                                        6
                                    )
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="mt-4 text-xs leading-5 text-white/25">
                        Select a search result
                        to save the exact map
                        coordinates.
                    </p>
                )}
            </div>
        </div>
    );
}


/* =========================================================
   STEP 02
========================================================= */

function CafeSpaceStep({
                           form,
                           updateField,
                       }: StepProps) {
    const options = [
        {
            field:
                "wifi" as const,
            title: "Wi-Fi",
            text:
                "Internet available for customers.",
            icon:
                <WifiIcon />,
        },

        {
            field:
                "outlets" as const,
            title:
                "Power outlets",
            text:
                "Customers can charge laptops or phones.",
            icon:
                <PowerIcon />,
        },

        {
            field:
                "workFriendly" as const,
            title:
                "Work friendly",
            text:
                "Suitable for studying or remote work.",
            icon:
                <LaptopIcon />,
        },

        {
            field:
                "outdoorSeating" as const,
            title:
                "Outdoor seating",
            text:
                "Tables or seating available outside.",
            icon:
                <OutdoorIcon />,
        },

        {
            field:
                "petFriendly" as const,
            title:
                "Pet friendly",
            text:
                "Pets are welcome in the café.",
            icon:
                <PetIcon />,
        },

        {
            field:
                "wheelchairAccessible" as const,
            title:
                "Accessible",
            text:
                "Wheelchair-friendly access is available.",
            icon:
                <AccessibilityIcon />,
        },
    ];


    return (
        <div>
            <p className="mb-6 max-w-xl text-sm leading-6 text-white/38">
                Select everything that
                applies. These details
                help visitors find cafés
                that actually fit what
                they need.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
                {options.map(
                    (option) => {
                        const selected =
                            form[
                                option.field
                                ];

                        return (
                            <button
                                key={
                                    option.field
                                }
                                type="button"
                                onClick={() =>
                                    updateField(
                                        option.field,
                                        !selected
                                    )
                                }
                                className={[
                                    "group relative min-h-[150px] rounded-[22px] border p-5 text-left transition duration-300",
                                    selected
                                        ? "border-[#b8ff65]/30 bg-[#b8ff65]/[0.055]"
                                        : "border-white/[0.07] bg-white/[0.018] hover:border-white/[0.15] hover:bg-white/[0.035]",
                                ].join(
                                    " "
                                )}
                            >
                                <div className="flex items-start justify-between gap-4">

                                    <div
                                        className={[
                                            "flex h-10 w-10 items-center justify-center rounded-full border transition",
                                            selected
                                                ? "border-[#b8ff65]/30 bg-[#b8ff65]/10 text-[#b8ff65]"
                                                : "border-white/[0.08] bg-white/[0.02] text-white/35",
                                        ].join(
                                            " "
                                        )}
                                    >
                                        {
                                            option.icon
                                        }
                                    </div>

                                    <div
                                        className={[
                                            "flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition",
                                            selected
                                                ? "border-[#b8ff65] bg-[#b8ff65] text-black"
                                                : "border-white/15 text-transparent",
                                        ].join(
                                            " "
                                        )}
                                    >
                                        ✓
                                    </div>
                                </div>

                                <h3 className="mt-5 text-sm font-semibold">
                                    {
                                        option.title
                                    }
                                </h3>

                                <p className="mt-2 text-xs leading-5 text-white/30">
                                    {
                                        option.text
                                    }
                                </p>
                            </button>
                        );
                    }
                )}
            </div>
        </div>
    );
}


/* =========================================================
   STEP 03
========================================================= */

function CafeDetailsStep({
                             form,
                             updateField,
                         }: StepProps) {
    const days = [
        [
            "monday",
            "Monday",
        ],
        [
            "tuesday",
            "Tuesday",
        ],
        [
            "wednesday",
            "Wednesday",
        ],
        [
            "thursday",
            "Thursday",
        ],
        [
            "friday",
            "Friday",
        ],
        [
            "saturday",
            "Saturday",
        ],
        [
            "sunday",
            "Sunday",
        ],
    ] as const;


    type DayKey =
        keyof OpeningHours;


    function updateDay(
        day: DayKey,
        updates: Partial<DayHours>
    ) {
        updateField(
            "openingHours",
            {
                ...form.openingHours,

                [day]: {
                    ...form.openingHours[
                        day
                        ],

                    ...updates,
                },
            }
        );
    }


    function copyMondayToAll() {
        const monday = {
            ...form.openingHours
                .monday,
        };

        updateField(
            "openingHours",
            {
                monday: {
                    ...monday,
                },

                tuesday: {
                    ...monday,
                },

                wednesday: {
                    ...monday,
                },

                thursday: {
                    ...monday,
                },

                friday: {
                    ...monday,
                },

                saturday: {
                    ...monday,
                },

                sunday: {
                    ...monday,
                },
            }
        );
    }


    return (
        <div className="grid gap-9">

            <div>
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/32">
                            Opening hours
                        </p>

                        <p className="mt-2 max-w-md text-sm leading-6 text-white/30">
                            Choose the days your
                            café is open and set
                            the operating hours.
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={
                            copyMondayToAll
                        }
                        className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 text-[10px] font-medium text-white/40 transition hover:border-[#b8ff65]/25 hover:bg-[#b8ff65]/[0.05] hover:text-[#b8ff65]"
                    >
                        Copy Monday to all
                    </button>
                </div>


                <div className="overflow-hidden rounded-[24px] border border-white/[0.08]">

                    {days.map(
                        (
                            [
                                day,
                                label,
                            ],
                            index
                        ) => {
                            const hours =
                                form
                                    .openingHours[
                                    day
                                    ];

                            return (
                                <div
                                    key={
                                        day
                                    }
                                    className={[
                                        "bg-white/[0.018] p-5 transition",
                                        !hours.enabled
                                            ? "opacity-60"
                                            : "",
                                        index !==
                                        days.length -
                                        1
                                            ? "border-b border-white/[0.07]"
                                            : "",
                                    ].join(
                                        " "
                                    )}
                                >
                                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

                                        <div className="flex min-w-[145px] items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateDay(
                                                        day,
                                                        {
                                                            enabled:
                                                                !hours.enabled,
                                                        }
                                                    )
                                                }
                                                className={[
                                                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] transition",
                                                    hours.enabled
                                                        ? "border-[#b8ff65] bg-[#b8ff65] text-black"
                                                        : "border-white/15 text-transparent",
                                                ].join(
                                                    " "
                                                )}
                                            >
                                                ✓
                                            </button>

                                            <span className="text-sm font-medium">
                                                {
                                                    label
                                                }
                                            </span>
                                        </div>


                                        {hours.enabled ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateDay(
                                                            day,
                                                            {
                                                                is24Hours:
                                                                    !hours.is24Hours,
                                                            }
                                                        )
                                                    }
                                                    className={[
                                                        "inline-flex h-10 w-fit shrink-0 items-center rounded-full border px-4 text-[10px] uppercase tracking-[0.12em] transition",
                                                        hours.is24Hours
                                                            ? "border-[#b8ff65]/40 bg-[#b8ff65]/10 text-[#b8ff65]"
                                                            : "border-white/[0.08] text-white/30",
                                                    ].join(
                                                        " "
                                                    )}
                                                >
                                                    24 hours
                                                </button>


                                                {!hours.is24Hours && (
                                                    <div className="flex flex-1 flex-wrap items-center gap-3">

                                                        <input
                                                            type="time"
                                                            value={
                                                                hours.open
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateDay(
                                                                    day,
                                                                    {
                                                                        open:
                                                                        event.target.value,
                                                                    }
                                                                )
                                                            }
                                                            className={timeInputClassName}
                                                        />

                                                        <span className="text-white/20">
                                                            →
                                                        </span>

                                                        <input
                                                            type="time"
                                                            value={
                                                                hours.close
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateDay(
                                                                    day,
                                                                    {
                                                                        close:
                                                                        event.target.value,
                                                                    }
                                                                )
                                                            }
                                                            className={timeInputClassName}
                                                        />
                                                    </div>
                                                )}


                                                {hours.is24Hours && (
                                                    <span className="text-xs text-white/30">
                                                        Open all day
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-xs text-white/25">
                                                Closed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>


            <div className="grid gap-6 sm:grid-cols-2">

                <Field label="Instagram">
                    <input
                        value={
                            form.instagram
                        }
                        onChange={(
                            event
                        ) =>
                            updateField(
                                "instagram",
                                event.target
                                    .value
                            )
                        }
                        placeholder="@yourcafe"
                        className={
                            inputClassName
                        }
                    />
                </Field>


                <Field label="Website">
                    <input
                        value={
                            form.website
                        }
                        onChange={(
                            event
                        ) =>
                            updateField(
                                "website",
                                event.target
                                    .value
                            )
                        }
                        placeholder="https://..."
                        className={
                            inputClassName
                        }
                    />
                </Field>
            </div>


            <Field label="Tell people about your café">
                <textarea
                    value={
                        form.description
                    }
                    onChange={(
                        event
                    ) =>
                        updateField(
                            "description",
                            event.target
                                .value
                        )
                    }
                    rows={7}
                    maxLength={500}
                    placeholder="What kind of atmosphere can people expect? What makes your café different?"
                    className={`${inputClassName} min-h-[180px] resize-none py-4`}
                />

                <div className="mt-2 text-right font-mono text-[9px] text-white/20">
                    {
                        form.description
                            .length
                    }
                    /500
                </div>
            </Field>
        </div>
    );
}


/* =========================================================
   STEP 04
========================================================= */

function CafePhotosStep({
                            coverImage,
                            setCoverImage,
                            galleryImages,
                            setGalleryImages,
                        }: {
    coverImage: File | null;

    setCoverImage: (
        file: File | null
    ) => void;

    galleryImages: File[];

    setGalleryImages: (
        files: File[]
    ) => void;
}) {
    function handleGalleryFiles(
        files: FileList | null
    ) {
        if (!files) {
            return;
        }

        const selected =
            Array.from(
                files
            ).slice(
                0,
                5
            );

        setGalleryImages(
            selected
        );
    }


    return (
        <div className="grid gap-7">

            <div className="relative overflow-hidden rounded-[28px] border border-dashed border-white/[0.12] bg-white/[0.018] p-8 text-center transition hover:border-[#b8ff65]/25 hover:bg-[#b8ff65]/[0.02] sm:p-12">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-white/45">
                    <PhotoIcon />
                </div>

                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">
                    Add a cover photo
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/32">
                    Choose a photo that
                    shows what visiting
                    your café actually
                    feels like.
                </p>

                <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-3 text-xs font-medium text-white/60 transition hover:border-white/[0.2] hover:bg-white/[0.07] hover:text-white">
                    Choose image

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(
                            event
                        ) =>
                            setCoverImage(
                                event.target
                                    .files?.[0] ??
                                null
                            )
                        }
                    />
                </label>

                {coverImage && (
                    <p className="mt-4 font-mono text-[10px] text-[#b8ff65]">
                        {
                            coverImage.name
                        }
                    </p>
                )}
            </div>


            <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.018] p-6 sm:p-8">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <p className="text-sm font-semibold">
                            Gallery photos
                        </p>

                        <p className="mt-2 text-xs leading-5 text-white/30">
                            Add up to five
                            additional photos.
                        </p>
                    </div>


                    <label className="inline-flex h-10 w-fit cursor-pointer items-center rounded-full border border-white/[0.1] px-4 text-[10px] font-medium text-white/50 transition hover:border-[#b8ff65]/30 hover:text-[#b8ff65]">
                        Add gallery images

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            className="hidden"
                            onChange={(
                                event
                            ) =>
                                handleGalleryFiles(
                                    event.target
                                        .files
                                )
                            }
                        />
                    </label>
                </div>


                {galleryImages.length >
                0 ? (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {galleryImages.map(
                            (
                                image,
                                index
                            ) => (
                                <div
                                    key={`${image.name}-${index}`}
                                    className="flex items-center justify-between gap-4 rounded-[16px] border border-white/[0.07] bg-white/[0.02] px-4 py-3"
                                >
                                    <span className="min-w-0 truncate text-xs text-white/45">
                                        {
                                            image.name
                                        }
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setGalleryImages(
                                                galleryImages.filter(
                                                    (
                                                        _,
                                                        targetIndex
                                                    ) =>
                                                        targetIndex !==
                                                        index
                                                )
                                            )
                                        }
                                        className="shrink-0 text-[10px] text-white/25 transition hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <p className="mt-6 text-xs text-white/20">
                        No gallery photos
                        selected.
                    </p>
                )}


                <p className="mt-4 font-mono text-[9px] text-white/20">
                    {
                        galleryImages.length
                    }
                    /5 selected
                </p>
            </div>
        </div>
    );
}


/* =========================================================
   STEP 05
========================================================= */

function OwnerStep({
                       form,
                       updateField,
                   }: StepProps) {
    return (
        <div className="grid gap-6">

            <Field
                label="Your name"
                required
            >
                <input
                    value={
                        form.ownerName
                    }
                    onChange={(
                        event
                    ) =>
                        updateField(
                            "ownerName",
                            event.target
                                .value
                        )
                    }
                    placeholder="Full name"
                    className={
                        inputClassName
                    }
                />
            </Field>


            <Field
                label="Email"
                required
            >
                <input
                    type="email"
                    value={
                        form.email
                    }
                    onChange={(
                        event
                    ) =>
                        updateField(
                            "email",
                            event.target
                                .value
                        )
                    }
                    placeholder="you@example.com"
                    className={
                        inputClassName
                    }
                />
            </Field>


            <Field
                label="Password"
                required
            >
                <input
                    type="password"
                    value={
                        form.password
                    }
                    onChange={(
                        event
                    ) =>
                        updateField(
                            "password",
                            event.target
                                .value
                        )
                    }
                    placeholder="Minimum 8 characters"
                    className={
                        inputClassName
                    }
                />
            </Field>


            <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.018] p-5">
                <div className="flex items-start gap-3">

                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#b8ff65]/10 text-[#b8ff65]">
                        ✓
                    </div>

                    <p className="text-sm leading-6 text-white/38">
                        By continuing, you
                        confirm that
                        you&apos;re
                        authorized to submit
                        and manage this
                        café&apos;s
                        information.
                    </p>
                </div>
            </div>
        </div>
    );
}


/* =========================================================
   SUCCESS
========================================================= */

function SuccessState({
                          cafe,
                      }: {
    cafe: RegisteredCafeApiResponse;
}) {
    return (
        <div className="py-10 text-center sm:py-16">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#b8ff65]/25 bg-[#b8ff65]/10 text-2xl text-[#b8ff65]">
                ✓
            </div>

            <p className="mt-7 text-[10px] uppercase tracking-[0.25em] text-[#b8ff65]">
                Café created
            </p>

            <h2 className="mx-auto mt-4 max-w-lg text-4xl font-semibold leading-tight tracking-[-0.05em]">
                {cafe.name} is now
                on Tuntunan.
            </h2>

            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/35">
                Your café registration
                was successfully saved.
                You can now view it in
                the registered café
                directory.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

                <Link
                    href={`/cafes/${cafe.slug}`}
                    className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#b8ff65] px-6 text-sm font-semibold text-black transition hover:bg-[#c5ff7e]"
                >
                    View café

                    <span className="transition-transform group-hover:translate-x-1">
                        →
                    </span>
                </Link>


                <Link
                    href="/cafes"
                    className="inline-flex h-12 items-center rounded-full border border-white/[0.1] px-6 text-sm text-white/45 transition hover:border-white/20 hover:text-white"
                >
                    Registered cafés
                </Link>
            </div>
        </div>
    );
}


/* =========================================================
   BACKEND PAYLOAD
========================================================= */

function buildRegistrationPayload(
    form: SignupForm
): CafeRegistrationPayload {
    return {
        cafe_name:
            form.cafeName.trim(),

        city:
            form.city.trim(),

        area:
            form.area.trim() ||
            null,

        address:
            form.address.trim(),

        latitude:
        form.latitude,

        longitude:
        form.longitude,

        amenities: {
            wifi:
            form.wifi,

            outlets:
            form.outlets,

            outdoor_seating:
            form.outdoorSeating,

            work_friendly:
            form.workFriendly,

            pet_friendly:
            form.petFriendly,

            wheelchair_accessible:
            form.wheelchairAccessible,
        },

        opening_hours:
            convertOpeningHours(
                form.openingHours
            ),

        instagram:
            form.instagram.trim() ||
            null,

        website:
            form.website.trim() ||
            null,

        description:
            form.description.trim() ||
            null,

        owner_name:
            form.ownerName.trim(),

        owner_email:
            form.email.trim(),

        password:
        form.password,
    };
}


function convertOpeningHours(
    hours: OpeningHours
): CafeRegistrationPayload["opening_hours"] {
    return {
        monday:
            convertDayHours(
                hours.monday
            ),

        tuesday:
            convertDayHours(
                hours.tuesday
            ),

        wednesday:
            convertDayHours(
                hours.wednesday
            ),

        thursday:
            convertDayHours(
                hours.thursday
            ),

        friday:
            convertDayHours(
                hours.friday
            ),

        saturday:
            convertDayHours(
                hours.saturday
            ),

        sunday:
            convertDayHours(
                hours.sunday
            ),
    };
}


function convertDayHours(
    hours: DayHours
) {
    return {
        enabled:
        hours.enabled,

        open:
        hours.open,

        close:
        hours.close,

        is_24_hours:
        hours.is24Hours,
    };
}


/* =========================================================
   VALIDATION
========================================================= */

function validateStep(
    step: Step,
    form: SignupForm
): string | null {
    if (step === 1) {
        if (
            form.cafeName
                .trim()
                .length < 2
        ) {
            return "Please enter your café name.";
        }

        if (
            form.city
                .trim()
                .length < 2
        ) {
            return "Please enter the city.";
        }

        if (
            form.address
                .trim()
                .length < 3
        ) {
            return "Please enter the café's full address.";
        }

        if (
            form.latitude ===
            null ||
            form.longitude ===
            null
        ) {
            return "Please select the café's exact location.";
        }
    }


    if (step === 5) {
        if (
            form.ownerName
                .trim()
                .length < 2
        ) {
            return "Please enter your name.";
        }

        if (
            !isValidEmail(
                form.email
            )
        ) {
            return "Please enter a valid email address.";
        }

        if (
            form.password.length <
            8
        ) {
            return "Password must contain at least 8 characters.";
        }
    }

    return null;
}


function isValidEmail(
    email: string
): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
    );
}


/* =========================================================
   SHARED UI
========================================================= */

interface StepProps {
    form: SignupForm;

    updateField: <
        K extends keyof SignupForm
    >(
        field: K,
        value: SignupForm[K]
    ) => void;
}


function Field({
                   label,
                   required = false,
                   children,
               }: {
    label: string;
    required?: boolean;
    children:
        React.ReactNode;
}) {
    return (
        <label className="block">

            <span className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-white/32">
                {label}

                {required && (
                    <span className="ml-1 text-[#b8ff65]">
                        *
                    </span>
                )}
            </span>

            {children}
        </label>
    );
}


function Feature({
                     icon,
                     title,
                     text,
                 }: {
    icon: React.ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="bg-[#0d0d0d] p-6">

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-[#b8ff65]">
                {icon}
            </div>

            <h2 className="mt-5 text-sm font-semibold">
                {title}
            </h2>

            <p className="mt-2 text-xs leading-5 text-white/30">
                {text}
            </p>
        </div>
    );
}


const inputClassName =
    "h-14 w-full rounded-[18px] border border-white/[0.08] bg-white/[0.025] px-5 text-sm text-white outline-none transition placeholder:text-white/18 hover:border-white/[0.14] focus:border-[#b8ff65]/40 focus:bg-[#b8ff65]/[0.025]";


const timeInputClassName =
    "h-11 rounded-[14px] border border-white/[0.08] bg-[#111] px-4 text-xs text-white outline-none transition hover:border-white/[0.16] focus:border-[#b8ff65]/40 [color-scheme:dark]";




/* =========================================================
   ICONS
========================================================= */

function CompassIcon() {
    return (
        <svg
            width="18"
            height="18"
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
                r="8"
            />

            <path d="M15.5 8.5L13.5 13.5L8.5 15.5L10.5 10.5L15.5 8.5Z" />
        </svg>
    );
}


function PhotoIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
            />

            <circle
                cx="8.5"
                cy="10"
                r="1.5"
            />

            <path d="M4 17L9 12L13 16L16 13L20 17" />
        </svg>
    );
}


function CoffeeIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 8H17V13C17 16.3 14.3 19 11 19C7.7 19 5 16.3 5 13V8Z" />

            <path d="M17 10H19C20.1 10 21 10.9 21 12V13C21 14.7 19.7 16 18 16H17" />

            <path d="M8 4V5" />

            <path d="M11 3V5" />

            <path d="M14 4V5" />
        </svg>
    );
}


function MapIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M9 18L3 21V6L9 3L15 6L21 3V18L15 21L9 18Z" />

            <path d="M9 3V18" />

            <path d="M15 6V21" />
        </svg>
    );
}


function WifiIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M5 10C9 6.5 15 6.5 19 10" />

            <path d="M8 13C10.3 11 13.7 11 16 13" />

            <path d="M11 16C11.7 15.4 12.3 15.4 13 16" />
        </svg>
    );
}


function PowerIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M8 3V9" />

            <path d="M16 3V9" />

            <path d="M6 8H18V11C18 14.3 15.3 17 12 17C8.7 17 6 14.3 6 11V8Z" />

            <path d="M12 17V21" />
        </svg>
    );
}


function LaptopIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect
                x="5"
                y="5"
                width="14"
                height="10"
                rx="1"
            />

            <path d="M3 19H21" />

            <path d="M8 15L7 19" />

            <path d="M16 15L17 19" />
        </svg>
    );
}


function OutdoorIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 11H20" />

            <path d="M6 11L12 4L18 11" />

            <path d="M12 11V21" />

            <path d="M8 21H16" />
        </svg>
    );
}


function PetIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle
                cx="7"
                cy="8"
                r="2"
            />

            <circle
                cx="17"
                cy="8"
                r="2"
            />

            <circle
                cx="5"
                cy="13"
                r="1.5"
            />

            <circle
                cx="19"
                cy="13"
                r="1.5"
            />

            <path d="M8 17C8 14.8 9.8 13 12 13C14.2 13 16 14.8 16 17C16 18.7 14.7 20 13 20H11C9.3 20 8 18.7 8 17Z" />
        </svg>
    );
}


function AccessibilityIcon() {
    return (
        <svg
            width="18"
            height="18"
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
                cy="4.5"
                r="1.5"
            />

            <path d="M7 8H17" />

            <path d="M12 8V14" />

            <path d="M9 21L12 14L15 21" />

            <path d="M8 11L5 16" />

            <path d="M16 11L19 16" />
        </svg>
    );
}