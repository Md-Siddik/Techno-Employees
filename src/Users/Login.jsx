import { useContext, useState } from 'react';
import { getAuth, setPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { AuthContext } from '../AuthProvider/AuthProvider';
import Swal from 'sweetalert2';
// import { useGoogleLogin } from '@react-oauth/google';

const Login = ({ onLogin }) => {
    const [user, setUser] = useState(null);
    const [emails, setEmails] = useState([]);
    const { signIn } = useContext(AuthContext);
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

    const fetchEmails = async (accessToken) => {
        // Your fetchEmails code here
    };

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
                console.log(result.user)
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

    // const handleGoogleSignIn = useGoogleLogin({
    //     onSuccess: async (tokenResponse) => {
    //         try {
    //             console.log("Login successful. Access Token:", tokenResponse.access_token);
    //             await setPersistence(auth, browserLocalPersistence); // Persist Google login session
    //             fetchEmails(tokenResponse.access_token); // Fetch emails after successful login
    //             onLogin('admin'); // Navigate to home page
    //         } catch (error) {
    //             console.error("Error setting persistence:", error);
    //         }
    //     },
    //     onError: () => {
    //         Swal.fire({
    //             title: 'Failed!',
    //             text: 'Google Sign-In failed',
    //             icon: 'error',
    //             confirmButtonText: 'Back'
    //         });
    //     },
    //     scope: 'https://www.googleapis.com/auth/gmail.modify',
    // });

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

