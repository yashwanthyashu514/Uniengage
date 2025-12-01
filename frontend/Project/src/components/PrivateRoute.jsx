import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const PrivateRoute = ({ children, role }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" />;

    if (role && user.role !== role) {
        // Redirect to their appropriate dashboard if they try to access a wrong route
        if (user.role === 'ADMIN') return <Navigate to="/admin" />;
        if (user.role === 'COORDINATOR') return <Navigate to="/coordinator" />;
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default PrivateRoute;
