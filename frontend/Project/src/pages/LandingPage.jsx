import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    FileText,
    LogOut,
    Calendar,
    Award,
    Trophy,
    QrCode
} from 'lucide-react';
import toast from 'react-hot-toast';

const LandingPage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully. Welcome!");
        navigate('/login');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const getRoleActions = () => {
        switch (user?.role) {
            case 'ADMIN':
                return [
                    { label: 'Go to Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, color: 'from-indigo-500 to-blue-500' },
                    { label: 'Manage Coordinators', path: '/admin/coordinators', icon: Users, color: 'from-purple-500 to-pink-500' },
                    { label: 'Reports & Analytics', path: '/admin/reports', icon: FileText, color: 'from-emerald-500 to-teal-500' },
                ];
            case 'COORDINATOR':
                return [
                    { label: 'Go to Coordinator Dashboard', path: '/coordinator/dashboard', icon: LayoutDashboard, color: 'from-indigo-500 to-blue-500' },
                    { label: 'Attendance', path: '/coordinator/attendance', icon: QrCode, color: 'from-orange-500 to-red-500' },
                    { label: 'Reports', path: '/coordinator/reports', icon: FileText, color: 'from-emerald-500 to-teal-500' },
                ];
            case 'STUDENT':
                return [
                    { label: 'Go to Student Dashboard', path: '/student/dashboard', icon: LayoutDashboard, color: 'from-indigo-500 to-blue-500' },
                    { label: 'My Certificates', path: '/student/certificates', icon: Award, color: 'from-yellow-500 to-amber-500' },
                    { label: 'Upcoming Events', path: '/student/events', icon: Calendar, color: 'from-pink-500 to-rose-500' },
                    { label: 'Leaderboard', path: '/student/leaderboard', icon: Trophy, color: 'from-cyan-500 to-blue-500' },
                ];
            default:
                return [];
        }
    };

    const actions = getRoleActions();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-4xl z-10"
            >
                <motion.div variants={itemVariants} className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                        Welcome, {user?.name} <span className="inline-block animate-wave">👋</span>
                    </h1>
                    <p className="text-xl text-white/60 font-light">
                        You are logged in as <span className="font-semibold text-white bg-white/10 px-3 py-1 rounded-full">{user?.role}</span>
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {actions.map((action, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.03, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(action.path)}
                            className="group relative overflow-hidden glass-card p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-white/30"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <action.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                                    {action.label}
                                </h3>
                                <p className="text-white/50 text-sm group-hover:text-white/70 transition-colors">
                                    Click to access
                                </p>
                            </div>
                        </motion.button>
                    ))}

                    <motion.button
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="group relative overflow-hidden glass-card p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 hover:border-red-500/30"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <LogOut className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-200 transition-colors">
                                Logout
                            </h3>
                            <p className="text-white/50 text-sm group-hover:text-white/70 transition-colors">
                                End your session
                            </p>
                        </div>
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
