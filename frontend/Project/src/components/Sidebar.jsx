import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Calendar,
    BarChart3,
    LogOut,
    UserCircle,
    QrCode,
    Trophy,
    FileText,
    Award,
    UserPlus,
    CheckSquare,
    Users
} from 'lucide-react';
import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const getMenuItems = () => {
        if (user?.role === 'ADMIN') {
            return [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
                { icon: UserPlus, label: 'Manage Coordinators', path: '/admin/coordinators' },
                { icon: Calendar, label: 'Manage Events', path: '/admin' },
                { icon: FileText, label: 'Reports', path: '/reports' },
                { icon: Award, label: 'Certificates', path: '/certificates' },
                { icon: UserCircle, label: 'Profile', path: '/profile' },
            ];
        } else if (user?.role === 'COORDINATOR') {
            return [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/coordinator/dashboard' },
                { icon: Calendar, label: 'My Events', path: '/coordinator' },
                { icon: QrCode, label: 'Attendance', path: '/attendance' },
                { icon: FileText, label: 'Reports', path: '/reports' },
                { icon: UserCircle, label: 'Profile', path: '/profile' },
            ];
        } else {
            return [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
                { icon: Calendar, label: 'Upcoming Events', path: '/events' },
                { icon: CheckSquare, label: 'My Registered Events', path: '/student/dashboard' }, // Note: This might need a specific route if different from dashboard
                { icon: Award, label: 'My Certificates', path: '/certificates' },
                { icon: Trophy, label: 'Leaderboard', path: '/student/dashboard' }, // Same here, maybe anchor link?
                { icon: UserCircle, label: 'Profile', path: '/profile' },
            ];
        }
    };

    const menuItems = getMenuItems();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully. Welcome!");
        navigate('/login');
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ x: isOpen ? 0 : -280 }}
                transition={{ type: 'spring', damping: 20 }}
                className="fixed left-0 top-0 h-full w-[280px] glass-card z-50 lg:translate-x-0 flex flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl"
            >
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-indigo-400" />
                        </div>
                        UniEngage
                    </h1>
                    <p className="text-white/50 text-xs mt-2 ml-1">Student Participation System</p>
                </div>

                {/* User Info */}
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white font-semibold truncate">{user?.name}</p>
                            <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider">{user?.role}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <motion.button
                                key={item.label}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    navigate(item.path);
                                    if (window.innerWidth < 1024) setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-500/20 text-white shadow-lg border border-indigo-500/30'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white hover:border-white/10 border border-transparent'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-white/40 group-hover:text-white transition-colors'}`} />
                                <span className="font-medium tracking-wide">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-500/10 text-red-200 border border-red-500/10 transition-all group"
                    >
                        <div className="p-1.5 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                            <LogOut className="w-5 h-5 text-red-400" />
                        </div>
                        <span className="font-medium">Logout</span>
                    </motion.button>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
