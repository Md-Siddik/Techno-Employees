import { useState } from 'react';

const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Fake credentials
    const fakeAdminEmail = 'admin@example.com';
    const fakeAdminPassword = 'password123';
    const fakeEmployeeEmail = 'employee@example.com';
    const fakeEmployeePassword = 'password456';

    const handleSubmit = (e) => {
        e.preventDefault();
        // Check credentials for admin
        if (email === fakeAdminEmail && password === fakeAdminPassword) {
            onLogin('admin'); // Call onLogin with admin role
        } 
        // Check credentials for employee
        else if (email === fakeEmployeeEmail && password === fakeEmployeePassword) {
            onLogin('employee'); // Call onLogin with employee role
        } 
        else {
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/20 backdrop-blur-lg shadow-lg rounded-lg border border-white/30">
                <h2 className="text-3xl font-bold text-white text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
            </div>
        </div>
    );
};

export default LoginForm;