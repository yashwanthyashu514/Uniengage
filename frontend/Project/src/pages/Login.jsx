import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import campus1 from '../assets/campus1.png';
import campus2 from '../assets/campus2.png';
import gmuLogo from '../assets/gmu_logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const images = [campus1, campus2];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(email, password);

        setLoading(false);

        if (result.success) {
            const user = result.user;
            toast.success(`Welcome back, ${user.name}! 👋`);
            navigate('/welcome');
        }
    };

    const quickLogin = (role) => {
        if (role === 'admin') {
            setEmail('admin@gmu.edu');
            setPassword('Admin@123');
        } else if (role === 'coordinator') {
            setEmail('coordinator@gmu.edu');
            setPassword('Coord@123');
        } else {
            setEmail('student@gmu.edu');
            setPassword('Stud@123');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            <Toaster position="top-right" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={images[currentImage]}
                        alt="GMU Campus"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <div className="glass-card p-8 md:p-10 border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">

                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="relative mb-6"
                        >
                            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
                            <img src={gmuLogo} alt="GM University" className="w-24 h-auto relative z-10 drop-shadow-lg" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white text-center tracking-wide">GM UNIVERSITY</h1>
                        <p className="text-yellow-400/90 text-sm font-medium mt-1 tracking-wider uppercase">Innovating Minds</p>
                        <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full mt-4"></div>
                    </div>

                    <h2 className="text-xl text-white/90 text-center mb-6 font-light">UniEngage Portal Login</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                    placeholder="University Email ID"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-xl shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                                />
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8 pt-6 border-t border-white/10"
                    >
                        <p className="text-white/40 text-xs mb-3 text-center uppercase tracking-widest">Demo Access</p>
                        <div className="flex justify-center gap-3">
                            {['admin', 'coordinator', 'student'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => quickLogin(role)}
                                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-all border border-white/5 hover:border-white/20 capitalize"
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <p className="text-center text-white/30 text-xs mt-6">
                    &copy; {new Date().getFullYear()} GM University. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
