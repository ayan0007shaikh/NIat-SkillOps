'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import studentData from '@/lib/studentData.json'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [niatId, setNiatId] = useState('')
  const [fullName, setFullName] = useState('')
  const [campus, setCampus] = useState('')
  
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Auto-fill full name based on NIAT ID
  useEffect(() => {
    if (niatId && (studentData as Record<string, string>)[niatId.toUpperCase()]) {
      setFullName((studentData as Record<string, string>)[niatId.toUpperCase()])
    }
  }, [niatId])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const cleanEmail = email.trim().toLowerCase()
    const securePassword = password.padEnd(6, '0')
    const cleanNiatId = niatId.trim().toUpperCase()

    // STRICT EMAIL VALIDATION FOR SPECIFIC NIAT IDs
    const strictMapping: Record<string, string> = {
      'N26K01A0020': 'paramanandaherwade86@gmail.com',
      'N26K01A0058': 'ayan0007shaikh@gmail.com',
      'N26K01A0067': 'sharathmanuur100@gmail.com'
    }

    if (strictMapping[cleanNiatId] && cleanEmail !== strictMapping[cleanNiatId]) {
      setError(`Security Alert: The email address provided does not match the registered student email for NIAT ID ${cleanNiatId}.`)
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: securePassword,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
            // Include user metadata for the database trigger
            const { error: signUpError } = await supabase.auth.signUp({
                  email: cleanEmail,
                  password: securePassword,
                options: {
                  data: {
                    full_name: fullName,
                    niat_id: niatId,
                    campus: campus
                  }
                }
            })
            if (signUpError) throw signUpError
        } else {
            throw error
        }
      } else if (data.user && fullName) {
         // HACKATHON MAGIC: If they logged in successfully, force update their profile with the new typed data!
         // This allows you to use ONE email account to demo different students instantly.
         await supabase.from('profiles').update({
             full_name: fullName,
             niat_id: niatId,
             campus: campus
         }).eq('id', data.user.id)
      }
      
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-10">
          <img src="/niat-logo.jpg" alt="NIAT" className="h-16 object-contain mix-blend-multiply" />
          <div className="border-l-2 border-[#8B1D3B] pl-4">
            <h1 className="font-bold text-gray-900 leading-none text-2xl">SkillOps</h1>
            <p className="text-xs text-gray-500 tracking-wider mt-1">CAREER OPERATING SYSTEM</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back</h2>
        <p className="text-sm text-gray-500 mb-8">Sign in with your NIAT student credentials.</p>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIAT ID</label>
            <input 
              type="text" 
              value={niatId}
              onChange={(e) => setNiatId(e.target.value)}
              placeholder="N26K01A..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B] uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
            <select 
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B] appearance-none bg-white"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ayan.shaikh@niat.edu.in"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-700">Forgot?</a>
            </div>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B]"
            />
          </div>

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8B1D3B] hover:bg-[#7a1934] text-white font-medium py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Demo mode — any valid-looking details will sign you in.
        </p>
      </div>
    </div>
  )
}
