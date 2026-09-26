export const studentSkillsData: Record<string, Record<string, number>> = {}

export function getStudentSkills(profile: any) {
  if (!profile) return null
  
  const niatId = profile.niat_id?.toUpperCase()
  const defaultSkills = studentSkillsData[niatId] || null
  const customSkills = profile.custom_skills

  // If they have custom skills saved (and it's not empty), use them!
  if (customSkills && Object.keys(customSkills).length > 0) {
    return customSkills
  }

  return defaultSkills
}

export function getWeakestSkills(skills: Record<string, number> | null): string[] {
  if (!skills) return []
  return Object.entries(skills)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(entry => entry[0])
}

export function getStrongestSkills(skills: Record<string, number> | null): string[] {
  if (!skills) return []
  return Object.entries(skills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(entry => entry[0])
}

export function getAverageSkill(skills: Record<string, number> | null): number {
  if (!skills) return 0
  const values = Object.values(skills)
  if (values.length === 0) return 0
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}
