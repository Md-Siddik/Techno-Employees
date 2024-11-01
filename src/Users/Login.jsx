import { useContext, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { AuthContext } from '../AuthProvider/AuthProvider';
import Swal from 'sweetalert2';
import { useGoogleLogin } from '@react-oauth/google';

const Login = ({ onLogin }) => {
    const [user, setUser] = useState(null);
    const [emails, setEmails] = useState([]);
    const { signIn } = useContext(AuthContext);
    const auth = getAuth();

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
                const emails = await Promise.all(data.messages.map(async (message) => { // Fetch the first 5 emails
                    const res = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    const messageData = await res.json();
                    
                    // Extract more details like sender, recipient, and date from headers
                    const headers = messageData.payload.headers;
                    const from = headers.find(header => header.name === 'From')?.value;
                    const to = headers.find(header => header.name === 'To')?.value;
                    const subject = headers.find(header => header.name === 'Subject')?.value;
                    const date = headers.find(header => header.name === 'Date')?.value;
                    
                    return {
                        id: message.id,
                        snippet: messageData.snippet,
                        from,
                        to,
                        subject,
                        date,
                    };
                }));
    
                console.log("Fetched emails with more details:", emails); // Log email subjects, snippets, and additional details
                setEmails(emails); // Update state with the fetched email data
            } else {
                console.log("No emails found.");
            }
        } catch (error) {
            console.error("Failed to fetch emails:", error);
        }
    };
    

    const handleLogin = e => {
        try {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const email = form.get('email');
            const password = form.get('password');

            signIn(email, password)
                .then(result => {
                    onLogin('admin');
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Failed!',
                        text: 'Invalid Email or Password',
                        icon: 'error',
                        confirmButtonText: 'Back'
                    });
                });
        } catch (error) {
            console.error(error);
        }
    };

    const handleGoogleSignIn = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log("Login successful. Access Token:", tokenResponse.access_token);
            fetchEmails(tokenResponse.access_token); // Fetch emails after successful login
            onLogin('admin'); // Navigate to home page
        },
        onError: () => {
            Swal.fire({
                title: 'Failed!',
                text: 'Google Sign-In failed',
                icon: 'error',
                confirmButtonText: 'Back'
            });
        },
        scope: 'https://www.googleapis.com/auth/gmail.modify', // Set the required scope
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/20 backdrop-blur-lg shadow-lg rounded-lg border border-white/30">
                <h2 className="text-3xl font-bold text-white text-center">Login</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-2 mt-1 bg-white/30 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-2 mt-1 bg-white/30 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 mt-6 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200"
                    >
                        Sign In
                    </button>
                </form>
                <button
                    type="button"
                    onClick={() => handleGoogleSignIn()}
                    className="w-full px-4 py-2 mt-6 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                    Sign In with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
