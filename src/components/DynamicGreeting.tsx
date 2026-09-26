'use client'

import { useState, useEffect } from 'react'

export function DynamicGreeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState('Good day')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  return (
    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
      {greeting}, {name} <span role="img" aria-label="wave">👋</span>
    </h1>
  )
}
