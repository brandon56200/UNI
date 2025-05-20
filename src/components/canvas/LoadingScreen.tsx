'use client'

import { motion } from 'framer-motion'
import { Numans } from 'next/font/google'
import { useEffect, useState } from 'react'

const numans = Numans({
  weight: '400',
  subsets: ['latin'],
})

function LoadingScreen() {
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
        className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 2xl:mb-20 relative scale-75 sm:scale-85 md:scale-90 lg:scale-95 xl:scale-95 2xl:scale-100"
      >
        <motion.div
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 2xl:w-48 2xl:h-48 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
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
        className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-10 ${numans.className}`}
      >
        Finding Your Unicorn
      </motion.h1>

      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center"
      >
        <motion.p 
          className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl text-gray-600 mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 2xl:mb-12"
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
        
        <div className="flex space-x-1.5 sm:space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-8 mt-1 sm:mt-2 md:mt-3 lg:mt-4 xl:mt-5 2xl:mt-8 pt-0.5 sm:pt-1 md:pt-2 lg:pt-3 xl:pt-4 2xl:pt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 2xl:w-6 2xl:h-6 rounded-full"
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

export default LoadingScreen; 