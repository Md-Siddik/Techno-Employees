// HighlyRealisticAnalogClock.js
import React, { useEffect, useState } from 'react';

const HighlyRealisticAnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondHandStyle = {
    transform: `rotate(${seconds * 6}deg)`,
    transition: 'transform 0.1s rotetate ease-in-out',
  };
  const minuteHandStyle = {
    transform: `rotate(${minutes * 6 + seconds * 0.1}deg)`,
    transition: 'transform 0.2s rotetate ease-in-out',
  };
  const hourHandStyle = {
    transform: `rotate(${hours * 30 + minutes * 0.5}deg)`,
    transition: 'transform 0.3s rotetate ease-in-out',
  };

  return (
    <div style={styles.clockContainer}>
      <div style={styles.clockFace}>
        {/* Hour Marks and Numbers */}
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{ ...styles.hourMark, transform: `rotate(${i * 30}deg)` }}>
            <div style={styles.hourNumber}>{i === 0 ? 12 : i}</div>
          </div>
        ))}

        {/* Minute Marks */}
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.tick,
              ...(i % 5 === 0 ? styles.hourTick : styles.minuteTick),
              transform: `rotate(${i * 6}deg)`,
            }}
          />
        ))}

        {/* Clock Hands */}
        <div style={{ ...styles.hand, ...styles.hourHand, ...hourHandStyle }} />
        <div style={{ ...styles.hand, ...styles.minuteHand, ...minuteHandStyle }} />
        <div style={{ ...styles.hand, ...styles.secondHand, ...secondHandStyle }} />

        {/* Center Dot */}
        <div style={styles.centerDot} />

        {/* Glass Overlay */}
        <div style={styles.glassOverlay} />
      </div>
    </div>
  );
};

const styles = {
  clockContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  },
  clockFace: {
    position: 'relative',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    border: '10px solid #333',
    backgroundColor: '#f0f0f0',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3), 0 8px 12px rgba(0,0,0,0.5)',
  },
  tick: {
    position: 'absolute',
    width: '2px',
    height: '10px',
    backgroundColor: '#555',
    top: '15px',
    left: '50%',
    transformOrigin: 'center 130px',
  },
  hourTick: {
    height: '15px',
    width: '4px',
    backgroundColor: '#333',
  },
  minuteTick: {
    backgroundColor: '#888',
  },
  hourMark: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  hourNumber: {
    fontSize: '1.2em',
    color: '#333',
    transform: 'translateY(-130%)',
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
  },
  hourHand: {
    width: '8px',
    height: '70px',
    backgroundColor: '#333',
    borderRadius: '4px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    zIndex: 3,
  },
  minuteHand: {
    width: '4px',
    height: '100px',
    backgroundColor: '#555',
    borderRadius: '2px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    zIndex: 2,
  },
  secondHand: {
    width: '2px',
    height: '110px',
    backgroundColor: '#e74c3c',
    borderRadius: '1px',
    zIndex: 1,
  },
  centerDot: {
    width: '14px',
    height: '14px',
    backgroundColor: '#333',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // Centers the dot perfectly
    zIndex: 4,
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.4)',
  },
  glassOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'radial-gradient(circle at top left, rgba(255, 255, 255, 0.3) 20%, transparent 60%)',
    zIndex: 5,
    pointerEvents: 'none',
  },
};

export default HighlyRealisticAnalogClock;