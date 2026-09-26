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
  const skillNames = studentSkills && Object.keys(studentSkills).length > 0 
      ? Object.keys(studentSkills) 
      : ['React', 'Node.js']

  // Call Gemini or fallback
  let roadmapData = null;
  try {
      roadmapData = await generateRoadmap(profile?.target_role || 'Software Engineer', skillNames)
  } catch (e) {
      console.warn('AI failed, using fallback manual roadmap', e);
  }

  if (!roadmapData || roadmapData.length === 0) {
      // Manual fallback roadmap based on weak skills
      const mainSkill = skillNames[0] || 'Core Concepts';
      const secondarySkill = skillNames[1] || 'Advanced Tools';
      
      roadmapData = [
          {
              week_number: 1,
              title: `Fundamentals of ${mainSkill}`,
              description: `Master the core principles and syntax of ${mainSkill} to build a strong foundation.`,
              skill_name: mainSkill,
              estimated_minutes: 600
          },
          {
              week_number: 2,
              title: `Practical Application in ${mainSkill}`,
              description: `Build hands-on projects and solve common industry problems using ${mainSkill}.`,
              skill_name: mainSkill,
              estimated_minutes: 720
          },
          {
              week_number: 3,
              title: `Introduction to ${secondarySkill}`,
              description: `Expand your technical stack by learning the basics of ${secondarySkill}.`,
              skill_name: secondarySkill,
              estimated_minutes: 540
          },
          {
              week_number: 4,
              title: `Integration & Final Project`,
              description: `Combine ${mainSkill} and ${secondarySkill} into a comprehensive final project suitable for your portfolio.`,
              skill_name: `${mainSkill}, ${secondarySkill}`,
              estimated_minutes: 800
          }
      ];
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

  if (rErr) {
      console.error('Insert roadmap error:', rErr)
      return { success: false, error: rErr.message }
  }

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
  if (iErr) {
      console.error('Insert items error:', iErr)
      return { success: false, error: iErr.message }
  }

  revalidatePath('/roadmap')
  return { success: true }
}
