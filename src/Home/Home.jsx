import { useState } from 'react';
import AnalogClock from '../Clock/AnalogClock';
import DigitalClock from '../Clock/DigitalClock';

const Home = () => {
    const [isSwapped, setIsSwapped] = useState(false);

    const handleSwap = () => {
        setIsSwapped(!isSwapped);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 relative">
            
            <div className="relative">
                {/* Digital Clock */}
                <div 
                    onClick={handleSwap} // Click on the digital clock to swap
                    className={`${
                        isSwapped ? 'absolute bottom-[20%] right-[-50%] transform scale-[40%] z-10' : 'relative'
                    } transition-all duration-500 cursor-pointer`}
                >
                    <DigitalClock />
                </div>

                {/* Analog Clock */}
                <div 
                    onClick={handleSwap} // Click on the analog clock to swap
                    className={`${
                        isSwapped ? 'relative scale-[100%]' : 'absolute top-[-100%] right-[-40%] transform scale-50 scale-[30%] z-10'
                    } transition-all duration-500 cursor-pointer`}
                >
                    <AnalogClock />
                </div>
            </div>
        </div>
    );
};

export default Home;
