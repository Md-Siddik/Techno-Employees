import { useEffect, useState } from "react";

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-900 text-white p-20 rounded-lg shadow-2xl text-center animate-fadeIn border-4 border-indigo-300">
        <p className="text-7xl font-bold transition-all duration-500 ease-in-out text-indigo-300 glow-effect">
          {formatTime(time)}
        </p>
      </div>
    </div>
  );
}

export default DigitalClock;