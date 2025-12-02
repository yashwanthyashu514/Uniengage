import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import campus1 from '../assets/campus1.png';
import gmuLogo from '../assets/gmu_logo.png';

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [phone] = useState(location.state?.phone || '');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
                phone,
                otp
            });

            toast.success('Registration successful — Awaiting coordinator/admin approval');
            setTimeout(() => {
                navigate('/login/student');
            }, 2000);

        } catch (error) {
            toast.error(error.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResending(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/resend-otp', {
                phone
            });

            toast.success(response.data.message);
            // Show OTP in dev mode
            if (response.data.otp) {
                toast.success(`New OTP: ${response.data.otp}`, { duration: 10000 });
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            <Toaster position="top-right" />

            <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 z-0"
            >
                <img src={campus1} alt="GMU Campus" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </motion.div>

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

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/login')}
                        className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Login
                    </motion.button>

                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="relative mb-6"
                        >
                            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
                            <img src={gmuLogo} alt="GM University" className="w-20 h-auto relative z-10 drop-shadow-lg" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white text-center tracking-wide">Verify Your Phone</h1>
                        <p className="text-yellow-400/90 text-sm font-medium mt-1 tracking-wider uppercase">Enter OTP</p>
                        <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full mt-4"></div>
                    </div>

                    <form onSubmit={handleVerifyOTP} className="space-y-5">
                        <div>
                            <label className="text-white/80 text-sm mb-2 block">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="tel"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                    value={phone}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-white/80 text-sm mb-2 block">Enter 6-Digit OTP</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="text"
                                    maxLength="6"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl tracking-widest placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-xl shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                                />
                            ) : (
                                'Verify OTP'
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleResendOTP}
                            disabled={resending}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 text-yellow-400 font-semibold rounded-xl border border-white/10 hover:border-yellow-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 ${resending ? 'animate-spin' : ''}`} />
                            Resend OTP
                        </motion.button>
                    </form>
                </div>

                <p className="text-center text-white/30 text-xs mt-6">
                    &copy; {new Date().getFullYear()} GM University. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
};

export default OTPVerification;
