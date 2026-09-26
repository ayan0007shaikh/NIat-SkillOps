import { createClient } from '@/lib/supabase/server'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DynamicGreeting } from '@/components/DynamicGreeting';
import { getStudentSkills, getAverageSkill, getWeakestSkills, getStrongestSkills } from '@/lib/skillsData';

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  if (!profile?.target_role) {
    redirect('/onboarding')
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Student'
  const targetRole = profile.target_role
  
  const studentSkills = getStudentSkills(profile)
  
  if (!studentSkills) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <DynamicGreeting name={firstName} />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Target Role</p>
          <h2 className="text-xl font-bold text-gray-900">{targetRole}</h2>
        </div>
      </div>
    )
  }

  const readiness = getAverageSkill(studentSkills)
  const currentMatch = readiness
  const weakSkills = getWeakestSkills(studentSkills)
  const strongSkills = getStrongestSkills(studentSkills)
  const skillsToImprove = weakSkills.length
  const skillsStrong = strongSkills.length
  const projectsCompleted = 2

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <DynamicGreeting name={firstName} />
        <p className="text-gray-500">Here's how your career path is progressing.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Target Role</p>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{targetRole}</h2>

        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 border-purple-700">
            <span className="text-2xl font-bold text-gray-900">{readiness}%</span>
            <span className="text-[10px] text-gray-500">readiness</span>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
             <div>
                <p className="text-2xl font-bold text-gray-900">{currentMatch}%</p>
                <p className="text-xs text-gray-500">Current skill match</p>
             </div>
             <div>
                <p className="text-2xl font-bold text-gray-900">{skillsStrong}</p>
                <p className="text-xs text-gray-500">Skills strong</p>
             </div>
             <div>
                <p className="text-2xl font-bold text-gray-900">{skillsToImprove}</p>
                <p className="text-xs text-gray-500">Skills to improve</p>
             </div>
             <div>
                <p className="text-2xl font-bold text-gray-900">{projectsCompleted}</p>
                <p className="text-xs text-gray-500">Projects completed</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-900">AI Career Insight</h3>
        </div>
        <p className="text-sm text-blue-800 mb-4">
          You're strong in <span className="font-semibold">{strongSkills.join(' and ')}</span>, but <span className="font-semibold text-red-600">{weakSkills.join(' and ')}</span> are currently limiting your readiness for internships.
        </p>
        
        <p className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wider">Recommended priority</p>
        <div className="flex items-center gap-2 text-sm text-blue-900 mb-4">
           {weakSkills.map(skill => (
             <div key={skill} className="flex items-center gap-2">
               <span className="bg-white px-2 py-1 rounded text-blue-700 font-medium">{skill}</span>
               <ArrowRight className="w-3 h-3 text-blue-400" />
             </div>
           ))}
           <span className="bg-white px-2 py-1 rounded text-blue-700 font-medium">Project</span>
        </div>

        <Link href="/roadmap" className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          View My Plan <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  )
}
