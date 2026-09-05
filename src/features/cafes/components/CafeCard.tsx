import type { Cafe } from "../types/cafe";

interface CafeCardProps {
    cafe: Cafe;
    index: number;
    featured?: boolean;
}

export function CafeCard({
                             cafe,
                             index,
                             featured = false,
                         }: CafeCardProps) {
    const attributes =
        getCafeAttributes(cafe);

    const isRegistered =
        cafe.source === "registered";

    return (
        <article
            className={[
                "group relative overflow-hidden rounded-[28px] border transition duration-500",
                "border-white/[0.08] bg-[#101010]",
                "hover:-translate-y-1 hover:border-white/[0.18] hover:bg-[#131313]",
                featured
                    ? "md:col-span-2 xl:col-span-2"
                    : "",
            ].join(" ")}
        >
            <div
                className={[
                    "relative flex h-full flex-col p-6 sm:p-7",
                    featured
                        ? "min-h-[360px] sm:p-9"
                        : "min-h-[300px]",
                ].join(" ")}
            >
                <div className="flex items-start justify-between gap-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/20">
                        {String(index + 1).padStart(
                            2,
                            "0"
                        )}
                    </span>

                    <div className="flex items-center gap-2">
                        {isRegistered && (
                            <span className="rounded-full border border-[#b8ff65]/20 bg-[#b8ff65]/[0.07] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-[#b8ff65]">
                                Tuntunan
                            </span>
                        )}

                        <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[10px] font-medium text-white/65">
                            {
                                cafe.display_distance
                            }
                        </span>
                    </div>
                </div>

                <div className="mt-auto">
                    {featured && (
                        <span className="mb-4 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.22em] text-[#b8ff65]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#b8ff65]" />

                            Closest match
                        </span>
                    )}

                    <h3
                        className={[
                            "font-semibold tracking-[-0.035em] transition duration-300 group-hover:text-[#b8ff65]",
                            featured
                                ? "max-w-xl text-4xl sm:text-5xl"
                                : "text-2xl",
                        ].join(" ")}
                    >
                        {cafe.name}
                    </h3>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-white/35">
                        {cafe.address ??
                            "Address information unavailable"}
                    </p>

                    {isRegistered &&
                        cafe.description && (
                            <p className="mt-4 max-w-xl line-clamp-2 text-sm leading-6 text-white/35">
                                {
                                    cafe.description
                                }
                            </p>
                        )}

                    {attributes.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {attributes.map(
                                (attribute) => (
                                    <span
                                        key={
                                            attribute
                                        }
                                        className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] text-white/45"
                                    >
                                        {
                                            attribute
                                        }
                                    </span>
                                )
                            )}
                        </div>
                    )}

                    <div className="mt-7 flex items-center justify-between border-t border-white/[0.07] pt-5">
                        <span
                            className={[
                                "text-[9px] uppercase tracking-[0.18em]",
                                isRegistered
                                    ? "text-[#b8ff65]/60"
                                    : "text-white/20",
                            ].join(" ")}
                        >
                            {isRegistered
                                ? "Tuntunan Registered"
                                : "OpenStreetMap"}
                        </span>

                        <span className="text-sm text-white/25 transition duration-300 group-hover:translate-x-1 group-hover:text-white">
                            Explore →
                        </span>
                    </div>
                </div>

                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#b8ff65]/0 blur-[90px] transition duration-500 group-hover:bg-[#b8ff65]/[0.045]" />
            </div>
        </article>
    );
}

function getCafeAttributes(
    cafe: Cafe
): string[] {
    const attributes: string[] = [];

    if (cafe.cuisine) {
        const cuisines = cafe.cuisine
            .split(";")
            .map((item) =>
                item
                    .replaceAll("_", " ")
                    .trim()
            )
            .filter(Boolean)
            .slice(0, 2);

        attributes.push(...cuisines);
    }

    if (cafe.wifi === true) {
        attributes.push("Wi-Fi");
    }

    if (cafe.outlets === true) {
        attributes.push("Outlets");
    }

    if (cafe.work_friendly === true) {
        attributes.push("Work friendly");
    }

    if (cafe.outdoor_seating === true) {
        attributes.push("Outdoor");
    }

    if (cafe.pet_friendly === true) {
        attributes.push("Pet friendly");
    }

    if (cafe.takeaway === true) {
        attributes.push("Takeaway");
    }

    if (cafe.delivery === true) {
        attributes.push("Delivery");
    }

    return attributes.slice(0, 4);
}