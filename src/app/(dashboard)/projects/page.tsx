import { createClient } from '@/lib/supabase/server'
import { Briefcase, ArrowRight, CheckCircle2, Code2, Cpu } from 'lucide-react'
import { getStudentSkills } from '@/lib/skillsData'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const skills = getStudentSkills(profile)

  if (!skills) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Projects Available</h2>
        <p className="text-gray-500 max-w-sm mb-8">
          You currently have no recommended projects. Complete your skills analysis first!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Recommended Projects</h1>
        <p className="text-gray-500 text-sm">
          Apply your skills to real-world scenarios to build your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectCard 
          title="Autonomous Robot Navigation"
          description="Build a ROS2 package that allows a differential drive robot to navigate a known map avoiding dynamic obstacles."
          icon={<Cpu className="w-6 h-6 text-indigo-600" />}
          tags={['ROS', 'C++', 'Computer Vision']}
          difficulty="Advanced"
          timeEstimate="3 weeks"
          isCompleted={false}
        />
        
        <ProjectCard 
          title="Computer Vision Object Detection"
          description="Develop a Python script using OpenCV to identify and track specific colored objects in a live camera feed."
          icon={<Code2 className="w-6 h-6 text-blue-600" />}
          tags={['Python', 'Computer Vision']}
          difficulty="Intermediate"
          timeEstimate="1 week"
          isCompleted={true}
        />
      </div>
    </div>
  )
}

function ProjectCard({ title, description, icon, tags, difficulty, timeEstimate, isCompleted }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-gray-50 p-3 rounded-xl">
          {icon}
        </div>
        {isCompleted ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        ) : (
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {timeEstimate}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 flex-1">{description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag: string) => (
          <span key={tag} className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {!isCompleted && (
        <a href="/playground" className="w-full bg-[#8B1D3B] hover:bg-[#7a1934] text-white py-3 rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2">
          Start Project <ArrowRight className="w-4 h-4" />
        </a>
      )}
    </div>
  )
}
