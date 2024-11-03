import { useContext, useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../AuthProvider/AuthProvider';
import Swal from 'sweetalert2';
import { useGoogleLogin } from '@react-oauth/google';


import { linkWithPopup, fetchSignInMethodsForEmail, signInWithCredential } from 'firebase/auth';


const Login = ({ onLogin }) => {
    const [user, setUser] = useState(null);
    const [emails, setEmails] = useState([]);
    const { signIn } = useContext(AuthContext);
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

    const handleLogin = e => {
        try {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const email = form.get('email');
            const password = form.get('password');

            signIn(email, password)
                .then(result => {
                    onLogin('admin', email);
                    Swal.fire({
                        title: 'Success!',
                        text: 'Login Successfully',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    })
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Faild!',
                        text: 'Invalid Email or Password',
                        icon: 'error',
                        confirmButtonText: 'Back'
                    })
                })
        }
        catch (error) {
            console.error(error)
        }
    }

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then(result => {
                const loggedInUser = result.user;
                setUser(loggedInUser);
                onLogin('admin', auth.currentUser.email);
                // console.log(result.user)
            })
            .catch(error => {
                console.error(error)
                Swal.fire({
                    title: 'Oops...!',
                    text: 'Something Went Wrong',
                    icon: 'error',
                    confirmButtonText: 'Back'
                })
            })
    }

    // ------ For gmail inbox ------

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
    //             const emails = await Promise.all(data.messages.slice(0, 10).map(async (message) => { // Fetch the first 5 emails
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
    const googleSignIn = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                console.log("Login successful. Access Token:", tokenResponse.access_token);
    
                // Persist Google login session
                await setPersistence(auth, browserLocalPersistence);
                
                // Store access token in local storage
                localStorage.setItem("googleAccessToken", tokenResponse.access_token);
    
                // Fetch emails after successful login
                // fetchEmails(tokenResponse.access_token);
    
                // Navigate to home page as admin
                onLogin('admin');
            } catch (error) {
                console.error("Error setting persistence:", error);
            }
        },
        onError: () => {
            Swal.fire({
                title: 'Failed!',
                text: 'Google Sign-In failed',
                icon: 'error',
                confirmButtonText: 'Back'
            });
        },
        scope: 'https://www.googleapis.com/auth/gmail.modify',
    });

    // const emailPasswordLogin = async (email, password) => {
    //     try {
    //         // Set persistence to persist session
    //         await setPersistence(auth, browserLocalPersistence);

    //         // Sign in with email and password
    //         const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //         const user = userCredential.user;

    //         console.log("Login successful. User:", user);

    //         // Fetch Gmail API token using Firebase ID token
    //         const token = await user.getIdToken();

    //         // Use token to request Gmail API access if necessary
    //         fetchEmails(token); // Assuming `fetchEmails` is a function to call the Gmail API

    //         onLogin('admin'); // Navigate to home page or appropriate location

    //     } catch (error) {
    //         console.error("Error logging in with email and password:", error);
    //         Swal.fire({
    //             title: 'Failed!',
    //             text: 'Email/Password Sign-In failed',
    //             icon: 'error',
    //             confirmButtonText: 'Back'
    //         });
    //     }
    // };

    // const handleLogin = async (e) => {
    //     try {
    //         e.preventDefault();
    //         const form = new FormData(e.currentTarget);
    //         const email = form.get('email');
    //         const password = form.get('password');
    
    //         // Step 1: Sign in with email and password
    //         const result = await signInWithEmailAndPassword(auth, email, password);
    
    //         // Step 2: Check if Google is already linked
    //         const googleProvider = new GoogleAuthProvider();
    //         googleProvider.addScope('https://www.googleapis.com/auth/gmail.modify');
    
    //         const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    
    //         if (signInMethods.includes(GoogleAuthProvider.PROVIDER_ID)) {
    //             // The user has previously linked a Google account, sign in with it directly
    //             const credential = GoogleAuthProvider.credentialFromResult(result);
    //             const accessToken = credential.accessToken;
    //             console.log("Google Access Token:", accessToken);
    //             fetchEmails(accessToken); // Fetch emails if needed
    //             onLogin('admin', email);
    //         } else {
    //             // Link Google provider if not already linked
    //             const linkedResult = await linkWithPopup(result.user, googleProvider);
    //             const credential = GoogleAuthProvider.credentialFromResult(linkedResult);
    //             const accessToken = credential.accessToken;
    
    //             console.log("Google Access Token:", accessToken);
    //             fetchEmails(accessToken); // Fetch emails if needed
    //             onLogin('admin', email);
    //         }
    
    //         // Success feedback
    //         Swal.fire({
    //             title: 'Success!',
    //             text: 'Login Successfully',
    //             icon: 'success',
    //             confirmButtonText: 'Ok'
    //         });
    
    //     } catch (error) {
    //         // Check if error is credential-already-in-use and handle it
    //         if (error.code === 'auth/credential-already-in-use') {
    //             Swal.fire({
    //                 title: 'Error!',
    //                 text: 'This Google account is already linked to another user.',
    //                 icon: 'error',
    //                 confirmButtonText: 'Back'
    //             });
    //         } else {
    //             console.error("Error during login:", error);
    
    //             Swal.fire({
    //                 title: 'Failed!',
    //                 text: 'Invalid Email or Password',
    //                 icon: 'error',
    //                 confirmButtonText: 'Back'
    //             });
    //         }
    //     }
    // };

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
                    onClick={() => googleSignIn()}
                    className="w-full px-4 py-2 mt-6 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                    Sign In with Google
                </button>
            </div>
        </div>
    );
};

export default Login;

