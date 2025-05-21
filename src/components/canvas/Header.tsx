'use client'

import { motion } from 'framer-motion'
import LoginButton from '../auth/LoginButton'
import { useRef, useEffect, useState } from 'react'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'
import AuthModal from '../auth/AuthModal'

interface HeaderProps {
  onHomeClick?: () => void;
  onAnimationComplete?: () => void;
}

export default function Header({ onHomeClick, onAnimationComplete }: HeaderProps) {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'contact'>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
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

  const handleHomeClick = () => {
    setCurrentPage('home');
    if (onHomeClick) {
      onHomeClick();
    }
  };

  const handleAboutClick = () => {
    setCurrentPage('about');
  };

  const handleContactClick = () => {
    setCurrentPage('contact');
  };

  const handleAuthModalOpen = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    if (!isRedirecting) {
      setIsAuthModalOpen(false);
    }
  };

  const handleRedirectingChange = (redirecting: boolean) => {
    setIsRedirecting(redirecting);
  };

  return (
    <>
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50"
      initial="hidden"
      animate="visible"
        variants={headerVariants}
      onAnimationComplete={() => {
        animationElementsRef.current.header = true;
        checkAllAnimationsComplete();
      }}
    >
        <div className="mx-auto max-w-7xl xl:max-w-7xl 2xl:max-w-[85%] 3xl:max-w-[80%] 4xl:max-w-[75%] 5xl:max-w-[70%] 6xl:max-w-[65%] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-16 md:h-16 lg:h-16 xl:h-16 2xl:h-20 3xl:h-24 4xl:h-28 5xl:h-32 6xl:h-32 items-center justify-between gap-4 sm:gap-5 md:gap-6 lg:gap-6 xl:gap-7 2xl:gap-6 3xl:gap-7 4xl:gap-8 5xl:gap-9 6xl:gap-10">
          <div className="flex items-center">
            <motion.div 
                className="text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl 5xl:text-5xl 6xl:text-6xl font-bold text-gray-900 select-none"
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
              className="flex items-center space-x-4 sm:space-x-5 md:space-x-6 lg:space-x-6 xl:space-x-7 2xl:space-x-6 3xl:space-x-7 4xl:space-x-8 5xl:space-x-9 6xl:space-x-10"
            variants={childrenVariants}
          >
            <motion.button 
                onClick={handleHomeClick}
                className={`text-sm sm:text-base md:text-base lg:text-base xl:text-base 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-3xl 6xl:text-4xl text-gray-600 hover:text-gray-900 transition-colors ${currentPage === 'home' ? 'font-semibold' : ''}`}
              variants={itemVariants}
              onAnimationComplete={() => {
                animationElementsRef.current.navItems[0] = true;
                checkAllAnimationsComplete();
              }}
            >
              Home
            </motion.button>
              <motion.button 
                onClick={handleAboutClick}
                className={`text-sm sm:text-base md:text-base lg:text-base xl:text-base 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-3xl 6xl:text-4xl text-gray-600 hover:text-gray-900 transition-colors ${currentPage === 'about' ? 'font-semibold' : ''}`}
              variants={itemVariants}
              onAnimationComplete={() => {
                animationElementsRef.current.navItems[1] = true;
                checkAllAnimationsComplete();
              }}
            >
              About
              </motion.button>
              <motion.button 
                onClick={handleContactClick}
                className={`text-sm sm:text-base md:text-base lg:text-base xl:text-base 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-3xl 6xl:text-4xl text-gray-600 hover:text-gray-900 transition-colors ${currentPage === 'contact' ? 'font-semibold' : ''}`}
              variants={itemVariants}
              onAnimationComplete={() => {
                animationElementsRef.current.navItems[2] = true;
                checkAllAnimationsComplete();
              }}
            >
              Contact
              </motion.button>
            <motion.div
              variants={itemVariants}
              onAnimationComplete={() => {
                animationElementsRef.current.navItems[3] = true;
                checkAllAnimationsComplete();
              }}
                className="scale-100 sm:scale-100 md:scale-100 lg:scale-100 xl:scale-95 2xl:scale-110 3xl:scale-125 4xl:scale-150 5xl:scale-175 6xl:scale-200 ml-4 sm:ml-5 md:ml-6 lg:ml-6 xl:ml-7 2xl:ml-6 3xl:ml-7 4xl:ml-8 5xl:ml-9 6xl:ml-10"
            >
                <LoginButton 
                  onSignIn={handleAuthModalOpen} 
                  onRedirectingChange={handleRedirectingChange}
                />
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

      {/* Page Overlays */}
      {currentPage === 'about' && (
        <AboutPage onClose={() => setCurrentPage('home')} />
      )}
      {currentPage === 'contact' && (
        <ContactPage onClose={() => setCurrentPage('home')} />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleAuthModalClose}
        isRedirecting={isRedirecting}
      />
    </>
  )
} 