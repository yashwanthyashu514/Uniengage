import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, GraduationCap, ArrowRight, LayoutDashboard } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import campus1 from '../assets/campus1.png';
import campus2 from '../assets/campus2.png';
import gmuLogo from '../assets/gmu_logo.png';

const Welcome = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [currentImage, setCurrentImage] = useState(0);

    const images = [campus1, campus2];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const roles = [
        {
            id: 'admin',
            title: 'Administrator',
            icon: Shield,
            description: 'Manage system, users, and overall portal settings.',
            color: 'bg-[#800000]', // Maroon
            path: '/login'
        },
        {
            id: 'coordinator',
            title: 'Coordinator',
            icon: Users,
            description: 'Create events, manage attendance, and track participation.',
            color: 'bg-[#0A0F24]', // Navy
            path: '/login'
        },
        {
            id: 'student',
            title: 'Student',
            icon: GraduationCap,
            description: 'Register for events, view credits, and download certificates.',
            color: 'bg-[#D4AF37]', // Gold
            path: '/login'
        }
    ];

    const handleDashboardRedirect = () => {
        if (!user) return;
        if (user.role === 'ADMIN') navigate('/admin/dashboard');
        else if (user.role === 'COORDINATOR') navigate('/coordinator/dashboard');
        else navigate('/student/dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0A0F24] font-sans">
            {/* Background Animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={images[currentImage]}
                        alt="GMU Campus"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F24]/80 via-[#0A0F24]/60 to-[#0A0F24]/90" />
                </motion.div>
            </AnimatePresence>

            {/* Noise Texture */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">

                {/* Logo & Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#D4AF37]/30 blur-2xl rounded-full"></div>
                            <img src={gmuLogo} alt="GM University" className="w-32 h-auto relative z-10 drop-shadow-2xl" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
                        Uni<span className="text-[#D4AF37]">Engage</span>
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
                        Unified Student Participation & Engagement Management System
                    </p>
                    <div className="h-1 w-24 bg-gradient-to-r from-[#D4AF37] to-[#800000] rounded-full mx-auto mt-6"></div>
                </motion.div>

                {user ? (
                    /* Logged In View */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl max-w-lg w-full text-center shadow-2xl"
                    >
                        <div className="mb-8">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#800000] mx-auto flex items-center justify-center shadow-lg mb-4">
                                <span className="text-3xl font-bold text-white">{user.name.charAt(0)}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Welcome {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()} 👋
                            </h2>
                            <p className="text-lg text-[#D4AF37] font-medium">{user.name}</p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDashboardRedirect}
                            className="w-full py-4 bg-gradient-to-r from-[#800000] to-[#600000] text-white font-bold rounded-xl shadow-lg hover:shadow-[#800000]/40 transition-all flex items-center justify-center gap-3 text-lg border border-[#D4AF37]/20"
                        >
                            <LayoutDashboard className="w-6 h-6" />
                            Go to Dashboard →
                        </motion.button>
                    </motion.div>
                ) : (
                    /* Landing Page View */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                        {roles.map((role, index) => (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl blur-xl"
                                    style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                                ></div>

                                <div
                                    onClick={() => navigate(role.path, { state: { role: role.id } })}
                                    className="h-full glass-card p-8 rounded-2xl border border-white/10 hover:border-[#D4AF37]/50 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center text-center shadow-2xl"
                                >
                                    <div className={`w-16 h-16 rounded-2xl ${role.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <role.icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">{role.title}</h3>
                                    <p className="text-white/60 text-sm mb-8 leading-relaxed">{role.description}</p>

                                    <div className="mt-auto flex items-center gap-2 text-white/80 text-sm font-semibold group-hover:text-white transition-colors">
                                        Login as {role.title} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-16 text-white/30 text-sm"
                >
                    &copy; {new Date().getFullYear()} GM University. All rights reserved.
                </motion.div>
            </div>
        </div>
    );
};

export default Welcome;
