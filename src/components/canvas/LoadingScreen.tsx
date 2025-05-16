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
        className="mb-10 relative"
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
          variants={gradientVariants}
          initial="initial"
          animate="animate"
          style={{
            backgroundSize: '200% 200%',
          }}
        />
        <motion.div
          className="absolute top-8 left-4 transform rotate-45 w-4 h-16 bg-white rounded-full"
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [0.95, 1, 0.95]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className={`text-4xl font-bold text-gray-800 mb-4 ${numans.className}`}
      >
        Finding Your Unicorn
      </motion.h1>

      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center"
      >
        <motion.p 
          className="text-gray-600 mb-6"
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
        
        <div className="flex space-x-3 mt-4 pt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
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