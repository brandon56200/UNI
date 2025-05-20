'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"
import Image from "next/image"
import { useUnicorn } from "@/contexts/UnicornContext"
import AuthModal from "./AuthModal"

export default function LoginButton() {
  const { data: session, status } = useSession()
  const { savedUnicorns } = useUnicorn()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleSignIn = () => {
    setIsAuthModalOpen(true)
    signIn("google", { callbackUrl: window.location.href, redirect: false })
  }

  if (session?.user?.image) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden relative">
          <Image
            src={session.user.image}
            alt="Profile picture"
            fill
            className="object-cover"
          />
        </div>
        <button
          onClick={() => signOut({ redirect: false })}
          className="px-3 py-1.5 text-sm rounded-lg bg-neutral-950 text-neutral-50 hover:bg-neutral-900 transition-colors"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsAuthModalOpen(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Sign in
      </button>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
} 