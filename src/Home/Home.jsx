import { useState } from 'react';
import AnalogClock from '../Components/Clock/AnalogClock';
import DigitalClock from '../Components/Clock/DigitalClock';
import Calendar from '../Components/Calendar/Calendar';
import EmailViewer from '../Components/EmailViewer/EmailViewer';
import EmailList from '../Components/EmailViewer/EmailList';

const Home = () => {
    const [isSwapped, setIsSwapped] = useState(false);

    const handleSwap = () => {
        setIsSwapped(!isSwapped);
    };

    return (
        <div className='w-full max-h-screen px-20 py-10 overflow-y-scroll'>
            {/* <div className='w-fit mx-auto'>
                <div className="relative">
                    <div
                        onClick={isSwapped ? handleSwap : null}
                        className={`${isSwapped ? 'absolute bottom-[20%] right-[-50%] transform scale-[40%] z-10' : 'relative'
                            } transition-all duration-500 cursor-pointer`}
                    >
                        <DigitalClock />
                    </div>

                    <div
                        onClick={isSwapped ? null : handleSwap} // Click on the analog clock to swap only when it is swapped
                        className={`${isSwapped ? 'relative scale-[100%]' : 'absolute top-[-100%] right-[-40%] transform scale-50 scale-[30%] z-10'
                            } transition-all duration-500`}
                    >
                        <AnalogClock />
                    </div>
                </div>
            </div> */}
            {/* <div>
                <Calendar />
            </div> */}
            <div>
                <EmailViewer />
                {/* <EmailList /> */}
            </div>
        </div>
    );
};

export default Home;