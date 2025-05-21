'use client'

import { motion } from 'framer-motion'
import { Numans } from 'next/font/google'
import { useEffect, useState } from 'react'

const numans = Numans({
  weight: '400',
  subsets: ['latin'],
})

export default function LoadingScreen() {
  const [loadingText, setLoadingText] = useState('Loading')
  
  // Cycle through different loading messages
  useEffect(() => {
    const texts = [
      'Finding unicorns',
      'Polishing horns',
      'Gathering magic',
      'Almost there'
    ]
    
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % texts.length
      setLoadingText(texts[index])
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  const variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const logoVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0,
      rotateY: -30
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  // Subtle rainbow gradient animation for the unicorn theme
  const gradientVariants = {
    initial: { backgroundPosition: '0% 50%' },
    animate: { 
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Infinity,
      }
    }
  }

  const spinnerVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        ease: "linear",
        repeat: Infinity
      }
    }
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full bg-gray-50 overflow-hidden max-h-screen"
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {/* Logo or icon */}
      <motion.div
        variants={logoVariants}
        className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 2xl:mb-14 3xl:mb-16 4xl:mb-18 5xl:mb-20 6xl:mb-24 relative scale-75 sm:scale-85 md:scale-90 lg:scale-95 xl:scale-95 2xl:scale-100 3xl:scale-105 4xl:scale-110 5xl:scale-115 6xl:scale-120"
      >
        <motion.div
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 3xl:w-40 3xl:h-40 4xl:w-44 4xl:h-44 5xl:w-48 5xl:h-48 6xl:w-52 6xl:h-52 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
          variants={gradientVariants}
          initial="initial"
          animate="animate"
          style={{
            backgroundSize: '200% 200%',
          }}
        />
        <motion.div
          className="absolute top-[15%] left-[15%] w-[40%] h-[40%] bg-white/30 rounded-full blur-[1px]"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [0.95, 1, 0.95]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-white/40 rounded-full blur-[2px]"
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [0.95, 1, 0.95]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.2
          }}
        />
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl 5xl:text-8xl 6xl:text-9xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 3xl:mb-8 4xl:mb-9 5xl:mb-10 6xl:mb-12 ${numans.className}`}
      >
        Finding Your Unicorn
      </motion.h1>

      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center"
      >
        <motion.p 
          className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl 6xl:text-5xl text-gray-600 mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 2xl:mb-9 3xl:mb-10 4xl:mb-11 5xl:mb-12 6xl:mb-14"
          animate={{ 
            opacity: [0.7, 1, 0.7] 
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {loadingText}
        </motion.p>
        
        <div className="flex space-x-1.5 sm:space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 3xl:space-x-7 4xl:space-x-8 5xl:space-x-9 6xl:space-x-10 mt-1 sm:mt-2 md:mt-3 lg:mt-4 xl:mt-5 2xl:mt-6 3xl:mt-7 4xl:mt-8 5xl:mt-9 6xl:mt-10 pt-0.5 sm:pt-1 md:pt-2 lg:pt-3 xl:pt-4 2xl:pt-5 3xl:pt-6 4xl:pt-7 5xl:pt-8 6xl:pt-9">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 2xl:w-4 2xl:h-4 3xl:w-5 3xl:h-5 4xl:w-6 4xl:h-6 5xl:w-7 5xl:h-7 6xl:w-8 6xl:h-8 rounded-full"
              style={{
                backgroundColor: i === 0 ? '#8B5CF6' : i === 1 ? '#EC4899' : '#3B82F6'
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
} 