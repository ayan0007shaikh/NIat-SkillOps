'use client'

import { useState, useTransition, useEffect } from 'react'
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { createAIRoadmap } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function GenerateRoadmapButton() {
  const [isPending, startTransition] = useTransition()
  const [loadingText, setLoadingText] = useState('')
  const router = useRouter()

  const loadingSequence = [
    "Analyzing your current skill profile...",
    "Cross-referencing with industry requirements...",
    "Identifying critical knowledge gaps...",
    "Structuring a personalized 4-week learning path...",
    "Finalizing your AI-adapted roadmap..."
  ]

  useEffect(() => {
    if (!isPending) return
    let step = 0
    setLoadingText(loadingSequence[0])
    
    const interval = setInterval(() => {
      step++
      if (step < loadingSequence.length) {
        setLoadingText(loadingSequence[step])
      }
    }, 1200)

    return () => clearInterval(interval)
  }, [isPending])

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        const res = await createAIRoadmap()
        if (res && !res.success) {
            alert('Failed to save roadmap: ' + res.error)
            return
        }
        window.location.href = '/roadmap'
      } catch (e) {
        console.error(e)
        window.location.href = '/roadmap'
      }
    })
  }

  return (
    <>
      <button 
        onClick={handleGenerate}
        disabled={isPending}
        className="bg-[#8B1D3B] hover:bg-[#7a1934] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 hover:shadow-lg disabled:opacity-50"
      >
        {isPending ? 'Adapting...' : 'Generate roadmap'} 
        {!isPending && <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Full Screen Overlay Animation */}
      {isPending && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="flex flex-col items-center max-w-md text-center">
             <div className="relative mb-8">
               <div className="absolute inset-0 bg-[#8B1D3B] rounded-full blur-xl opacity-20 animate-pulse"></div>
               <div className="w-20 h-20 bg-white rounded-full shadow-2xl border border-gray-100 flex items-center justify-center relative z-10 animate-bounce">
                  <Sparkles className="w-8 h-8 text-[#8B1D3B]" />
               </div>
             </div>
             
             <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">AI Adaptation Triggered</h2>
             
             <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
               <Loader2 className="w-5 h-5 text-[#8B1D3B] animate-spin" />
               <p className="text-sm font-semibold text-gray-600 min-w-[250px] animate-pulse">
                 {loadingText}
               </p>
             </div>
           </div>
        </div>
      )}
    </>
  )
}
