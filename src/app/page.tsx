'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Space Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E2A45] via-[#0F1419] to-[#000000]">
        {/* Subtle Stars */}
        <div className="absolute inset-0">
          {mounted && Array.from({ length: 80 }).map((_, i) => {
            let left, top;
            do {
              left = Math.random() * 100;
              top = Math.random() * 100;
            } while (
              // Evitar área central donde está el texto (zona ligeramente más grande: 32% a 68% horizontal y 43% a 57% vertical)
              left > 32 && left < 68 && top > 43 && top < 57
            );
            
            return (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-twinkle-subtle"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  opacity: Math.random() * 0.6 + 0.3,
                }}
              />
            );
          })}
        </div>

        {/* Larger subtle stars */}
        <div className="absolute inset-0">
          {mounted && Array.from({ length: 15 }).map((_, i) => {
            let left, top;
            do {
              left = Math.random() * 100;
              top = Math.random() * 100;
            } while (
              // Evitar área central donde está el texto (zona ligeramente más grande para estrellas grandes)
              left > 28 && left < 72 && top > 40 && top < 60
            );
            
            return (
              <div
                key={`star-${i}`}
                className="absolute bg-white rounded-full animate-twinkle-subtle"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${Math.random() * 1.5 + 2}px`,
                  height: `${Math.random() * 1.5 + 2}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 4 + 3}s`,
                  opacity: Math.random() * 0.8 + 0.4,
                }}
              />
            );
          })}
        </div>

        {/* Nebula effect */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent opacity-30"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-radial from-blue-800/10 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-indigo-700/15 via-transparent to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 
            className="text-6xl md:text-7xl lg:text-8xl font-normal tracking-wider select-none"
            style={{ 
              fontFamily: '"Times New Roman", Times, serif',
              color: '#FFFFFF',
              lineHeight: '1',
              letterSpacing: '0.02em',
            }}
          >
            Nothing
          </h1>
        </div>
      </div>
    </div>
  );
}
