'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Camera, ArrowRight } from 'lucide-react'

export default function OnboardingPage() {
  const [profile, setProfile] = useState<any>(null)
  const [targetRole, setTargetRole] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data?.target_role) {
           router.push('/dashboard') // already onboarded
        } else {
           setProfile(data)
        }
      }
      setIsLoading(false)
    }
    load()
  }, [])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile?.id) return
    setIsLoading(true)
    
    try {
        const fileExt = file.name.split('.').pop()
        const filePath = `${profile.id}-${Math.random()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file)
            
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)
            
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id)
        setProfile({...profile, avatar_url: publicUrl})
    } catch (error) {
        console.error('Error uploading photo:', error)
        alert('Failed to upload photo')
    } finally {
        setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetRole) return alert("Please select a target role")
    setIsSaving(true)
    
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ target_role: targetRole })
            .eq('id', profile.id)
            
        if (error) throw error
        // Onboarding complete
        window.location.href = '/dashboard'
    } catch (error) {
        console.error('Error saving:', error)
        alert('Failed to save profile.')
        setIsSaving(false)
    }
  }

  if (isLoading && !profile) return <div className="flex h-[80vh] items-center justify-center">Loading...</div>

  return (
    <div className="max-w-xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
       <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SkillOps!</h1>
          <p className="text-sm text-gray-500 mb-8">Let's set up your profile so we can personalize your AI roadmap.</p>
          
          <div className="flex flex-col items-center mb-8">
             <div className="relative group w-24 h-24 rounded-full overflow-hidden bg-purple-700 flex items-center justify-center text-3xl font-medium text-white mb-3 shadow-inner border-4 border-white">
                 {profile?.avatar_url ? (
                     <img src={profile?.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                     <span>{profile?.full_name?.charAt(0) || 'U'}</span>
                 )}
                 <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                     <Camera className="w-8 h-8 text-white mb-1" />
                     <span className="text-[10px] font-medium text-white">Upload</span>
                     <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isLoading} />
                 </label>
             </div>
             <p className="text-xs text-gray-500 font-medium">Click to upload photo</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6 text-left">
             <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">What is your Target Role?</label>
                <select 
                  value={targetRole} 
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B]"
                  required
                >
                  <option value="" disabled>Select a role...</option>
                  <option value="Robotics / Physical AI Intern">Robotics / Physical AI Intern</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                </select>
             </div>

             <button type="submit" disabled={isSaving} className="w-full bg-[#8B1D3B] hover:bg-[#7a1934] text-white py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                {isSaving ? 'Saving...' : 'Complete Profile'} <ArrowRight className="w-4 h-4" />
             </button>
          </form>
       </div>
    </div>
  )
}
