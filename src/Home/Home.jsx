import { useContext, useEffect, useState } from 'react';
import AnalogClock from '../Components/Clock/AnalogClock';
import DigitalClock from '../Components/Clock/DigitalClock';
import Calendar from '../Components/Calendar/Calendar';
import EmailViewer from '../Components/EmailViewer/EmailViewer';
import EmailList from '../Components/EmailViewer/EmailList';
import axios from 'axios';

const Home = ({ userEmail }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => JSON.parse(localStorage.getItem('isLoggedIn')) || false
    );
    const [userRole, setUserRole] = useState(
        () => localStorage.getItem('userRole') || null
    );
    const [isSwapped, setIsSwapped] = useState(false);
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    const handleSwap = () => {
        setIsSwapped(!isSwapped);
    };

    const fetchEmailContent = async (emailId) => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            setSelectedEmail(response.data);
        } catch (error) {
            console.error('Error fetching email content:', error);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        window.location.reload();
    };

    return (
        <div className='w-full h-screen px-20 py-10 overflow-y-scroll relative flex items-center justify-center'>
            {/* Logout Button */}
            <div className="absolute top-[20px] right-[20px]">
                <button
                    onClick={handleLogout}
                    className="px-5 py-2 text-white border border-purple-500 rounded-md shadow-lg bg-opacity-0 hover:bg-opacity-10 hover:bg-gray-800 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                    Logout
                </button>

            </div>
            {/* <div className='w-fit mx-auto'>
                <div className="relative">
                    <div
                        onClick={isSwapped ? handleSwap : null}
                        className={`${isSwapped ? 'absolute bottom-[0%] right-[-50%] transform scale-[40%] z-10' : 'relative'
                            } transition-all duration-500 cursor-pointer`}
                    >
                        <DigitalClock />
                    </div>

                    <div
                        onClick={isSwapped ? null : handleSwap} // Click on the analog clock to swap only when it is swapped
                        className={`${isSwapped ? 'relative scale-[100%]' : 'absolute top-[-10%] right-[-40%] transform scale-50 scale-[30%] z-10'
                            } transition-all duration-500`}
                    >
                        <AnalogClock />
                    </div>
                </div>
            </div> */}
            {/* <div className='w-full'>
                <Calendar />
            </div> */}
            <div className='w-full'>
                <EmailList emails={emails} fetchEmailContent={fetchEmailContent} selectedEmail={selectedEmail} accessToken={accessToken} />
            </div>
        </div>
    );
};

export default Home;