'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { status } = useSession()
  
  // Close the modal when authentication completes
  useEffect(() => {
    if (status === 'authenticated' && isOpen) {
      onClose()
    }
  }, [status, isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.25 }}
          >
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full pointer-events-auto">
              <h2 className="text-2xl font-bold mb-4">Signing in...</h2>
              <p className="text-gray-600 mb-6">
                Please complete the authentication process in the popup window.
              </p>
              
              <div className="flex justify-center mb-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
              </div>
              
              <p className="text-sm text-gray-500">
                If the popup was blocked, please enable popups for this site and try again.
              </p>
              
              <button
                onClick={onClose}
                className="mt-6 px-4 py-2 w-full bg-neutral-950 text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 