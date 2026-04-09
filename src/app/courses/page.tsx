import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Courses & Bootcamps — YourSaathi',
  description: 'Explore our professional and beginner-friendly courses in Machine Learning, AI, Animation, and CGI. Level up your career with YourSaathi.',
  alternates: { canonical: 'https://www.yoursaathi.site/courses' },
};

export default function CoursesHubPage() {
  return (
    <>
      <style>{`
        @keyframes hub-fade {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hub-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .hub-fade { animation: hub-fade 0.7s ease-out forwards; }
        .course-card {
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), 
                      box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .course-card:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .ml-card:hover { border-color: rgba(168,85,247,0.5); box-shadow: 0 30px 60px rgba(168,85,247,0.15); }
        .anim-card:hover { border-color: rgba(244,63,94,0.5); box-shadow: 0 30px 60px rgba(244,63,94,0.15); }
      `}</style>

      <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 hub-fade">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tight">
              Level Up Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500">Skills</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Choose your path. From writing your first machine learning model in Python to rendering cinematic shots in Unreal Engine 5.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* ML & AI Course Box */}
            <Link href="/courses/ml-ai" className="course-card ml-card group block rounded-3xl bg-[#0e0e12] border border-white/10 overflow-hidden hub-fade" style={{ animationDelay: '0.1s', opacity: 0 }}>
              <div className="h-48 relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <span className="text-7xl group-hover:scale-110 transition-transform duration-500 shadow-sm" style={{ animation: 'hub-float 4s ease-in-out infinite' }}>
                  🤖
                </span>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold text-purple-300">
                    4 Modules
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold text-blue-300">
                    Beginner to Advanced
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-black text-white mb-3 group-hover:text-purple-400 transition-colors">
                  Python ML &amp; AI
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 h-16">
                  Master Supervised Learning, Neural Networks, Computer Vision, and full-stack AI deployment. Write production-grade code.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-500">Python</span>
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-500">TensorFlow</span>
                  </div>
                  <span className="text-sm font-bold text-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start Learning <span>→</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* Animation & CGI Course Box */}
            <Link href="/courses/animation" className="course-card anim-card group block rounded-3xl bg-[#0e0e12] border border-white/10 overflow-hidden hub-fade" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <div className="h-48 relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-500/10 to-orange-500/10">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <span className="text-7xl group-hover:scale-110 transition-transform duration-500 shadow-sm" style={{ animation: 'hub-float 4.5s ease-in-out infinite' }}>
                  🎬
                </span>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold text-rose-300">
                    4 Modules
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold text-orange-300">
                    Studio Pipeline
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-black text-white mb-3 group-hover:text-rose-400 transition-colors">
                  Animation &amp; CGI Pipeline
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 h-16">
                  From traditional 2D principles to full 3D rigging, VFX simulations, and real-time cinematic rendering in Unreal Engine 5.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-500">Blender</span>
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-500">UE5</span>
                  </div>
                  <span className="text-sm font-bold text-rose-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start Learning <span>→</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
