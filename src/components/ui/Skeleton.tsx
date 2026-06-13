export function SkeletonHero() {
  return (
    <div className="glass animate-pulse rounded-3xl p-8">
      <div className="h-6 w-40 rounded-full bg-white/10" />
      <div className="mt-4 h-16 w-2/3 rounded-2xl bg-white/10" />
      <div className="mt-4 grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonCard({ h = 32 }: { h?: number }) {
  return (
    <div
      className="glass animate-pulse rounded-3xl p-6"
      style={{ height: h * 4 }}
    >
      <div className="h-4 w-28 rounded-full bg-white/10" />
      <div className="mt-3 h-10 w-2/3 rounded-xl bg-white/10" />
      <div className="mt-2 h-3 w-3/4 rounded-full bg-white/5" />
    </div>
  );
}
