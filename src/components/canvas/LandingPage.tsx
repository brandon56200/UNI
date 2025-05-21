'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Canvas from './Canvas'
import LandingText from './LandingText'
import Header from './Header'
import FilteredGrid from '../FilteredGrid'
import LoadingScreen from './LoadingScreen'
import { createPortal } from 'react-dom'

export default function LandingPage() {
  const [isGridVisible, setIsGridVisible] = useState(false)
  const [isLandingVisible, setIsLandingVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [componentsPrerendered, setComponentsPrerendered] = useState(false)
  const [headerAnimationComplete, setHeaderAnimationComplete] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [shouldUnmountCanvas, setShouldUnmountCanvas] = useState(false)
  
  // References to track if components have been rendered
  const canvasRenderedRef = useRef(false)
  const textRenderedRef = useRef(false)
  const loadingExitCompleteRef = useRef(false)
  const getStartedClickedRef = useRef(false)

  // Pre-render components while loading screen is visible
  useEffect(() => {
    if (isLoading && !componentsPrerendered) {
      setComponentsPrerendered(true)
    }
  }, [isLoading, componentsPrerendered])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Handle loading screen exit animation completion
  const handleLoadingExit = () => {
    loadingExitCompleteRef.current = true;
    setHeaderVisible(true);
  }

  // Effect to show landing content after header animation completes
  useEffect(() => {
    if (headerAnimationComplete && !isLandingVisible && !isLoading && !getStartedClickedRef.current) {
      const timer = setTimeout(() => {
        setIsLandingVisible(true)
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [headerAnimationComplete, isLandingVisible, isLoading])

  const handleHomeClick = () => {
    if (isGridVisible) {
      getStartedClickedRef.current = false;
      setIsGridVisible(false)
      setTimeout(() => {
        setIsLandingVisible(true)
      }, 800)
    }
  }

  const handleGetStarted = () => {
    getStartedClickedRef.current = true;
    setIsLandingVisible(false);
    
    setTimeout(() => {
      setIsGridVisible(true);
    }, 300);
  }
  
  const handleLandingExit = () => {
    // Delay canvas unmounting until after redirect
    if (isGridVisible) {
      setTimeout(() => {
        setShouldUnmountCanvas(true);
      }, 1000); // Give enough time for the redirect to complete
    }
  }

  const onCanvasPrerendered = () => {
    canvasRenderedRef.current = true
  }

  const onTextPrerendered = () => {
    textRenderedRef.current = true
  }

  const handleHeaderAnimationComplete = () => {
    setHeaderAnimationComplete(true)
  }

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden relative max-h-screen">
      {/* Conditionally render header based on loading state */}
      <AnimatePresence>
        {headerVisible && (
          <div className="w-full z-10">
            <Header 
              onHomeClick={handleHomeClick} 
              onAnimationComplete={handleHeaderAnimationComplete}
            />
          </div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 relative overflow-hidden">
        {/* Pre-render components in hidden divs */}
        {componentsPrerendered && (
          <div aria-hidden={true} className="absolute opacity-0 pointer-events-none invisible">
            <Canvas isScrolling={false} onPrerender={onCanvasPrerendered} />
            <div className="w-0 h-0 overflow-hidden">
              <LandingText onGetStarted={() => {}} onPrerender={onTextPrerendered} />
            </div>
          </div>
        )}
      
        {/* Loading Screen */}
        <AnimatePresence onExitComplete={handleLoadingExit} mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              className="absolute inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ 
                opacity: 0,
                transition: { 
                  duration: 0.5,
                  ease: "easeInOut"
                } 
              }}
            >
              <LoadingScreen />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Landing Content */}
        <AnimatePresence 
          onExitComplete={handleLandingExit}
          mode="wait"
        >
          {isLandingVisible && (
            <motion.div
              key="landing"
              className="grid grid-cols-2 gap-8 w-4/5 h-4/5 absolute inset-0 m-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ 
                opacity: 0,
                transition: { 
                  duration: 0.5,
                  when: "afterChildren"
                }
              }}
            >
              {/* Left column with text */}
              <div className="relative h-full flex items-center">
                <LandingText 
                  onGetStarted={handleGetStarted}
                  onPrerender={onTextPrerendered}
                />
              </div>

              {/* Right column with Canvas */}
              <motion.div 
                className="w-full h-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ 
                  opacity: 0, 
                  y: -80,
                  transition: {
                    duration: 0.6,
                    ease: "easeInOut"
                  }
                }}
                transition={{
                  duration: 0.75,
                  opacity: { 
                    duration: 1,
                    ease: "easeInOut"
                  },
                  y: {
                    duration: 1.2,
                    ease: "easeOut"
                  }
                }}
              >
                {!shouldUnmountCanvas && (
                  <Canvas 
                    isScrolling={isGridVisible} 
                    onPrerender={onCanvasPrerendered}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtered Grid */}
        <AnimatePresence mode="wait">
          {isGridVisible && (
            <motion.div
              key="filtered-grid"
              className="w-4/5 xl:w-4/5 2xl:w-[85%] absolute inset-0 m-auto flex items-center justify-center h-full mt-10 overflow-hidden"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ 
                duration: 0.7,
                ease: "easeOut",
                opacity: { duration: 0.5 }
              }}
            >
              <FilteredGrid />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 