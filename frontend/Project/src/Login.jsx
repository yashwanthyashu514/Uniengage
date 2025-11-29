import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = "http://localhost:5000";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            // Simple redirect for now, can be enhanced with context later
            alert(`Logged in as ${data.name}`);
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full border p-2 rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full border p-2 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
                        Login
                    </button>
                </form>
                <div className="mt-4 text-sm text-gray-600">
                    <p>Default Accounts:</p>
                    <p>Admin: admin@gmu.edu / Admin@123</p>
                    <p>Coord: coordinator@gmu.edu / Coord@123</p>
                    <p>Student: student@gmu.edu / Stud@123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
