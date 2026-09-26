import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { SidebarNav, MobileNav } from '@/components/SidebarNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const initials = profile?.full_name 
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || 'ST'

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50/50">
      
      {/* Top Header - Full Width */}
      <header className="bg-white border-b border-gray-100 shrink-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Area */}
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
             <img src="/niat-logo.jpg" alt="NIAT" className="h-8 md:h-10 object-contain mix-blend-multiply" />
             <div className="border-l-2 border-[#8B1D3B] pl-3 ml-1 hidden sm:block">
               <h1 className="font-bold text-gray-900 leading-none text-lg md:text-xl">SkillOps</h1>
             </div>
          </Link>
          
          {/* Right Actions */}
          <div className="flex items-center gap-5 relative group">
            <button className="relative text-gray-400 hover:text-gray-600 transition-colors peer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* Notifications Dropdown */}
            <div className="absolute top-full right-10 mt-2 w-80 bg-white border border-gray-100 shadow-xl rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
               <h3 className="text-sm font-bold text-gray-900 mb-3">Notifications</h3>
               
               {['N26K01A0020', 'N26K01A0058', 'N26K01A0067'].includes(profile?.niat_id?.toUpperCase()) ? (
                 <div className="space-y-3">
                   <div className="flex gap-3 items-start">
                     <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full shrink-0"></div>
                     <div>
                       <p className="text-xs font-semibold text-gray-900">Your AI Roadmap is ready!</p>
                       <p className="text-[10px] text-gray-500">2 hours ago</p>
                     </div>
                   </div>
                   <div className="flex gap-3 items-start">
                     <div className="w-2 h-2 mt-1.5 bg-red-500 rounded-full shrink-0"></div>
                     <div>
                       <p className="text-xs font-semibold text-gray-900">You have 2 pending assessments</p>
                       <p className="text-[10px] text-gray-500">5 hours ago</p>
                     </div>
                   </div>
                   <div className="flex gap-3 items-start">
                     <div className="w-2 h-2 mt-1.5 bg-gray-300 rounded-full shrink-0"></div>
                     <div>
                       <p className="text-xs font-semibold text-gray-900">Welcome to SkillOps!</p>
                       <p className="text-[10px] text-gray-500">1 day ago</p>
                     </div>
                   </div>
                 </div>
               ) : (
                 <p className="text-xs text-gray-500 text-center py-4">No new notifications.</p>
               )}
            </div>

            <Link href="/profile" className="relative w-9 h-9 rounded-full overflow-hidden bg-purple-700 flex items-center justify-center shadow-sm border-2 border-white ring-2 ring-purple-100 hover:ring-purple-200 transition-all">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-semibold">{initials}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation */}
        <aside className="w-24 shrink-0 bg-white border-r border-gray-100 hidden md:flex flex-col h-full z-40 items-center py-6">
          <SidebarNav />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full bg-gray-50/30">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <MobileNav />
      </nav>

    </div>
  )
}
