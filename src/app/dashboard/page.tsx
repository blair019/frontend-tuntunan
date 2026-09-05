"use client";

import Link from "next/link";
import { BackgroundEffects } from "@/src/components/BackgroundEffects"

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    getRegisteredCafe,
    updateRegisteredCafe,
    type RegisteredCafeApiResponse,
    type RegisteredCafeDayHours,
    type RegisteredCafeOpeningHours,
    type RegisteredCafeUpdatePayload,
} from "@/src/features/cafes/api/registered-cafes.api";


interface OwnerSession {
    cafeId: number;
    slug: string;
    cafeName: string;

    ownerName: string;
    ownerEmail: string;

    status: string;
}


type DashboardSection =
    | "overview"
    | "details"
    | "amenities"
    | "hours";


interface EditableCafe {
    name: string;

    city: string;
    area: string;

    address: string;

    latitude: number | null;
    longitude: number | null;

    description: string;

    instagram: string;
    website: string;

    wifi: boolean;
    outlets: boolean;
    outdoorSeating: boolean;
    workFriendly: boolean;
    petFriendly: boolean;
    wheelchairAccessible: boolean;

    openingHours:
        RegisteredCafeOpeningHours;
}


export default function DashboardPage() {
    const router =
        useRouter();


    const [
        owner,
        setOwner,
    ] =
        useState<OwnerSession | null>(
            null
        );


    const [
        cafe,
        setCafe,
    ] =
        useState<RegisteredCafeApiResponse | null>(
            null
        );


    const [
        form,
        setForm,
    ] =
        useState<EditableCafe | null>(
            null
        );


    const [
        activeSection,
        setActiveSection,
    ] =
        useState<DashboardSection>(
            "overview"
        );


    const [
        isLoading,
        setIsLoading,
    ] =
        useState(true);


    const [
        isSaving,
        setIsSaving,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );


    const [
        successMessage,
        setSuccessMessage,
    ] =
        useState<string | null>(
            null
        );


    /*
     * Snapshot of the last data
     * successfully loaded/saved.
     *
     * Used for unsaved-change detection.
     */
    const [
        savedForm,
        setSavedForm,
    ] =
        useState<EditableCafe | null>(
            null
        );


    /* =========================================================
       LOAD SESSION
    ========================================================= */

    useEffect(() => {
        const storedOwner =
            localStorage.getItem(
                "tuntunan_owner"
            );


        if (!storedOwner) {
            router.replace(
                "/login"
            );

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


            loadCafe(
                parsedOwner
            );

        } catch {
            localStorage.removeItem(
                "tuntunan_owner"
            );

            router.replace(
                "/login"
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);


    /* =========================================================
       LOAD CAFE
    ========================================================= */

    async function loadCafe(
        session: OwnerSession
    ) {
        setIsLoading(true);
        setError(null);


        try {
            const response =
                await getRegisteredCafe(
                    session.slug
                );


            const editable =
                mapCafeToEditable(
                    response
                );


            setCafe(
                response
            );

            setForm(
                editable
            );

            setSavedForm(
                editable
            );

        } catch (loadError) {
            console.error(
                "Failed to load café:",
                loadError
            );


            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Unable to load your café."
            );

        } finally {
            setIsLoading(
                false
            );
        }
    }


    /* =========================================================
       UNSAVED CHANGES
    ========================================================= */

    const hasUnsavedChanges =
        useMemo(
            () => {
                if (
                    !form ||
                    !savedForm
                ) {
                    return false;
                }


                return (
                    JSON.stringify(
                        form
                    ) !==
                    JSON.stringify(
                        savedForm
                    )
                );
            },
            [
                form,
                savedForm,
            ]
        );


    /* =========================================================
       UPDATE FIELD
    ========================================================= */

    function updateField<
        K extends keyof EditableCafe
    >(
        field: K,
        value: EditableCafe[K]
    ) {
        setForm(
            (current) => {
                if (!current) {
                    return current;
                }


                return {
                    ...current,
                    [field]:
                    value,
                };
            }
        );


        setSuccessMessage(
            null
        );
    }


    /* =========================================================
       SAVE
    ========================================================= */

    async function handleSave() {
        if (
            !owner ||
            !form
        ) {
            return;
        }


        setError(null);
        setSuccessMessage(null);


        const validationError =
            validateForm(
                form
            );


        if (validationError) {
            setError(
                validationError
            );

            return;
        }


        const payload:
            RegisteredCafeUpdatePayload =
            {
                name:
                    form.name.trim(),

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

                description:
                    form.description.trim() ||
                    null,

                instagram:
                    form.instagram.trim() ||
                    null,

                website:
                    form.website.trim() ||
                    null,

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
                form.openingHours,
            };


        try {
            setIsSaving(
                true
            );


            const updatedCafe =
                await updateRegisteredCafe(
                    owner.cafeId,
                    payload
                );


            const updatedForm =
                mapCafeToEditable(
                    updatedCafe
                );


            setCafe(
                updatedCafe
            );

            setForm(
                updatedForm
            );

            setSavedForm(
                updatedForm
            );


            /*
             * Keep local session display name
             * synchronized.
             */
            const updatedOwner: OwnerSession =
                {
                    ...owner,

                    cafeName:
                    updatedCafe.name,
                };


            setOwner(
                updatedOwner
            );


            localStorage.setItem(
                "tuntunan_owner",
                JSON.stringify(
                    updatedOwner
                )
            );


            setSuccessMessage(
                "Your café information has been updated."
            );

        } catch (saveError) {
            console.error(
                "Failed to save café:",
                saveError
            );


            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "Unable to save your changes."
            );

        } finally {
            setIsSaving(
                false
            );
        }
    }


    /* =========================================================
       RESET
    ========================================================= */

    function handleDiscardChanges() {
        if (!savedForm) {
            return;
        }


        setForm(
            cloneEditableCafe(
                savedForm
            )
        );


        setError(null);
        setSuccessMessage(null);
    }


    /* =========================================================
       LOGOUT
    ========================================================= */

    function handleLogout() {
        localStorage.removeItem(
            "tuntunan_owner"
        );


        router.push(
            "/login"
        );


        router.refresh();
    }


    /* =========================================================
       LOADING
    ========================================================= */

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#080808] text-white">

                <div className="text-center">

                    <span className="mx-auto block h-2.5 w-2.5 animate-pulse rounded-full bg-[#b8ff65]" />


                    <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-white/30">
                        Loading dashboard
                    </p>

                </div>

            </main>
        );
    }


    if (
        !owner ||
        !form
    ) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 text-white">

                <div className="max-w-md text-center">

                    <p className="text-sm text-white/40">
                        {error ??
                            "Unable to load your café."}
                    </p>


                    <Link
                        href="/login"
                        className="mt-6 inline-flex h-11 items-center rounded-full bg-[#b8ff65] px-5 text-xs font-semibold text-black"
                    >
                        Back to login
                    </Link>

                </div>

            </main>
        );
    }


    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white">

            <BackgroundEffects />


            <div className="relative z-10">

                <DashboardHeader
                    owner={owner}
                    hasUnsavedChanges={
                        hasUnsavedChanges
                    }
                    onSave={
                        handleSave
                    }
                    isSaving={
                        isSaving
                    }
                    onLogout={
                        handleLogout
                    }
                />


                <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pt-14">


                    {/* =====================================================
                        TOP
                    ===================================================== */}

                    <section className="border-b border-white/[0.08] pb-12">

                        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

                            <div>

                                <div className="flex items-center gap-3">

                                    <span className="h-2 w-2 rounded-full bg-[#b8ff65]" />


                                    <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/35">
                                        Café owner dashboard
                                    </span>

                                </div>


                                <h1 className="mt-6 text-[clamp(3.5rem,6vw,7rem)] font-semibold leading-[0.88] tracking-[-0.065em]">

                                    {form.name}

                                    <span className="block text-white/25">
                                        Your space.
                                    </span>

                                </h1>

                            </div>


                            <div className="max-w-lg">

                                <p className="text-sm leading-7 text-white/38">
                                    Keep your café information
                                    accurate so people know what
                                    to expect before they visit.
                                </p>


                                <div className="mt-6 flex flex-wrap items-center gap-3">

                                    <StatusBadge
                                        status={
                                            owner.status
                                        }
                                    />


                                    <Link
                                        href={`/cafes/${owner.slug}`}
                                        target="_blank"
                                        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.09] px-4 text-[10px] text-white/40 transition hover:border-white/20 hover:text-white"
                                    >
                                        View public page

                                        <span>
                                            ↗
                                        </span>
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </section>



                    {/* =====================================================
                        DASHBOARD
                    ===================================================== */}

                    <section className="grid gap-8 pt-10 lg:grid-cols-[260px_minmax(0,1fr)]">


                        {/* =================================================
                            SIDEBAR
                        ================================================= */}

                        <aside>

                            <div className="sticky top-8">

                                <p className="mb-4 text-[9px] uppercase tracking-[0.2em] text-white/20">
                                    Manage café
                                </p>


                                <nav className="grid gap-1">

                                    <DashboardNavButton
                                        active={
                                            activeSection ===
                                            "overview"
                                        }
                                        number="01"
                                        label="Overview"
                                        onClick={() =>
                                            setActiveSection(
                                                "overview"
                                            )
                                        }
                                    />


                                    <DashboardNavButton
                                        active={
                                            activeSection ===
                                            "details"
                                        }
                                        number="02"
                                        label="Cafe details"
                                        onClick={() =>
                                            setActiveSection(
                                                "details"
                                            )
                                        }
                                    />


                                    <DashboardNavButton
                                        active={
                                            activeSection ===
                                            "amenities"
                                        }
                                        number="03"
                                        label="Amenities"
                                        onClick={() =>
                                            setActiveSection(
                                                "amenities"
                                            )
                                        }
                                    />


                                    <DashboardNavButton
                                        active={
                                            activeSection ===
                                            "hours"
                                        }
                                        number="04"
                                        label="Opening hours"
                                        onClick={() =>
                                            setActiveSection(
                                                "hours"
                                            )
                                        }
                                    />

                                </nav>


                                <div className="mt-8 border-t border-white/[0.07] pt-6">

                                    <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
                                        Owner
                                    </p>


                                    <p className="mt-3 text-sm text-white/60">
                                        {owner.ownerName}
                                    </p>


                                    <p className="mt-1 break-all text-xs text-white/25">
                                        {owner.ownerEmail}
                                    </p>

                                </div>

                            </div>

                        </aside>



                        {/* =================================================
                            CONTENT
                        ================================================= */}

                        <div>

                            {error && (
                                <Message
                                    type="error"
                                    message={
                                        error
                                    }
                                />
                            )}


                            {successMessage && (
                                <Message
                                    type="success"
                                    message={
                                        successMessage
                                    }
                                />
                            )}


                            {hasUnsavedChanges && (
                                <UnsavedChangesBar
                                    onSave={
                                        handleSave
                                    }
                                    onDiscard={
                                        handleDiscardChanges
                                    }
                                    isSaving={
                                        isSaving
                                    }
                                />
                            )}



                            {/* =============================================
                                OVERVIEW
                            ============================================= */}

                            {activeSection ===
                                "overview" && (
                                    <OverviewSection
                                        owner={
                                            owner
                                        }
                                        cafe={
                                            cafe
                                        }
                                        form={
                                            form
                                        }
                                        onSectionChange={
                                            setActiveSection
                                        }
                                    />
                                )}



                            {/* =============================================
                                DETAILS
                            ============================================= */}

                            {activeSection ===
                                "details" && (
                                    <DetailsSection
                                        form={
                                            form
                                        }
                                        updateField={
                                            updateField
                                        }
                                    />
                                )}



                            {/* =============================================
                                AMENITIES
                            ============================================= */}

                            {activeSection ===
                                "amenities" && (
                                    <AmenitiesSection
                                        form={
                                            form
                                        }
                                        updateField={
                                            updateField
                                        }
                                    />
                                )}



                            {/* =============================================
                                HOURS
                            ============================================= */}

                            {activeSection ===
                                "hours" && (
                                    <OpeningHoursSection
                                        openingHours={
                                            form.openingHours
                                        }
                                        onChange={(
                                            openingHours
                                        ) =>
                                            updateField(
                                                "openingHours",
                                                openingHours
                                            )
                                        }
                                    />
                                )}


                            {/* =================================================
                                BOTTOM SAVE
                            ================================================= */}

                            {activeSection !==
                                "overview" && (
                                    <div className="mt-8 flex flex-col gap-4 rounded-[26px] border border-white/[0.08] bg-[#0d0d0d] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                                        <div>

                                            <p className="text-xs font-medium text-white/60">
                                                {hasUnsavedChanges
                                                    ? "You have unsaved changes."
                                                    : "Everything is up to date."}
                                            </p>


                                            <p className="mt-1 text-[10px] text-white/25">
                                                Changes appear on your public café page after saving.
                                            </p>

                                        </div>


                                        <div className="flex gap-3">

                                            {hasUnsavedChanges && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleDiscardChanges
                                                    }
                                                    disabled={
                                                        isSaving
                                                    }
                                                    className="inline-flex h-11 cursor-pointer items-center rounded-full border border-white/[0.1] px-5 text-xs text-white/40 transition hover:border-white/20 hover:text-white disabled:opacity-40"
                                                >
                                                    Discard
                                                </button>
                                            )}


                                            <button
                                                type="button"
                                                onClick={
                                                    handleSave
                                                }
                                                disabled={
                                                    !hasUnsavedChanges ||
                                                    isSaving
                                                }
                                                className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-[#b8ff65] px-5 text-xs font-semibold text-black transition hover:bg-[#c5ff7e] disabled:cursor-not-allowed disabled:opacity-35"
                                            >
                                                {isSaving
                                                    ? "Saving..."
                                                    : "Save changes"}

                                                {!isSaving && (
                                                    <span>
                                                    →
                                                </span>
                                                )}
                                            </button>

                                        </div>

                                    </div>
                                )}

                        </div>

                    </section>

                </div>

            </div>

        </main>
    );
}


/* =========================================================
   OVERVIEW
========================================================= */

function OverviewSection({
                             owner,
                             cafe,
                             form,
                             onSectionChange,
                         }: {
    owner: OwnerSession;

    cafe:
        RegisteredCafeApiResponse | null;

    form: EditableCafe;

    onSectionChange: (
        section: DashboardSection
    ) => void;
}) {
    const enabledAmenities =
        [
            form.wifi,
            form.outlets,
            form.workFriendly,
            form.outdoorSeating,
            form.petFriendly,
            form.wheelchairAccessible,
        ].filter(Boolean).length;


    return (
        <div>

            <SectionHeading
                eyebrow="Overview"
                title="Your café at a glance."
                description="Jump into any section to keep your listing accurate."
            />


            <div className="mt-8 grid gap-px overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.08] md:grid-cols-2">

                <OverviewCard
                    number="01"
                    title="Cafe details"
                    value={
                        form.city
                    }
                    text={
                        form.area ||
                        form.address
                    }
                    buttonText="Edit details"
                    onClick={() =>
                        onSectionChange(
                            "details"
                        )
                    }
                />


                <OverviewCard
                    number="02"
                    title="Amenities"
                    value={`${enabledAmenities}/6`}
                    text="Amenities currently enabled."
                    buttonText="Edit amenities"
                    onClick={() =>
                        onSectionChange(
                            "amenities"
                        )
                    }
                />


                <OverviewCard
                    number="03"
                    title="Opening hours"
                    value={
                        getTodayHoursLabel(
                            form.openingHours
                        )
                    }
                    text="Today's current schedule."
                    buttonText="Edit hours"
                    onClick={() =>
                        onSectionChange(
                            "hours"
                        )
                    }
                />


                <OverviewCard
                    number="04"
                    title="Public listing"
                    value={
                        owner.status
                    }
                    text="Your café is visible in the registered café directory."
                    href={`/cafes/${owner.slug}`}
                    buttonText="View listing"
                />

            </div>


            {cafe?.cover_image_url && (
                <div className="mt-5 overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0d0d0d]">

                    <div className="grid lg:grid-cols-[0.65fr_1.35fr]">

                        <div className="p-7 sm:p-8">

                            <span className="text-[9px] uppercase tracking-[0.2em] text-[#b8ff65]">
                                Current cover
                            </span>


                            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">
                                The first thing people see.
                            </h3>


                            <p className="mt-4 max-w-md text-sm leading-6 text-white/30">
                                Photo management will be the next dashboard feature.
                            </p>

                        </div>


                        <div className="min-h-[300px]">

                            <img
                                src={
                                    getCafeImageUrl(
                                        cafe.cover_image_url
                                    )
                                }
                                alt={
                                    form.name
                                }
                                className="h-full w-full object-cover"
                            />

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}


/* =========================================================
   DETAILS
========================================================= */

function DetailsSection({
                            form,
                            updateField,
                        }: {
    form: EditableCafe;

    updateField: <
        K extends keyof EditableCafe
    >(
        field: K,
        value: EditableCafe[K]
    ) => void;
}) {
    return (
        <div>

            <SectionHeading
                eyebrow="Cafe details"
                title="Keep the basics accurate."
                description="These details appear on your public café listing."
            />


            <div className="mt-8 rounded-[30px] border border-white/[0.08] bg-[#0d0d0d] p-6 sm:p-8">

                <div className="grid gap-6">

                    <Field
                        label="Cafe name"
                        required
                    >
                        <input
                            value={
                                form.name
                            }
                            onChange={(
                                event
                            ) =>
                                updateField(
                                    "name",
                                    event.target.value
                                )
                            }
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
                                        event.target.value
                                    )
                                }
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
                                        event.target.value
                                    )
                                }
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
                                    event.target.value
                                )
                            }
                            rows={4}
                            className={`${inputClassName} min-h-[120px] resize-none py-4`}
                        />
                    </Field>


                    <Field label="Description">
                        <textarea
                            value={
                                form.description
                            }
                            onChange={(
                                event
                            ) =>
                                updateField(
                                    "description",
                                    event.target.value
                                )
                            }
                            maxLength={
                                500
                            }
                            rows={7}
                            className={`${inputClassName} min-h-[180px] resize-none py-4`}
                        />

                        <p className="mt-2 text-right font-mono text-[9px] text-white/20">
                            {
                                form.description
                                    .length
                            }
                            /500
                        </p>

                    </Field>


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
                                        event.target.value
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
                                        event.target.value
                                    )
                                }
                                placeholder="https://..."
                                className={
                                    inputClassName
                                }
                            />
                        </Field>

                    </div>


                    <div className="grid gap-6 sm:grid-cols-2">

                        <Field label="Latitude">
                            <input
                                type="number"
                                step="any"
                                value={
                                    form.latitude ??
                                    ""
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "latitude",
                                        event.target.value
                                            ? Number(
                                                event.target.value
                                            )
                                            : null
                                    )
                                }
                                className={
                                    inputClassName
                                }
                            />
                        </Field>


                        <Field label="Longitude">
                            <input
                                type="number"
                                step="any"
                                value={
                                    form.longitude ??
                                    ""
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "longitude",
                                        event.target.value
                                            ? Number(
                                                event.target.value
                                            )
                                            : null
                                    )
                                }
                                className={
                                    inputClassName
                                }
                            />
                        </Field>

                    </div>

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   AMENITIES
========================================================= */

function AmenitiesSection({
                              form,
                              updateField,
                          }: {
    form: EditableCafe;

    updateField: <
        K extends keyof EditableCafe
    >(
        field: K,
        value: EditableCafe[K]
    ) => void;
}) {
    const options = [
        {
            field:
                "wifi" as const,
            title:
                "Wi-Fi",
            description:
                "Internet access available to customers.",
        },

        {
            field:
                "outlets" as const,
            title:
                "Power outlets",
            description:
                "Customers can charge laptops and devices.",
        },

        {
            field:
                "workFriendly" as const,
            title:
                "Work friendly",
            description:
                "Suitable for studying, coding, or remote work.",
        },

        {
            field:
                "outdoorSeating" as const,
            title:
                "Outdoor seating",
            description:
                "Outdoor tables or seating are available.",
        },

        {
            field:
                "petFriendly" as const,
            title:
                "Pet friendly",
            description:
                "Pets are welcome at the café.",
        },

        {
            field:
                "wheelchairAccessible" as const,
            title:
                "Wheelchair accessible",
            description:
                "Accessible entry and seating are available.",
        },
    ];


    return (
        <div>

            <SectionHeading
                eyebrow="Amenities"
                title="What can visitors expect?"
                description="Practical details help people find cafés that actually fit what they need."
            />


            <div className="mt-8 grid gap-3 sm:grid-cols-2">

                {options.map(
                    (
                        option
                    ) => {
                        const enabled =
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
                                        !enabled
                                    )
                                }
                                className={[
                                    "group min-h-[190px] rounded-[24px] border p-6 text-left transition duration-300",
                                    enabled
                                        ? "border-[#b8ff65]/30 bg-[#b8ff65]/[0.055]"
                                        : "border-white/[0.08] bg-[#0d0d0d] hover:border-white/[0.16]",
                                ].join(
                                    " "
                                )}
                            >

                                <div className="flex items-start justify-between gap-5">

                                    <span
                                        className={[
                                            "text-[9px] uppercase tracking-[0.18em]",
                                            enabled
                                                ? "text-[#b8ff65]"
                                                : "text-white/20",
                                        ].join(
                                            " "
                                        )}
                                    >
                                        {enabled
                                            ? "Enabled"
                                            : "Not enabled"}
                                    </span>


                                    <span
                                        className={[
                                            "flex h-6 w-6 items-center justify-center rounded-full border text-[10px]",
                                            enabled
                                                ? "border-[#b8ff65] bg-[#b8ff65] text-black"
                                                : "border-white/15 text-transparent",
                                        ].join(
                                            " "
                                        )}
                                    >
                                        ✓
                                    </span>

                                </div>


                                <h3 className="mt-10 text-xl font-semibold tracking-[-0.03em] transition group-hover:text-[#b8ff65]">
                                    {
                                        option.title
                                    }
                                </h3>


                                <p className="mt-3 max-w-sm text-xs leading-5 text-white/30">
                                    {
                                        option.description
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
   OPENING HOURS
========================================================= */

function OpeningHoursSection({
                                 openingHours,
                                 onChange,
                             }: {
    openingHours:
        RegisteredCafeOpeningHours;

    onChange: (
        openingHours:
        RegisteredCafeOpeningHours
    ) => void;
}) {
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
        keyof RegisteredCafeOpeningHours;


    function updateDay(
        day: DayKey,
        changes:
        Partial<RegisteredCafeDayHours>
    ) {
        onChange({
            ...openingHours,

            [day]: {
                ...openingHours[
                    day
                    ],

                ...changes,
            },
        });
    }


    function copyMondayToAll() {
        const monday = {
            ...openingHours.monday,
        };


        onChange({
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
        });
    }


    return (
        <div>

            <SectionHeading
                eyebrow="Opening hours"
                title="When should people visit?"
                description="Keep your operating hours current so visitors aren't sent to a closed café."
            />


            <div className="mt-8 overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0d0d0d]">

                <div className="flex flex-col gap-4 border-b border-white/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <p className="text-sm font-medium">
                            Weekly schedule
                        </p>


                        <p className="mt-1 text-xs text-white/25">
                            Configure each day individually.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            copyMondayToAll
                        }
                        className="inline-flex h-10 w-fit cursor-pointer items-center rounded-full border border-white/[0.09] px-4 text-[10px] text-white/35 transition hover:border-[#b8ff65]/25 hover:text-[#b8ff65]"
                    >
                        Copy Monday to all
                    </button>

                </div>


                {days.map(
                    (
                        [
                            day,
                            label,
                        ],
                        index
                    ) => {
                        const hours =
                            openingHours[
                                day
                                ];


                        return (
                            <div
                                key={
                                    day
                                }
                                className={[
                                    "p-5 sm:p-6",
                                    index !==
                                    days.length -
                                    1
                                        ? "border-b border-white/[0.06]"
                                        : "",
                                ].join(
                                    " "
                                )}
                            >

                                <div className="flex flex-col gap-5 xl:flex-row xl:items-center">


                                    {/* DAY */}

                                    <div className="flex min-w-[160px] items-center gap-3">

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
                                                "flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border text-[10px]",
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
                                                            is_24_hours:
                                                                !hours.is_24_hours,
                                                        }
                                                    )
                                                }
                                                className={[
                                                    "inline-flex h-10 w-fit cursor-pointer items-center rounded-full border px-4 text-[10px] uppercase tracking-[0.12em] transition",
                                                    hours.is_24_hours
                                                        ? "border-[#b8ff65]/35 bg-[#b8ff65]/10 text-[#b8ff65]"
                                                        : "border-white/[0.08] text-white/30",
                                                ].join(
                                                    " "
                                                )}
                                            >
                                                24 hours
                                            </button>


                                            {!hours.is_24_hours ? (
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
                                                        className={
                                                            timeInputClassName
                                                        }
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
                                                        className={
                                                            timeInputClassName
                                                        }
                                                    />

                                                </div>
                                            ) : (
                                                <span className="text-xs text-white/30">
                                                    Open all day
                                                </span>
                                            )}

                                        </>
                                    ) : (
                                        <span className="text-xs text-white/20">
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
    );
}


/* =========================================================
   NAV
========================================================= */

function DashboardNavButton({
                                active,
                                number,
                                label,
                                onClick,
                            }: {
    active: boolean;
    number: string;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className={[
                "flex w-full cursor-pointer items-center justify-between rounded-[16px] px-4 py-3.5 text-left transition",
                active
                    ? "bg-[#b8ff65]/[0.08] text-[#b8ff65]"
                    : "text-white/35 hover:bg-white/[0.035] hover:text-white",
            ].join(
                " "
            )}
        >

            <span className="text-xs font-medium">
                {label}
            </span>


            <span
                className={[
                    "font-mono text-[9px]",
                    active
                        ? "text-[#b8ff65]/50"
                        : "text-white/15",
                ].join(
                    " "
                )}
            >
                {number}
            </span>

        </button>
    );
}


/* =========================================================
   OVERVIEW CARD
========================================================= */

function OverviewCard({
                          number,
                          title,
                          value,
                          text,
                          buttonText,
                          onClick,
                          href,
                      }: {
    number: string;
    title: string;
    value: string;
    text: string;
    buttonText: string;

    onClick?: () => void;

    href?: string;
}) {
    const content = (
        <>

            <div className="flex items-start justify-between gap-5">

                <span className="font-mono text-[9px] text-white/18">
                    {number}
                </span>


                <span className="text-[9px] uppercase tracking-[0.16em] text-white/18">
                    {title}
                </span>

            </div>


            <div className="mt-auto">

                <p className="text-2xl font-semibold tracking-[-0.04em] transition group-hover:text-[#b8ff65]">
                    {value}
                </p>


                <p className="mt-3 max-w-sm text-xs leading-5 text-white/28">
                    {text}
                </p>


                <span className="mt-6 inline-flex items-center gap-2 text-xs text-white/35 transition group-hover:text-white">

                    {buttonText}

                    <span className="transition-transform group-hover:translate-x-1">
                        →
                    </span>

                </span>

            </div>

        </>
    );


    if (href) {
        return (
            <Link
                href={href}
                className="group flex min-h-[260px] flex-col bg-[#0d0d0d] p-7 transition hover:bg-[#111]"
            >
                {content}
            </Link>
        );
    }


    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className="group flex min-h-[260px] cursor-pointer flex-col bg-[#0d0d0d] p-7 text-left transition hover:bg-[#111]"
        >
            {content}
        </button>
    );
}


/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
                            eyebrow,
                            title,
                            description,
                        }: {
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

                <span className="text-[10px] uppercase tracking-[0.22em] text-[#b8ff65]">
                    {eyebrow}
                </span>


                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                    {title}
                </h2>

            </div>


            <p className="max-w-md text-sm leading-6 text-white/30">
                {description}
            </p>

        </div>
    );
}


/* =========================================================
   FIELD
========================================================= */

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

            <span className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">

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


const inputClassName =
    "h-14 w-full rounded-[18px] border border-white/[0.08] bg-white/[0.025] px-5 text-sm text-white outline-none transition placeholder:text-white/18 hover:border-white/[0.14] focus:border-[#b8ff65]/40 focus:bg-[#b8ff65]/[0.025]";


const timeInputClassName =
    "h-11 rounded-[14px] border border-white/[0.08] bg-[#111] px-4 text-xs text-white outline-none transition hover:border-white/[0.16] focus:border-[#b8ff65]/40 [color-scheme:dark]";


/* =========================================================
   MESSAGE
========================================================= */

function Message({
                     type,
                     message,
                 }: {
    type:
        | "error"
        | "success";

    message: string;
}) {
    return (
        <div
            className={[
                "mb-6 rounded-[20px] border px-5 py-4 text-sm",
                type ===
                "success"
                    ? "border-[#b8ff65]/20 bg-[#b8ff65]/[0.055] text-[#b8ff65]"
                    : "border-red-400/20 bg-red-400/[0.055] text-red-200",
            ].join(
                " "
            )}
        >
            {message}
        </div>
    );
}


/* =========================================================
   UNSAVED
========================================================= */

function UnsavedChangesBar({
                               onSave,
                               onDiscard,
                               isSaving,
                           }: {
    onSave: () => void;
    onDiscard: () => void;
    isSaving: boolean;
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 rounded-[20px] border border-[#b8ff65]/15 bg-[#b8ff65]/[0.035] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

                <p className="text-xs font-medium text-[#b8ff65]">
                    Unsaved changes
                </p>


                <p className="mt-1 text-[10px] text-white/25">
                    Save before leaving if you want to keep these changes.
                </p>

            </div>


            <div className="flex gap-2">

                <button
                    type="button"
                    onClick={
                        onDiscard
                    }
                    disabled={
                        isSaving
                    }
                    className="h-9 cursor-pointer rounded-full border border-white/[0.09] px-4 text-[10px] text-white/35 transition hover:text-white"
                >
                    Discard
                </button>


                <button
                    type="button"
                    onClick={
                        onSave
                    }
                    disabled={
                        isSaving
                    }
                    className="h-9 cursor-pointer rounded-full bg-[#b8ff65] px-4 text-[10px] font-semibold text-black disabled:opacity-50"
                >
                    {isSaving
                        ? "Saving..."
                        : "Save"}
                </button>

            </div>

        </div>
    );
}


/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
                         status,
                     }: {
    status: string;
}) {
    return (
        <span className="inline-flex h-10 items-center gap-2 rounded-full border border-[#b8ff65]/20 bg-[#b8ff65]/[0.055] px-4 text-[9px] font-medium uppercase tracking-[0.17em] text-[#b8ff65]">

            <span className="h-1.5 w-1.5 rounded-full bg-[#b8ff65]" />

            {status}

        </span>
    );
}


/* =========================================================
   HEADER
========================================================= */

function DashboardHeader({
                             owner,
                             hasUnsavedChanges,
                             onSave,
                             isSaving,
                             onLogout,
                         }: {
    owner: OwnerSession;

    hasUnsavedChanges: boolean;

    onSave: () => void;

    isSaving: boolean;

    onLogout: () => void;
}) {
    return (
        <header className="border-b border-white/[0.08]">

            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">

                <Link
                    href="/"
                    className="group flex items-center gap-4"
                >

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15">

                        <div className="h-2.5 w-2.5 rounded-full bg-[#b8ff65]" />

                    </div>


                    <span className="text-sm font-semibold uppercase tracking-[0.24em]">
                        Tuntunan
                    </span>

                </Link>


                <div className="flex items-center gap-2 sm:gap-3">

                    {hasUnsavedChanges && (
                        <button
                            type="button"
                            onClick={
                                onSave
                            }
                            disabled={
                                isSaving
                            }
                            className="hidden h-10 cursor-pointer items-center rounded-full bg-[#b8ff65] px-4 text-[10px] font-semibold text-black disabled:opacity-50 sm:inline-flex"
                        >
                            {isSaving
                                ? "Saving..."
                                : "Save changes"}
                        </button>
                    )}


                    <Link
                        href={`/cafes/${owner.slug}`}
                        className="hidden h-10 items-center rounded-full border border-white/[0.09] px-4 text-[10px] text-white/35 transition hover:text-white sm:inline-flex"
                    >
                        Public page
                    </Link>


                    <button
                        type="button"
                        onClick={
                            onLogout
                        }
                        className="inline-flex h-10 cursor-pointer items-center rounded-full border border-white/[0.09] px-4 text-[10px] text-white/35 transition hover:border-red-400/20 hover:text-red-200"
                    >
                        Sign out
                    </button>

                </div>

            </div>

        </header>
    );
}


/* =========================================================
   HELPERS
========================================================= */

function mapCafeToEditable(
    cafe:
    RegisteredCafeApiResponse
): EditableCafe {
    return {
        name:
        cafe.name,

        city:
        cafe.city,

        area:
            cafe.area ??
            "",

        address:
        cafe.address,

        latitude:
        cafe.latitude,

        longitude:
        cafe.longitude,

        description:
            cafe.description ??
            "",

        instagram:
            cafe.instagram ??
            "",

        website:
            cafe.website ??
            "",

        wifi:
        cafe.amenities
            .wifi,

        outlets:
        cafe.amenities
            .outlets,

        outdoorSeating:
        cafe.amenities
            .outdoor_seating,

        workFriendly:
        cafe.amenities
            .work_friendly,

        petFriendly:
        cafe.amenities
            .pet_friendly,

        wheelchairAccessible:
        cafe.amenities
            .wheelchair_accessible,

        openingHours:
            cloneOpeningHours(
                cafe.opening_hours
            ),
    };
}


function cloneEditableCafe(
    cafe: EditableCafe
): EditableCafe {
    return JSON.parse(
        JSON.stringify(
            cafe
        )
    ) as EditableCafe;
}


function cloneOpeningHours(
    openingHours:
    RegisteredCafeOpeningHours
): RegisteredCafeOpeningHours {
    return JSON.parse(
        JSON.stringify(
            openingHours
        )
    ) as RegisteredCafeOpeningHours;
}


function validateForm(
    form: EditableCafe
): string | null {
    if (
        form.name
            .trim()
            .length <
        2
    ) {
        return "Cafe name must contain at least 2 characters.";
    }


    if (
        form.city
            .trim()
            .length <
        2
    ) {
        return "Please enter a valid city.";
    }


    if (
        form.address
            .trim()
            .length <
        3
    ) {
        return "Please enter a valid café address.";
    }


    if (
        form.description
            .length >
        500
    ) {
        return "Description cannot exceed 500 characters.";
    }


    return null;
}


function getTodayHoursLabel(
    openingHours:
    RegisteredCafeOpeningHours
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
            .toLowerCase() as keyof RegisteredCafeOpeningHours;


    const hours =
        openingHours[
            weekday
            ];


    if (!hours.enabled) {
        return "Closed today";
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


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    const displayHour =
        hour %
        12 ||
        12;


    return `${displayHour}:${String(
        minute
    ).padStart(
        2,
        "0"
    )} ${period}`;
}


function getCafeImageUrl(
    path:
        string | null
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


    const apiUrl =
        API_URL.endsWith(
            "/"
        )
            ? API_URL.slice(
                0,
                -1
            )
            : API_URL;


    const imagePath =
        path.startsWith(
            "/"
        )
            ? path
            : `/${path}`;


    return `${apiUrl}${imagePath}`;
}

