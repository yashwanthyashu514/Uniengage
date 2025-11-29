import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-indigo-600 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">UniEngage</Link>
                <div>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span>Welcome, {user.name} ({user.role})</span>
                            {user.role === 'STUDENT' && <Link to="/dashboard" className="hover:text-indigo-200">Dashboard</Link>}
                            {user.role !== 'STUDENT' && <Link to="/admin" className="hover:text-indigo-200">Admin Panel</Link>}
                            <Link to="/events" className="hover:text-indigo-200">Events</Link>
                            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="hover:text-indigo-200">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
