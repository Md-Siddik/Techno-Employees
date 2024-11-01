import { useEffect, useState } from 'react';
import AnalogClock from '../Components/Clock/AnalogClock';
import DigitalClock from '../Components/Clock/DigitalClock';
import Calendar from '../Components/Calendar/Calendar';
import EmailViewer from '../Components/EmailViewer/EmailViewer';
import EmailList from '../Components/EmailViewer/EmailList';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Home = () => {
    const [isSwapped, setIsSwapped] = useState(false);
    const [emails, setEmails] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [accessToken, setAccessToken] = useState(null); // New state for the access token

    const handleLogin = (userType, fetchedEmails) => {
        setUser(userType);
        if (fetchedEmails) setEmails(fetchedEmails); // Set emails from Google sign-in
    };

    const fetchEmails = async (accessToken) => {
        try {
            const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await response.json();

            if (data.messages && data.messages.length) {
                // Fetch details for each email
                const emails = await Promise.all(data.messages.slice(0, 5).map(async (message) => { // Fetch the first 5 emails
                    const res = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    const messageData = await res.json();
                    return {
                        id: message.id,
                        snippet: messageData.snippet,
                        subject: messageData.payload.headers.find(header => header.name === 'Subject')?.value
                    };
                }));
                console.log("Fetched emails:", emails); // Log email subjects and snippets
                setEmails(emails); // Return email data for further handling
            } else {
                console.log("No emails found.");
            }
        } catch (error) {
            console.error("Failed to fetch emails:", error);
        }
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

    const handleSwap = () => {
        setIsSwapped(!isSwapped);
    };

    console.log(user);

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
                {/* <EmailViewer /> */}
                <EmailList emails={emails} fetchEmailContent={fetchEmailContent} selectedEmail={selectedEmail} accessToken={accessToken} />
            </div>
        </div>
    );
};

export default Home;