'use client'

import { useEffect, useState } from 'react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  isRedirecting?: boolean
}

export default function AuthModal({ isOpen, onClose, isRedirecting = false }: AuthModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the element is in the DOM
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 grid place-items-center">
          {/* Backdrop */}
      <div 
        className={`absolute inset-0 top-[4rem] bg-white/30 backdrop-blur-md transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={isRedirecting ? undefined : onClose}
          />
          
          {/* Modal */}
      <div 
        className={`w-4/5 max-w-md bg-white rounded-lg shadow-xl p-8 transition-all duration-500 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
              <h2 className="text-2xl font-bold mb-4">Signing in...</h2>
              <p className="text-gray-600 mb-6">
          {isRedirecting 
            ? "Redirecting to complete authentication..."
            : "Please complete the authentication process in the popup window."}
              </p>
              
              <div className="flex justify-center mb-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
              </div>
              
              <p className="text-sm text-gray-500">
                If the popup was blocked, please enable popups for this site and try again.
              </p>
              
              <button
                onClick={onClose}
          className="mt-6 px-4 py-2 w-full bg-neutral-950 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isRedirecting}
              >
                Cancel
              </button>
            </div>
    </div>
  )
} 