export function BackgroundEffects() {
    return (
        <>
            <div className="pointer-events-none absolute -left-40 top-32 h-[600px] w-[600px] rounded-full bg-[#b8ff65]/[0.035] blur-[150px]" />

            <div className="pointer-events-none absolute right-0 top-[500px] h-[700px] w-[700px] rounded-full bg-white/[0.015] blur-[170px]" />

            <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_center,white_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
        </>
    );
}
