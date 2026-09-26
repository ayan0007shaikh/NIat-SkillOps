import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <img src="/niat-logo.jpg" alt="NIAT" className="h-10 object-contain mix-blend-multiply" />
            <div className="border-l-2 border-[#8B1D3B] pl-3">
            <h1 className="font-bold text-gray-900 leading-none text-xl">SkillOps</h1>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900">Student login</Link>
            <Link href="/login" className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">Get started</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 mb-8">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Built for NIAT students</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
          Your career path,<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B1D3B] to-purple-700">continuously optimized.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          SkillOps analyzes your current abilities, identifies what you're missing, and automatically adapts your learning path toward the career you want.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto bg-[#8B1D3B] hover:bg-[#7a1934] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg shadow-[#8B1D3B]/20">
              Build My Career Path →
            </Link>
        </div>
      </main>
    </div>
  )
}
