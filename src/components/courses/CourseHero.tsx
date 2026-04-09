export default function CourseHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[350px] bg-cyan-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-pink-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-wider uppercase mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
          </span>
          Beginner → Advanced
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
          Machine Learning{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            &amp; AI
          </span>
          <span className="block text-xl sm:text-2xl text-gray-500 font-semibold mt-2">
            From Zero to Production
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
          No prior ML experience needed. Start from the basics and progressively build up to
          production-grade AI systems — with real projects at every step.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          {[
            { icon: '⏱️', text: '40–60 Hours' },
            { icon: '📦', text: '4 Modules' },
            { icon: '🐍', text: 'Python 3.9+' },
            { icon: '🏆', text: '4 Projects' },
          ].map(({ icon, text }) => (
            <span key={text} className="inline-flex items-center gap-2">
              <span>{icon}</span>
              <span className="font-medium text-gray-400">{text}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
