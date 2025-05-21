'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { motion } from "framer-motion"

interface LoginButtonProps {
  onSignIn: () => void;
  onRedirectingChange: (redirecting: boolean) => void;
}

export default function LoginButton({ onSignIn, onRedirectingChange }: LoginButtonProps) {
  const { data: session } = useSession()

  // Add debug logging
  console.log('Session data:', session)
  console.log('User image:', session?.user?.image)

  const handleSignIn = async () => {
    try {
      onSignIn()
      // Start the sign-in process without immediate redirect
      const result = await signIn('google', { 
        callbackUrl: '/',
        redirect: false,
        prompt: 'select_account'
      })

      if (result?.error) {
        console.error('Sign in error:', result.error)
      } else if (result?.url) {
        // Set redirecting state
        onRedirectingChange(true)
        // Wait a moment to ensure the modal is visible
        await new Promise(resolve => setTimeout(resolve, 100))
        // Now redirect
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Sign in error:', error)
      onRedirectingChange(false)
    }
  }

  if (session) {
    const getInitial = (email: string) => {
      return email.charAt(0).toUpperCase();
    };

    console.log('Profile picture URL:', session.user?.image);
    console.log('User email:', session.user?.email);
    console.log('User name:', session.user?.name);

    return (
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => signOut()}
          className="px-3 py-1.5 bg-neutral-950 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm"
        >
          Sign Out
        </motion.button>
        <div className="relative group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-full overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
          >
            <div className="w-full h-full bg-gradient-to-bl from-pink-600 via-pink-500 via-blue-500 to-blue-600 flex items-center justify-center animate-gradient bg-[length:300%_300%]">
              <span className="text-white font-bold text-lg">
                {getInitial(session.user?.email || 'U')}
              </span>
            </div>
          </motion.div>
          <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="text-sm font-medium text-neutral-900">{session.user?.name}</div>
            <div className="text-xs text-neutral-500">{session.user?.email}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
        onClick={handleSignIn}
      className="px-3 py-1.5 bg-neutral-950 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm"
      >
        Sign In
    </motion.button>
  )
} 