import { createClient } from '@/lib/supabase/server'
import { Sparkles, CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function RoadmapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: dbRoadmaps } = await supabase
    .from('roadmaps')
    .select('*, roadmap_items(*)')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(1)

  const hasDbRoadmap = dbRoadmaps && dbRoadmaps.length > 0
  const roadmap = hasDbRoadmap ? dbRoadmaps[0] : null
  const items = hasDbRoadmap ? roadmap.roadmap_items : []

  if (!hasDbRoadmap) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Roadmap Generated Yet</h2>
        <p className="text-gray-500 max-w-sm mb-8">
          Head over to the Skills section to analyze your profile and let our AI generate your personalized 30-day learning path.
        </p>
        <Link href="/skills" className="bg-[#8B1D3B] hover:bg-[#7a1934] text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
          Go to Skills Analysis <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  // Sort items by week
  items.sort((a: any, b: any) => a.week_number - b.week_number)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Your 30-Day Career Roadmap</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
           <p>{roadmap.target_role || 'Robotics / Physical AI Intern'}</p>
           <div className="flex-1 max-w-[200px] ml-auto flex items-center gap-2">
              <span className="text-xs font-semibold">Overall</span>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                 <div className="h-full bg-purple-600 rounded-full" style={{ width: '37%' }} />
              </div>
              <span className="text-xs font-bold text-gray-900">37%</span>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        {items.map((item: any) => (
          <RoadmapWeek key={item.id || item.week_number} item={item} />
        ))}
      </div>
    </div>
  )
}

function RoadmapWeek({ item }: { item: any }) {
  const isCompleted = item.status === 'completed'
  const isInProgress = item.status === 'in_progress'
  const isAdapted = item.description?.includes('Adapted') || item.title.includes('Intensive')

  return (
    <div className="flex gap-4 group is-active">
      <div className="pt-2">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 shrink-0 shadow-sm z-10 ${
          isCompleted ? 'bg-green-500 text-white border-transparent' : 
          isInProgress ? 'bg-white border-purple-200 text-purple-700 ring-4 ring-purple-50' : 
          'bg-gray-50 text-gray-400'
        }`}>
          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{item.week_number}</span>}
        </div>
      </div>

      <div className={`flex-1 bg-white p-6 rounded-2xl border ${isInProgress ? 'border-purple-100 shadow-md ring-1 ring-purple-50' : 'border-gray-100 shadow-sm'} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
               isCompleted ? 'text-green-600' : 
               isInProgress ? 'text-purple-600' : 
               'text-gray-500'
            }`}>
              Week {item.week_number} • {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Upcoming'}
            </span>
            {isAdapted && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-blue-600">
                <Sparkles className="w-3 h-3" /> AI Adapted
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-400">{item.estimated_minutes ? `${Math.round(item.estimated_minutes/60)}h` : '12h'}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{item.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
           {item.skill_name?.split(',').map((skill: string) => (
             <span key={skill} className="text-[10px] font-medium px-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-600">
               {skill.trim()}
             </span>
           ))}
        </div>

        {isInProgress && (
           <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
             <span className="text-xs font-semibold text-gray-500">Progress</span>
             <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '48%' }} />
             </div>
             <span className="text-xs font-bold text-gray-900">48%</span>
           </div>
        )}
      </div>
    </div>
  )
}

function getMockRoadmapItems() {
  return [
    {
      week_number: 1,
      title: 'Linux Fundamentals',
      description: 'Get comfortable in the terminal robots actually run on.',
      skill_name: 'Linux, Bash, Git',
      status: 'completed',
      estimated_minutes: 12 * 60
    },
    {
      week_number: 2,
      title: 'Computer Vision Intensive',
      description: 'Build solid CV foundations before touching robot perception. (Adapted after assessment)',
      skill_name: 'OpenCV, Image Processing, Computer Vision',
      status: 'in_progress',
      estimated_minutes: 16 * 60
    },
    {
      week_number: 3,
      title: 'ROS Fundamentals',
      description: 'Understand nodes, topics and how robot software talks.',
      skill_name: 'ROS 2, Linux, Python',
      status: 'upcoming',
      estimated_minutes: 14 * 60
    },
    {
      week_number: 4,
      title: 'Build a Robotics Project',
      description: 'Ship proof: a working perception + navigation demo.',
      skill_name: 'ROS, Computer Vision, Robotics',
      status: 'upcoming',
      estimated_minutes: 18 * 60
    }
  ]
}
