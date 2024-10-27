// NeonClock.js
import React, { useEffect, useState } from 'react';

const NeonClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const seconds = time.getSeconds() * 6;
  const minutes = time.getMinutes() * 6 + seconds / 60;
  const hours = ((time.getHours() % 12) + minutes / 360) * 30;

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="relative w-80 h-80 rounded-full border-4 border-neon-blue shadow-neon-blue flex items-center justify-center">
        
        {/* Center Dot */}
        <div className="absolute w-4 h-4 bg-neon-blue rounded-full shadow-neon-blue z-20"></div>

        {/* Hour Hand */}
        <div
          style={{ transform: `rotate(${hours}deg)` }}
          className="absolute w-2 h-16 bg-neon-pink origin-bottom translate-y-8 rounded-lg shadow-neon-pink transition-transform duration-300 ease-in-out"
        ></div>

        {/* Minute Hand */}
        <div
          style={{ transform: `rotate(${minutes}deg)` }}
          className="absolute w-1.5 h-24 bg-neon-green origin-bottom translate-y-4 rounded-lg shadow-neon-green transition-transform duration-300 ease-in-out"
        ></div>

        {/* Second Hand */}
        <div
          style={{ transform: `rotate(${seconds}deg)` }}
          className="absolute w-1 h-28 bg-neon-yellow origin-bottom translate-y-2 rounded-lg shadow-neon-yellow transition-transform duration-150 ease-linear"
        ></div>

        {/* Clock Hour Markers */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{ transform: `rotate(${i * 30}deg)` }}
            className="absolute w-1.5 h-6 bg-neon-blue origin-bottom -translate-y-36 rounded-full shadow-neon-blue"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default NeonClock;
