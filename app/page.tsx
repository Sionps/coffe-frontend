'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const router = useRouter()

  useEffect(() => {
    router.push('/signup')
  }, [router])

  return null
}
