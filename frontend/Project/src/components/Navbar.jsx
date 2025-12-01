import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/student/dashboard') return 'Student Dashboard';
        if (path === '/events') return 'Browse Events';
        if (path === '/admin') return 'Manage Events';
        if (path === '/admin/dashboard') return 'Admin Dashboard';
        if (path === '/coordinator') return 'My Events';
        if (path === '/coordinator/dashboard') return 'Coordinator Dashboard';
        if (path === '/scan') return 'QR Scanner';
        if (path === '/credits') return 'My Credits';
        if (path === '/certificates') return 'My Certificates';
        if (path === '/reports') return 'Activity Reports';
        if (path === '/profile') return 'Profile Settings';
        return 'UniEngage';
    };

    const handleLogout = () => {
        logout();
        toast.success('You have been logged out. See you soon! 👋');
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="glass-card h-16 flex items-center justify-between px-6 mb-6 relative"
        >
            <button
                onClick={toggleSidebar}
                className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-all"
            >
                <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:ml-0 ml-4">
                <h2 className="text-xl font-semibold text-white">{getPageTitle()}</h2>
            </div>

            <div className="flex items-center gap-3">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                >
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </motion.button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gmu-gold to-amber-600 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium hidden md:block">{user?.name}</span>
                    </motion.button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-64 glass-card border border-white/10 rounded-xl shadow-2xl p-4 z-50"
                            >
                                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gmu-gold to-amber-600 flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">{user?.name}</p>
                                        <p className="text-white/60 text-sm">{user?.email}</p>
                                        <span className="text-gmu-gold text-xs font-medium">{user?.role}</span>
                                    </div>
                                </div>
                                <div className="py-2 space-y-1">
                                    <button
                                        onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white transition-all"
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span>Settings</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
