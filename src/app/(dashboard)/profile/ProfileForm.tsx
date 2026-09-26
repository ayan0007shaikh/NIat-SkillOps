'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Camera, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getStudentSkills, getAverageSkill } from '@/lib/skillsData'

export default function ProfileForm({ initialProfile, userEmail }: { initialProfile: any, userEmail: string }) {
  const [profile, setProfile] = useState(initialProfile || {})
  const [isEditing, setIsEditing] = useState(false)
  const [skillsList, setSkillsList] = useState<{name: string, score: number}[]>(
    Object.entries(initialProfile?.custom_skills || {}).map(([name, score]) => ({ name, score: score as number }))
  )
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const studentSkills = getStudentSkills(profile)
  const readinessScore = getAverageSkill(studentSkills)

  const initials = profile?.full_name 
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : userEmail?.substring(0, 2).toUpperCase() || 'ST'

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
        const parsedSkills = skillsList.reduce((acc, curr) => {
            if (curr.name.trim()) acc[curr.name.trim()] = Number(curr.score);
            return acc;
        }, {} as Record<string, number>)

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: profile.full_name,
                campus: profile.campus,
                niat_id: profile.niat_id,
                target_role: profile.target_role,
                avatar_url: profile.avatar_url,
                custom_skills: parsedSkills
            })
            .eq('id', profile.id)
            
        if (error) throw error
        setIsEditing(false)
        window.location.reload()
    } catch (error) {
        console.error('Error updating profile:', error)
        alert('Failed to update profile.')
    } finally {
        setIsLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update state and instantly save to DB
      const newUrl = publicUrl
      setProfile({ ...profile, avatar_url: newUrl })
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newUrl })
        .eq('id', profile.id)

      if (updateError) throw updateError
      
      router.refresh()
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Error uploading avatar! Please run the storage.sql script in Supabase first.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isEditing) {
      return (
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Profile</h2>
              
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-purple-700 flex items-center justify-center text-3xl font-medium text-white mb-2 shadow-inner border-4 border-white">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span>{initials}</span>
                    )}
                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white mb-1" />
                        <span className="text-[10px] font-medium text-white">Upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isLoading} />
                    </label>
                </div>
                <span className="text-xs text-gray-500">{isLoading ? 'Uploading...' : 'Click photo to update'}</span>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={profile.full_name || ''} onChange={e => setProfile({...profile, full_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                  <select 
                    value={profile.campus || ''} 
                    onChange={e => setProfile({...profile, campus: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg text-black bg-white appearance-none" 
                    required
                  >
                    <option value="">Select your campus...</option>
                    <option value="NIAT Hyderabad">NIAT Hyderabad</option>
                    <option value="Chalapathi Institute of Engineering and Technology">Chalapathi Institute of Engineering and Technology</option>
                    <option value="GMR Institute of Technology">GMR Institute of Technology</option>
                    <option value="Ajeenkya DY Patil University">Ajeenkya DY Patil University</option>
                    <option value="Sanjay Ghodawat University">Sanjay Ghodawat University</option>
                    <option value="Noida International University">Noida International University</option>
                    <option value="SMR University">SMR University</option>
                    <option value="Sushant University">Sushant University</option>
                    <option value="Visakha Institute of Engineering & Technology">Visakha Institute of Engineering & Technology</option>
                    <option value="PK DAS Institute of Social Sciences, Health Sciences & Technology">PK DAS Institute of Social Sciences, Health Sciences & Technology</option>
                    <option value="Lingaya’s Institute of Management and Technology">Lingaya’s Institute of Management and Technology</option>
                    <option value="MVR College of Engineering and Technology">MVR College of Engineering and Technology</option>
                    <option value="Bharath Institute of Higher Education and Research">Bharath Institute of Higher Education and Research</option>
                    <option value="St. Peter’s Institute of Higher Education and Research (SPIHER)">St. Peter’s Institute of Higher Education and Research (SPIHER)</option>
                    <option value="Lingaya’s Vidyapeeth">Lingaya’s Vidyapeeth</option>
                    <option value="Sri Sri University">Sri Sri University</option>
                    <option value="T.S Mishra University">T.S Mishra University</option>
                    <option value="Subharti University">Subharti University</option>
                    <option value="SNS College of Technology">SNS College of Technology</option>
                    <option value="Chaitanya">Chaitanya</option>
                    <option value="Geeta University">Geeta University</option>
                    <option value="S-VYASA University School of Advanced Studies">S-VYASA University School of Advanced Studies</option>
                    <option value="Yenepoya Bangalore">Yenepoya Bangalore</option>
                    <option value="AMET University | Academy of Maritime Education & Training">AMET University | Academy of Maritime Education & Training</option>
                    <option value="Yenepoya University">Yenepoya University</option>
                    <option value="Vivekananda Global University">Vivekananda Global University</option>
                    <option value="B. S. Abdur Rahman Crescent Institute of Science & Technology">B. S. Abdur Rahman Crescent Institute of Science & Technology</option>
                    <option value="Annamacharya University">Annamacharya University</option>
                    <option value="Sandip University">Sandip University</option>
                    <option value="Nadimpalli Satyanarayana Raju Institute of Technology(NSRIT)">Nadimpalli Satyanarayana Raju Institute of Technology(NSRIT)</option>
                    <option value="Scope Global Skills University">Scope Global Skills University</option>
                    <option value="Alard University">Alard University</option>
                    <option value="Joy University">Joy University</option>
                    <option value="BEST Innovation University">BEST Innovation University</option>
                    <option value="Takshashila University">Takshashila University</option>
                    <option value="Chalapathi Institute of Technology">Chalapathi Institute of Technology</option>
                    <option value="Sanskriti University">Sanskriti University</option>
                    <option value="Aurora Deemed University">Aurora Deemed University</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIAT ID</label>
                  <input type="text" value={profile.niat_id || ''} onChange={e => setProfile({...profile, niat_id: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                  <input type="text" value={profile.target_role || ''} onChange={e => setProfile({...profile, target_role: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              
              <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Manage Skills</label>
                  <div className="space-y-3">
                    {skillsList.map((skill, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <select
                          value={skill.name}
                          onChange={(e) => {
                            const newList = [...skillsList];
                            newList[index].name = e.target.value;
                            setSkillsList(newList);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white"
                        >
                          <option value="">Select a skill...</option>
                          <option value="Python">Python</option>
                          <option value="C++">C++</option>
                          <option value="JavaScript">JavaScript</option>
                          <option value="React">React</option>
                          <option value="Git">Git</option>
                          <option value="Linux">Linux</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Computer Vision">Computer Vision</option>
                          <option value="ROS">ROS</option>
                          <option value="Robotics Fundamentals">Robotics Fundamentals</option>
                          <option value="Machine Learning">Machine Learning</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={skill.score}
                          onChange={(e) => {
                            const newList = [...skillsList];
                            newList[index].score = Number(e.target.value);
                            setSkillsList(newList);
                          }}
                          className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
                          placeholder="Score"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newList = [...skillsList];
                            newList.splice(index, 1);
                            setSkillsList(newList);
                          }}
                          className="text-red-500 hover:text-red-700 font-bold px-2 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSkillsList([...skillsList, { name: '', score: 50 }])}
                    className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Add Skill
                  </button>
              </div>

              <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 border rounded-lg font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={isLoading} className="flex-1 py-2 bg-[#8B1D3B] text-white rounded-lg font-medium hover:bg-[#7a1934] disabled:opacity-50">{isLoading ? 'Saving...' : 'Save Changes'}</button>
              </div>
          </form>
      )
  }

  return (
    <>
      <div className="flex flex-col items-center py-8">
        <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-purple-700 flex items-center justify-center shadow-lg mb-4 text-3xl font-medium text-white border-4 border-white">
                {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                <span>{initials}</span>
                )}
            </div>
            <label className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white mb-1" />
                <span className="text-[10px] text-white font-medium">Update</span>
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    await handlePhotoUpload(e);
                    // auto save photo
                    if (e.target.files?.[0]) {
                        setTimeout(() => document.getElementById('save-photo-btn')?.click(), 100);
                    }
                }} />
            </label>
        </div>
        <button id="save-photo-btn" className="hidden" onClick={handleSave}>Save</button>

        <h1 className="text-xl font-bold text-gray-900">{profile?.full_name || 'Student Name'}</h1>
        <p className="text-sm text-gray-500">{profile?.target_role || 'Target Role'}</p>
        <p className="text-xs text-gray-400 mt-1">{profile?.campus || 'NIAT Campus'}</p>

        <div className="mt-6 flex flex-col items-center">
            <button onClick={() => setIsEditing(true)} className="mb-6 px-4 py-1.5 border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-50">
                Edit Profile
            </button>
            <div className="w-24 h-24 rounded-full border-[6px] border-purple-700 flex flex-col items-center justify-center mb-6">
                <span className="text-2xl font-bold text-gray-900">{readinessScore}%</span>
                <span className="text-[10px] text-gray-500">readiness</span>
            </div>
            <form action="/auth/signout" method="post">
                <button type="submit" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign out
                </button>
            </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-sm">
         <div className="flex justify-between items-center p-4 border-b border-gray-50">
            <span className="text-gray-500">NIAT ID</span>
            <span className="font-medium text-gray-900">{profile?.niat_id || 'NIAT24CS0142'}</span>
         </div>
         <div className="flex justify-between items-center p-4 border-b border-gray-50">
            <span className="text-gray-500">Campus</span>
            <span className="font-medium text-gray-900">{profile?.campus || 'NIAT Hyderabad'}</span>
         </div>
         <div className="flex justify-between items-center p-4 border-b border-gray-50">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900">{userEmail}</span>
         </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Security</h3>
        <form onSubmit={async (e) => {
            e.preventDefault()
            const newPassword = (e.target as any).password.value.padEnd(6, '0')
            setIsLoading(true)
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            setIsLoading(false)
            if (error) alert('Error changing password: ' + error.message)
            else alert('Password successfully changed!')
            ;(e.target as HTMLFormElement).reset()
        }} className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                <input name="password" type="password" placeholder="Enter new password"  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                {isLoading ? 'Updating...' : 'Change Password'}
            </button>
        </form>
      </div>
    </>
  )
}
