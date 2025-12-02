import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import campus1 from '../assets/campus1.png';
import gmuLogo from '../assets/gmu_logo.png';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (location.state?.phone) {
            setPhone(location.state.phone);
        } else {
            toast.error('No phone number found. Please register again.');
            navigate('/student-registration');
        }
    }, [location, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '' && e.target.previousSibling) {
                e.target.previousSibling.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pastedData.length > 0) {
            const newOtp = [...otp];
            pastedData.forEach((value, index) => {
                if (index < 6 && !isNaN(value)) {
                    newOtp[index] = value;
                }
            });
            setOtp(newOtp);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/auth/verify-otp', {
                phone,
                otp: otpString
            });

            toast.success('Phone verified successfully! Please wait for admin approval.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
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
                className="relative z-10 w-full max-w-md px-4 my-8"
            >
                <div className="glass-card p-8 md:p-10 border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/student-registration')}
                        className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </motion.button>

                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="relative mb-6"
                        >
                            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
                            <ShieldCheck className="w-16 h-16 text-yellow-400 relative z-10 drop-shadow-lg" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white text-center tracking-wide">Verify OTP</h1>
                        <p className="text-white/60 text-sm font-medium mt-2 text-center">
                            Enter the 6-digit code sent to <br /> <span className="text-yellow-400">{phone}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-2">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    name="otp"
                                    maxLength="1"
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    onFocus={(e) => e.target.select()}
                                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg text-center text-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-xl shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                                />
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Verify & Proceed
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOtp;
