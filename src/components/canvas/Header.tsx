'use client'

import { motion } from 'framer-motion'
import LoginButton from '../auth/LoginButton'
import { useRef, useEffect } from 'react'

interface HeaderProps {
  onHomeClick?: () => void;
  onAnimationComplete?: () => void;
}

export default function Header({ onHomeClick, onAnimationComplete }: HeaderProps) {
  const animationElementsRef = useRef({
    header: false,
    logo: false,
    navItems: [false, false, false, false] // Home, About, Contact, Login
  });
  
  // Check if all animations are complete and notify parent
  const checkAllAnimationsComplete = () => {
    const { header, logo, navItems } = animationElementsRef.current;
    const allNavItemsDone = navItems.every(item => item);
    
    if (header && logo && allNavItemsDone && onAnimationComplete) {
      onAnimationComplete();
    }
  };
  
  // Reset animation tracking when component unmounts
  useEffect(() => {
    return () => {
      animationElementsRef.current = {
        header: false,
        logo: false,
        navItems: [false, false, false, false]
      };
    };
  }, []);

  // Define variants for staggered animation
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren" 
      }
    }
  };

  const childrenVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.2,
        ease: "easeOut" 
      }
    }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => {
        animationElementsRef.current.header = true;
        checkAllAnimationsComplete();
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              className="text-3xl font-bold text-gray-900"
              variants={itemVariants}
              onAnimationComplete={() => {
                animationElementsRef.current.logo = true;
                checkAllAnimationsComplete();
              }}
            >
              🦄 UNI
            </motion.div>
          </div>
          
          <motion.nav 
            className="flex items-center space-x-8"
            variants={childrenVariants}
          >
            <motion.button 
              onClick={onHomeClick}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              variants={itemVariants}
              onAnimationComplete={() => {
                animationElementsRef.current.navItems[0] = true;
                checkAllAnimationsComplete();
              }}
            >
              Home
            </motion.button>
            <motion.a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              variants={itemVariants}
              onAnimationComplete={() => {
                animationElementsRef.current.navItems[1] = true;
                checkAllAnimationsComplete();
              }}
            >
              About
            </motion.a>
            <motion.a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              variants={itemVariants}
              onAnimationComplete={() => {
                animationElementsRef.current.navItems[2] = true;
                checkAllAnimationsComplete();
              }}
            >
              Contact
            </motion.a>
            <motion.div
              variants={itemVariants}
              onAnimationComplete={() => {
                animationElementsRef.current.navItems[3] = true;
                checkAllAnimationsComplete();
              }}
            >
              <LoginButton />
            </motion.div>
          </motion.nav>
        </div>
      </div>
      
      {/* Glassmorphic background */}
      <div 
        className="absolute inset-0 -z-10 backdrop-blur-md bg-white/30 border-b border-white/20"
        style={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      />
    </motion.header>
  )
} 