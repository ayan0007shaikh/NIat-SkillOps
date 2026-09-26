'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Map, CheckSquare, Briefcase } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/skills', icon: BookOpen, label: 'Skills' },
  { href: '/roadmap', icon: Map, label: 'Roadmap' },
  { href: '/assessments', icon: CheckSquare, label: 'Exams' },
  { href: '/projects', icon: Briefcase, label: 'Projects' },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 flex flex-col gap-4 w-full px-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all font-medium mx-1 ${isActive ? 'text-blue-600 bg-blue-100/50 hover:bg-blue-100' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'}`}>
            <Icon className="w-6 h-6" />
            <span className="text-[11px] text-center">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="px-2 h-16 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
