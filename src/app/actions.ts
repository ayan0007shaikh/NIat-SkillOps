'use server'

import { createClient } from '@/lib/supabase/server'
import { generateRoadmap } from '@/lib/ai/gemini'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getStudentSkills, getWeakestSkills } from '@/lib/skillsData'

export async function createAIRoadmap() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not logged in')

  // Get Profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  
  // Get missing skills using our new custom skills logic
  const studentSkills = getStudentSkills(profile)
  const skillNames = studentSkills ? getWeakestSkills(studentSkills) : ['React', 'Node.js']

  // Call Gemini
  const roadmapData = await generateRoadmap(profile?.target_role || 'Software Engineer', skillNames)
  
  if (!roadmapData) {
      throw new Error('Failed to generate roadmap from AI')
  }

  // Insert into DB
  const { data: roadmap, error: rErr } = await supabase
    .from('roadmaps')
    .insert({
        user_id: user.id,
        title: 'AI Generated Roadmap',
        target_role: profile?.target_role || 'Software Engineer',
    })
    .select()
    .single()

  if (rErr) throw rErr

  const itemsToInsert = roadmapData.map((item: any) => ({
      roadmap_id: roadmap.id,
      week_number: item.week_number,
      title: item.title,
      description: item.description,
      skill_name: item.skill_name,
      estimated_minutes: item.estimated_minutes,
      status: item.week_number === 1 ? 'in_progress' : 'upcoming'
  }))

  const { error: iErr } = await supabase.from('roadmap_items').insert(itemsToInsert)
  if (iErr) throw iErr

  revalidatePath('/roadmap')
  redirect('/roadmap')
}
