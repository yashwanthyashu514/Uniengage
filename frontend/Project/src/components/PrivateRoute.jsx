import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

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
