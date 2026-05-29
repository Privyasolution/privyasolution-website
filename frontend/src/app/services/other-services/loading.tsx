export default function OtherServicesLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="bg-hero-gradient pt-20 pb-16">
        <div className="container-max px-4 md:px-8 lg:px-16 flex flex-col items-center gap-4">
          <div className="h-3 w-32 bg-white/10 rounded-full animate-pulse" />
          <div className="h-14 w-3/4 bg-white/10 rounded-xl animate-pulse" />
          <div className="h-6 w-1/2 bg-white/10 rounded-lg animate-pulse" />
          <div className="grid grid-cols-3 gap-px w-full max-w-2xl mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-white/5 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="bg-brand-darker py-20">
        <div className="container-max px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-[#0D1526] overflow-hidden">
                <div className="h-48 bg-white/5 animate-pulse" />
                <div className="p-6 flex flex-col gap-3">
                  <div className="h-5 w-2/3 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
