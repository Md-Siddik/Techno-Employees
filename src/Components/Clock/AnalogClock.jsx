import { useEffect, useState } from 'react';

const AnalogClock = () => {
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
    transition: 'transform 0.1s rotate ease-in-out',
  };
  const minuteHandStyle = {
    transform: `rotate(${minutes * 6 + seconds * 0.1}deg)`,
    transition: 'transform 0.2s rotate ease-in-out',
  };
  const hourHandStyle = {
    transform: `rotate(${hours * 30 + minutes * 0.5}deg)`,
    transition: 'transform 0.3s rotate ease-in-out',
  };

  return (
    <div className="flex items-center justify-center" style={styles.clockContainer}>
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
    width: '500px',   // Increased width
    height: '500px',  // Increased height
    borderRadius: '50%',
    border: '14px solid #333', // Thicker border for larger size
    backgroundColor: '#ffffff',
    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3), 0 10px 14px rgba(0,0,0,0.5)',
  },
  tick: {
    position: 'absolute',
    width: '2px',
    height: '20px',         // Increased height for visibility
    backgroundColor: '#555',
    top: '35px',           // Positioned closer to the edge for larger clock
    left: '50%',
    transformOrigin: 'center 200px',  // Adjusted to fit larger face
  },
  hourTick: {
    height: '25px',         // Taller for hour ticks
    width: '5px',           // Thicker for hour ticks
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
    fontSize: '1.5em',       // Increased font size
    color: '#333',
    transform: 'translateY(-160%)', // Positioned closer to the edge
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
  },
  hourHand: {
    width: '10px',
    height: '120px',  // Increased height for larger size
    backgroundColor: '#333',
    borderRadius: '4px',
    boxShadow: '0 5px 7px rgba(0, 0, 0, 0.3)',
    zIndex: 3,
  },
  minuteHand: {
    width: '6px',
    height: '170px', // Increased height for larger size
    backgroundColor: '#555',
    borderRadius: '3px',
    boxShadow: '0 5px 7px rgba(0, 0, 0, 0.2)',
    zIndex: 2,
  },
  secondHand: {
    width: '3px',
    height: '200px', // Increased height for larger size
    backgroundColor: '#e74c3c',
    borderRadius: '1.5px',
    zIndex: 1,
  },
  centerDot: {
    width: '20px', // Increased size for larger clock
    height: '20px', 
    backgroundColor: '#333',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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

export default AnalogClock;
