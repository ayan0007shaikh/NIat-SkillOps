'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, PlayCircle, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getStudentSkills, getWeakestSkills } from '@/lib/skillsData'

const questionsDb: Record<string, { q: string, opts: string[], ans: number }[]> = {
  'Python': [
    { q: 'Which data structure in Python is immutable?', opts: ['List', 'Dictionary', 'Tuple', 'Set'], ans: 2 },
    { q: 'What keyword is used to define a function in Python?', opts: ['func', 'def', 'function', 'define'], ans: 1 },
    { q: 'How do you insert an element at a specific index in a list?', opts: ['append()', 'push()', 'add()', 'insert()'], ans: 3 }
  ],
  'ROS': [
    { q: 'What is the primary communication mechanism in ROS?', opts: ['Shared Memory', 'Publish/Subscribe', 'Direct API', 'File System'], ans: 1 },
    { q: 'Which tool is used to visualize ROS data?', opts: ['Rviz', 'Gazebo', 'Rqt_graph', 'PlotJuggler'], ans: 0 },
    { q: 'What defines the message structure in ROS?', opts: ['.xml files', '.yaml files', '.msg files', '.srv files'], ans: 2 }
  ],
  'default': [
    { q: 'What is the most important principle of this technology?', opts: ['Scalability', 'Maintainability', 'Performance', 'All of the above'], ans: 3 },
    { q: 'Which approach is best for debugging?', opts: ['Guessing', 'Systematic logging', 'Deleting code', 'Ignoring errors'], ans: 1 },
    { q: 'How do you ensure long-term success?', opts: ['Stop learning', 'Continuous practice', 'Memorization', 'Copying others'], ans: 1 }
  ]
}

export default function AssessmentsPage() {
  const [activeTest, setActiveTest] = useState<string | null>(null)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [weakSkills, setWeakSkills] = useState<string[]>([])
  const [allSkills, setAllSkills] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        const skills = getStudentSkills(profile)
        if (skills) {
          setAllSkills(skills)
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Assessments Scheduled</h2>
        <p className="text-gray-500 max-w-sm mb-8">
          You currently have no recommended assessments. Keep up the good work!
        </p>
      </div>
    )
  }

  if (activeTest) {
    const questions = questionsDb[activeTest] || questionsDb['default']
    const q = questions[currentQIndex]

    const handleNext = async () => {
      let newScore = score
      if (selected === q.ans) newScore += 1
      setScore(newScore)
      setSelected(null)

      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(currentQIndex + 1)
      } else {
        setIsFinished(true)
        setSaving(true)
        
        // Calculate new skill score (+15 points for completing assessment)
        const currentSkillScore = allSkills[activeTest] || 40
        const updatedSkills = { ...allSkills, [activeTest]: Math.min(100, currentSkillScore + 15) }
        
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('profiles').update({ custom_skills: updatedSkills }).eq('id', user.id)
        }
        setSaving(false)
      }
    }

    if (isFinished) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-32 animate-in fade-in zoom-in duration-500">
          <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
          <p className="text-gray-500 mb-8 max-w-md">
            You scored {score} out of {questions.length}. We've updated your profile and increased your {activeTest} proficiency!
          </p>
          <button onClick={() => window.location.href='/dashboard'} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
            Return to Dashboard
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto pb-12">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h1 className="text-xl font-bold text-gray-900">{activeTest} Fundamentals</h1>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-500 font-medium mb-2">
            <span>Question {currentQIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentQIndex) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${((currentQIndex) / questions.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="py-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">
            {q.q}
          </h2>

          <div className="space-y-3">
            {q.opts.map((optText, i) => (
              <button 
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                  selected === i 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selected === i ? 'border-blue-600' : 'border-gray-300'
                  }`}>
                    {selected === i && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                  </div>
                  <span className="font-medium">{optText}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            disabled={selected === null || saving}
            onClick={handleNext} 
            className="bg-blue-600 text-white disabled:opacity-50 px-8 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 hover:bg-blue-700"
          >
            {saving ? 'Saving Progress...' : currentQIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Question'} 
            {!saving && <ArrowRight className="w-4 h-4" />}
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
          <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
