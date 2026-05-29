// Global loading skeleton — shown while server components fetch data.
// min-h-[calc(100vh-80px)] keeps footer below the fold while content loads.
export default function GlobalLoading() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-hero-gradient flex flex-col">
      {/* Hero skeleton */}
      <section className="flex-1 flex flex-col items-center justify-center gap-5 px-4 py-24 text-center">
        {/* Eyebrow tag */}
        <div className="h-3 w-32 bg-white/15 rounded-full animate-pulse" />

        {/* Headline — two lines */}
        <div className="space-y-3 w-full max-w-2xl">
          <div className="h-10 w-4/5 bg-white/15 rounded-2xl animate-pulse mx-auto" />
          <div className="h-10 w-3/5 bg-white/15 rounded-2xl animate-pulse mx-auto" />
        </div>

        {/* Subheadline */}
        <div className="space-y-2 w-full max-w-xl mt-1">
          <div className="h-3.5 w-full bg-white/10 rounded-xl animate-pulse" />
          <div className="h-3.5 w-5/6 bg-white/10 rounded-xl animate-pulse mx-auto" />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 justify-center mt-3">
          <div className="h-11 w-36 bg-white/15 rounded-xl animate-pulse" />
          <div className="h-11 w-40 bg-white/10 rounded-xl animate-pulse" />
        </div>

        {/* Stats bar */}
        <div className="flex gap-6 mt-6 pt-6 border-t border-white/10 w-full max-w-lg justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="h-6 w-14 bg-white/15 rounded-lg animate-pulse" />
              <div className="h-2.5 w-20 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
