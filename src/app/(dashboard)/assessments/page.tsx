'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, PlayCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getStudentSkills, getWeakestSkills } from '@/lib/skillsData'

export default function AssessmentsPage() {
  const [activeTest, setActiveTest] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [weakSkills, setWeakSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        const skills = getStudentSkills(profile)
        if (skills) {
          setWeakSkills(getWeakestSkills(skills))
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div>Loading...</div>

  if (weakSkills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Exams Scheduled</h2>
        <p className="text-gray-500 max-w-sm mb-8">
          You currently have no recommended exams. Keep up the good work!
        </p>
      </div>
    )
  }

  if (activeTest) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto pb-12">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h1 className="text-xl font-bold text-gray-900">{activeTest} Fundamentals</h1>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-500 font-medium mb-2">
            <span>Question 1</span>
            <span>1 / 10</span>
          </div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '10%' }}></div>
          </div>
        </div>

        <div className="py-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">
            Which technique is commonly used in {activeTest}?
          </h2>

          <div className="space-y-3">
            {[
              { id: 1, text: 'Option A' },
              { id: 2, text: 'Option B' },
              { id: 3, text: 'Option C' },
              { id: 4, text: 'Option D' }
            ].map((opt) => (
              <button 
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                  selected === opt.id 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected === opt.id ? 'border-blue-600' : 'border-gray-300'
                  }`}>
                    {selected === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                  </div>
                  <span className="font-medium">{opt.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button onClick={() => window.location.href='/dashboard'} className="bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            Submit Assessment <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Skill Assessments</h1>
        <p className="text-gray-500 text-sm">
          Take these tests to validate your skills and improve your profile readiness. 
          We've recommended these based on your weak areas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weakSkills.map((skill, index) => (
          <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md mb-2 inline-block">Weak Skill</span>
                <h3 className="text-lg font-bold text-gray-900">{skill} Fundamentals</h3>
                <p className="text-sm text-gray-500 mt-1">Focus: {skill}</p>
              </div>
              <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>

            <button 
              onClick={() => setActiveTest(skill)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2"
            >
              Start Test <PlayCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
