import { useState } from 'react';
import AnalogClock from '../Clock/AnalogClock';
import DigitalClock from '../Clock/DigitalClock';

const Home = () => {
    const [isSwapped, setIsSwapped] = useState(false);

    const handleSwap = () => {
        setIsSwapped(!isSwapped);
    };

    return (
        <div>
            <div className="relative">
                {/* Digital Clock */}
                <div 
                    onClick={isSwapped ? handleSwap : null}
                    className={`${
                        isSwapped ? 'absolute bottom-[20%] right-[-50%] transform scale-[40%] z-10' : 'relative'
                    } transition-all duration-500 cursor-pointer`}
                >
                    <DigitalClock />
                </div>

                {/* Analog Clock */}
                <div 
                    onClick={isSwapped ? null : handleSwap } // Click on the analog clock to swap only when it is swapped
                    className={`${
                        isSwapped ? 'relative scale-[100%]' : 'absolute top-[-100%] right-[-40%] transform scale-50 scale-[30%] z-10'
                    } transition-all duration-500`}
                >
                    <AnalogClock />
                </div>
            </div>
        </div>
    );
};

export default Home;
