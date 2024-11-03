import { useContext, useEffect, useState } from 'react';
import AnalogClock from '../Components/Clock/AnalogClock';
import DigitalClock from '../Components/Clock/DigitalClock';
import Calendar from '../Components/Calendar/Calendar';
import EmailList from '../Components/EmailViewer/EmailList';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';
import SendEmail from '../Components/EmailViewer/SendEmail';

const Home = ({ userEmail }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => JSON.parse(localStorage.getItem('isLoggedIn')) || false
    );
    const [userRole, setUserRole] = useState(
        () => localStorage.getItem('userRole') || null
    );
    const accessToken = localStorage.getItem('googleAccessToken');
    const [isSwapped, setIsSwapped] = useState(false);
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    // const [accessToken, setAccessToken] = useState(null);
    const auth = getAuth();

    const handleSwap = () => {
        setIsSwapped(!isSwapped);
    };

    // Old fetchEmails function
    // const fetchEmails = async (accessToken) => {
    //     try {
    //         const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`
    //             }
    //         });
    //         const data = await response.json();

    //         if (data.messages && data.messages.length) {
    //             // Fetch details for each email
    //             const emails = await Promise.all(data.messages.slice(0, 100).map(async (message) => { // Fetch the first 5 emails
    //                 const res = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
    //                     headers: {
    //                         Authorization: `Bearer ${accessToken}`
    //                     }
    //                 });
    //                 const messageData = await res.json();

    //                 // Extract more details like sender, recipient, and date from headers
    //                 const headers = messageData.payload.headers;
    //                 const from = headers.find(header => header.name === 'From')?.value;
    //                 const to = headers.find(header => header.name === 'To')?.value;
    //                 const subject = headers.find(header => header.name === 'Subject')?.value;
    //                 const date = headers.find(header => header.name === 'Date')?.value;

    //                 return {
    //                     id: message.id,
    //                     snippet: messageData.snippet,
    //                     from,
    //                     to,
    //                     subject,
    //                     date,
    //                 };
    //             }));

    //             console.log("Fetched emails with more details:", emails); // Log email subjects, snippets, and additional details
                
    //             // try {
    //             //     const response = await fetch('http://localhost:5000/allEmails', {
    //             //         method: 'POST',
    //             //         headers: {
    //             //             'Content-Type': 'application/json'
    //             //         },
    //             //         body: JSON.stringify(emails)
    //             //     });
                    
    //             //     if (!response.ok) {
    //             //         throw new Error(`Server error: ${response.statusText}`);
    //             //     }
                
    //             //     const data = await response.json();
    //             //     console.log("Email uploaded successfully:", data);
    //             // } catch (error) {
    //             //     console.error("Error uploading emails:", error);
    //             //     Swal.fire({
    //             //         title: 'Failed!',
    //             //         text: 'Email cannot be uploaded. Check server connection and try again.',
    //             //         icon: 'error',
    //             //         confirmButtonText: 'Close'
    //             //     });
    //             // }
                
                
    //         } else {
    //             Swal.fire({
    //                 title: 'Failed!',
    //                 text: 'No Email Found',
    //                 icon: 'error',
    //                 confirmButtonText: 'Close'
    //             })
    //         }
    //     } catch (error) {
    //         console.error("Failed to fetch emails:", error);
    //     }
    // };

    const fetchEmails = async (accessToken) => {
        try {
            const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
    
            if (data.messages && data.messages.length) {
                const emails = await Promise.all(data.messages.slice(0, 10).map(async (message) => {
                    const res = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    const messageData = await res.json();
    
                    // Extract headers
                    const headers = messageData.payload.headers;
                    const from = headers.find(header => header.name === 'From')?.value;
                    const to = headers.find(header => header.name === 'To')?.value;
                    const subject = headers.find(header => header.name === 'Subject')?.value;
                    const dateStr = headers.find(header => header.name === 'Date')?.value;
    
                    // Format date and time
                    let formattedDate = '';
                    let formattedTime = '';
                    if (dateStr) {
                        const dateObj = new Date(dateStr);
                        formattedDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
                        formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
    
                    // Extract body (attempting to get the plain text version)
                    let body = '';
                    const parts = messageData.payload.parts || [];
                    
                    for (const part of parts) {
                        if (part.mimeType === 'text/plain' && part.body.data) {
                            body = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/')); // Decode base64
                            break;
                        }
                    }
    
                    return {
                        id: message.id,
                        snippet: messageData.snippet,
                        from,
                        to,
                        subject,
                        date: formattedDate,
                        time: formattedTime,
                        body,
                    };
                }));
    
                console.log("Fetched emails with more details:", emails);
                setEmails(emails); // Set the state with detailed email information
            } else {
                Swal.fire({
                    title: 'Failed!',
                    text: 'No Email Found',
                    icon: 'error',
                    confirmButtonText: 'Close'
                });
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

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('accessToken');
        window.location.reload();
    };

    useEffect(() => {
        if (accessToken) {
            fetchEmails(accessToken);
        }
    }, [accessToken])

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
            {/* <div className='w-full h-full'>
                <EmailList emails={emails} fetchEmailContent={fetchEmailContent} selectedEmail={selectedEmail} accessToken={accessToken} />
            </div> */}
            <div className='w-full flex items-center justify-center'>
                <SendEmail />
            </div>
        </div>
    );
};

export default Home;