'use client'
import React from 'react';
import { motion, Variants } from 'framer-motion';

function Wrapper({ children }: { children: React.ReactNode }) {
  const sh = 'SHHHHHHHH!!';
  const ease = [0.64, 0, 0.78, 0]

  if (typeof window === 'undefined') return

  // Container that slides out to the left
  const containerVariants: Variants = {
    initial: { x: "-60vw" },
    animate: {
      x: '-250vw',
      transition: { duration: 3, ease },
    },
  };

  
  const h1Variants: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.22,
        ease,
      },
    },
  };

  
  const letterVariants: Variants = {
    initial: { opacity: 0, fontSize: "10px" },
    animate: {
      opacity: 1,
      fontSize: `${Math.min(200, (window.innerWidth / 4))}px`,
      transition: { duration: 1.7 },
    },
  };

  return (
    <div className="relative">
      {children}
      <motion.div
        className="w-[200vw] h-screen fixed flex items-center top-0 left-0 bg-background"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.h1 className="w-full text-6xl mx-auto text-right text-nowrap overflow-hidden"
         variants={h1Variants} initial="initial" animate="animate">
          {sh.split('').map((c, i) => (
            <motion.span className='inline-block' key={i} variants={letterVariants}>
              {c}
            </motion.span>
          ))}
        </motion.h1>
      </motion.div>
    </div>
  );
}

export default Wrapper;
