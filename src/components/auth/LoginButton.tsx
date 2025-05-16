'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"
import Image from "next/image"
import { useUnicorn } from "@/contexts/UnicornContext"
import AuthModal from "./AuthModal"

export default function LoginButton() {
  const { data: session, status } = useSession()
  const { savedUnicorns, isLoading } = useUnicorn()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleSignIn = () => {
    setIsAuthModalOpen(true)
    signIn("google", { callbackUrl: window.location.href, redirect: false })
  }

  if (status === "loading" || isLoading) {
    return (
      <button className="px-3 py-1.5 text-sm rounded-lg bg-neutral-950 text-neutral-50">
        Loading...
      </button>
    )
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
        onClick={handleSignIn}
        className="px-3 py-1.5 text-sm rounded-lg bg-neutral-950 text-neutral-50 hover:bg-neutral-900 transition-colors"
      >
        Sign In
      </button>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  )
} 