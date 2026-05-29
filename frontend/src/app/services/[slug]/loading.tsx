export default function ServicePageLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <section className="bg-hero-gradient py-24 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-5 text-center">
          <div className="h-3 w-40 bg-white/15 rounded-full animate-pulse" />
          <div className="h-12 w-4/5 bg-white/15 rounded-2xl animate-pulse" />
          <div className="h-5 w-3/5 bg-white/10 rounded-xl animate-pulse" />
          <div className="h-4 w-1/2 bg-white/10 rounded-xl animate-pulse" />
          <div className="flex gap-3 mt-2">
            <div className="h-11 w-36 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-11 w-36 bg-white/10 rounded-xl animate-pulse" />
          </div>
        </div>
      </section>

      {/* Intro skeleton */}
      <section className="bg-white py-10 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
          <div className="h-3.5 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-3.5 w-11/12 bg-gray-100 rounded animate-pulse" />
          <div className="h-3.5 w-4/5 bg-gray-100 rounded animate-pulse" />
        </div>
      </section>

      {/* Process flow skeleton */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-5 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-1 h-28 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits + Specs skeleton */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`flex h-11 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <div className="w-2/5 bg-gray-100 animate-pulse" />
                  <div className="w-3/5 bg-gray-50 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA skeleton */}
      <section className="bg-hero-gradient py-16 px-4">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
          <div className="h-8 w-3/4 bg-white/15 rounded-xl animate-pulse" />
          <div className="h-4 w-2/3 bg-white/10 rounded-lg animate-pulse" />
          <div className="flex gap-3 mt-2">
            <div className="h-11 w-36 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-11 w-40 bg-white/10 rounded-xl animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  );
}
