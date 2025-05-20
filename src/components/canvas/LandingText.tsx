'use client'

import { motion } from 'framer-motion'
import { Numans } from 'next/font/google'
import { useEffect } from 'react'

const numans = Numans({
  weight: '400',
  subsets: ['latin'],
})

interface LandingTextProps {
  onGetStarted: () => void;
  onPrerender?: () => void;
}

export default function LandingText({ onGetStarted, onPrerender }: LandingTextProps) {
  // Call the onPrerender callback when the component is mounted
  useEffect(() => {
    if (onPrerender) {
      onPrerender();
    }
  }, [onPrerender]);

  return (
    <motion.div 
      className="flex flex-col justify-center w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.8,
        exit: { 
          duration: 0.6
        }
      }}
    >
      <motion.h2 
        className={`text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl 2xl:text-9xl font-bold mb-4 sm:mb-6 md:mb-6 lg:mb-7 xl:mb-16 2xl:mb-24 ${numans.className}`}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{
          opacity: { duration: 0.5, delay: 0.3 },
          x: {
            type: "spring",
            stiffness: 70,
            damping: 12,
            mass: 1,
            delay: 0.3
          },
          exit: {
            duration: 0.3,
            delay: 0.1
          }
        }}
      >
        Find Your Unicorn
      </motion.h2>
      
      <div>
        <motion.p 
          className="text-base sm:text-lg md:text-lg lg:text-lg xl:text-lg 2xl:text-3xl text-gray-600 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ 
            duration: 1, 
            ease: "easeOut", 
            delay: 0.5,
            exit: {
              duration: 0.3,
              delay: 0.2
            }
          }}
        >
          Finding the right company to build your future is hard. Search our vast database of 1000+ companies and find the perfect fit for you.
        </motion.p>
        <motion.p 
          className="text-base sm:text-lg md:text-lg lg:text-lg xl:text-lg 2xl:text-3xl text-gray-600 leading-relaxed mt-3 sm:mt-4 md:mt-4 lg:mt-4 xl:mt-4 2xl:mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ 
            duration: 1, 
            ease: "easeOut", 
            delay: 0.6,
            exit: {
              duration: 0.3,
              delay: 0.25
            }
          }}
        >
          Sign in with your Google account and start the journey to finding your future career- It could be closer than you think!
        </motion.p>
        
        <motion.button
          onClick={onGetStarted}
          className="mt-6 sm:mt-7 md:mt-7 lg:mt-7 xl:mt-8 2xl:mt-24 px-6 sm:px-7 md:px-7 lg:px-7 xl:px-7 2xl:px-16 py-2.5 sm:py-3 md:py-3 lg:py-3 xl:py-3 2xl:py-8 rounded-lg sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-lg 2xl:rounded-2xl text-base sm:text-lg md:text-lg lg:text-lg xl:text-lg 2xl:text-4xl text-gray-800 font-medium relative overflow-hidden group hover:-translate-y-[5px] transition-transform duration-500 ease-in-out bg-gray-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            opacity: { duration: 0.5, delay: 0.8 },
            y: { 
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.8
            },
            exit: {
              duration: 0.3,
              delay: 0.3
            }
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px'
          }}
        >
          {/* Button text */}
          <span className="relative">Get Started</span>
        </motion.button>
      </div>
    </motion.div>
  )
} 