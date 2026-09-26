import { createClient } from '@/lib/supabase/server'
import { Sparkles } from 'lucide-react'
import GenerateRoadmapButton from './GenerateRoadmapButton'
import { getStudentSkills } from '@/lib/skillsData'

export default async function SkillsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const studentSkillsRaw = getStudentSkills(profile)

  if (!studentSkillsRaw) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Skills Data Found</h2>
        <p className="text-gray-500 max-w-sm mb-8">
          Your NIAT ID has not been evaluated yet. Check back later when your assessment data is uploaded.
        </p>
      </div>
    )
  }

  const skills = Object.entries(studentSkillsRaw).map(([name, score]) => {
    const numScore = score as number;
    return {
      skill_name: name,
      score: numScore,
      category: numScore >= 70 ? 'strong' : numScore >= 45 ? 'developing' : 'missing'
    }
  })

  const strong = skills.filter(s => s.category === 'strong')
  const developing = skills.filter(s => s.category === 'developing')
  const missing = skills.filter(s => s.category === 'missing')

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Curriculum & Skills</h1>
        <p className="text-gray-500 text-sm">
          Detailed breakdown of your current skill levels and gaps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Strong Skills */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-gray-900">Strong</h3>
             <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{strong.length}</span>
          </div>
          <div className="space-y-4 flex-1">
             {strong.map((skill: any) => (
               <SkillBar key={skill.skill_name} name={skill.skill_name} score={skill.score} color="bg-green-500" />
             ))}
          </div>
        </div>

        {/* Developing Skills */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-gray-900">Developing</h3>
             <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">{developing.length}</span>
          </div>
          <div className="space-y-4 flex-1">
             {developing.map((skill: any) => (
               <SkillBar key={skill.skill_name} name={skill.skill_name} score={skill.score} color="bg-yellow-500" />
             ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full border-t-4 border-t-red-500">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-gray-900">Critical Gaps</h3>
             <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">{missing.length}</span>
          </div>
          <div className="space-y-4 flex-1">
             {missing.map((skill: any) => (
               <SkillBar key={skill.skill_name} name={skill.skill_name} score={skill.score} color="bg-red-500" />
             ))}
          </div>
        </div>

      </div>

      <GenerateRoadmapButton />
    </div>
  )
}

function SkillBar({ name, score, color }: { name: string, score: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium mb-1">
        <span className="text-gray-700">{name}</span>
        <span className="text-gray-500">{score}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  )
}
