import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Hash, Building, Calendar, ArrowLeft, CheckCircle, Phone } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import campus1 from '../assets/campus1.png';
import gmuLogo from '../assets/gmu_logo.png';

const StudentRegistration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        usn: '',
        department: '',
        year: '',
        semester: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });

    const checkPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

        const strengths = [
            { score: 0, text: 'Too Weak', color: 'text-red-400' },
            { score: 1, text: 'Weak', color: 'text-orange-400' },
            { score: 2, text: 'Fair', color: 'text-yellow-400' },
            { score: 3, text: 'Good', color: 'text-green-400' },
            { score: 4, text: 'Strong', color: 'text-emerald-400' }
        ];

        return strengths[score];
    };

    const handlePasswordChange = (password) => {
        setFormData({ ...formData, password });
        if (password) {
            setPasswordStrength(checkPasswordStrength(password));
        } else {
            setPasswordStrength({ score: 0, text: '', color: '' });
        }
    };

    const validateForm = () => {
        if (!formData.email.endsWith('@gmu.edu.in')) {
            toast.error('Email must end with @gmu.edu.in domain');
            return false;
        }

        if (!formData.phone.match(/^[0-9]{10}$/)) {
            toast.error('Phone number must be 10 digits');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        if (passwordStrength.score < 3) {
            toast.error('Password is not strong enough');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register-student', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                usn: formData.usn,
                department: formData.department,
                year: formData.year,
                semester: formData.semester,
                password: formData.password
            });

            toast.success(response.data.message || 'Registration successful! An OTP has been sent to your phone.');

            // Show OTP in dev mode
            if (response.data.otp) {
                toast.success(`Your OTP: ${response.data.otp}`, { duration: 10000 });
            }

            setTimeout(() => {
                navigate('/verify-otp', { state: { phone: formData.phone } });
            }, 1000);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
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
                className="relative z-10 w-full max-w-2xl px-4 my-8"
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
                        <h1 className="text-2xl font-bold text-white text-center tracking-wide">Student Registration</h1>
                        <p className="text-yellow-400/90 text-sm font-medium mt-1 tracking-wider uppercase">Create Your Account</p>
                        <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full mt-4"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Full Name *</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                        placeholder="Enter full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-white/80 text-sm mb-2 block">University Email *</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                        placeholder="name@gmu.edu.in"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <p className="text-white/40 text-xs mt-1">Must end with @gmu.edu.in</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-white/80 text-sm mb-2 block">Phone Number *</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="tel"
                                    maxLength="10"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                    placeholder="10-digit phone number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                    required
                                />
                            </div>
                            <p className="text-white/40 text-xs mt-1">OTP will be sent to this number</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-white/80 text-sm mb-2 block">USN (University Serial Number) *</label>
                                <div className="relative group">
                                    <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                        placeholder="1GMU23CS001"
                                        value={formData.usn}
                                        onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Department *</label>
                                <div className="relative group">
                                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                                    <select
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all appearance-none"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        required
                                    >
                                        <option value="" className="bg-black">Select Department</option>
                                        <option value="Computer Science" className="bg-black">Computer Science</option>
                                        <option value="Information Science" className="bg-black">Information Science</option>
                                        <option value="Electronics" className="bg-black">Electronics</option>
                                        <option value="Mechanical" className="bg-black">Mechanical</option>
                                        <option value="Civil" className="bg-black">Civil</option>
                                        <option value="Biotechnology" className="bg-black">Biotechnology</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Year *</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                                    <select
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all appearance-none"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        required
                                    >
                                        <option value="" className="bg-black">Select Year</option>
                                        <option value="1st Year" className="bg-black">1st Year</option>
                                        <option value="2nd Year" className="bg-black">2nd Year</option>
                                        <option value="3rd Year" className="bg-black">3rd Year</option>
                                        <option value="4th Year" className="bg-black">4th Year</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Semester *</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                                    <select
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all appearance-none"
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                        required
                                    >
                                        <option value="" className="bg-black">Select Semester</option>
                                        <option value="1st Sem" className="bg-black">1st Semester</option>
                                        <option value="2nd Sem" className="bg-black">2nd Semester</option>
                                        <option value="3rd Sem" className="bg-black">3rd Semester</option>
                                        <option value="4th Sem" className="bg-black">4th Semester</option>
                                        <option value="5th Sem" className="bg-black">5th Semester</option>
                                        <option value="6th Sem" className="bg-black">6th Semester</option>
                                        <option value="7th Sem" className="bg-black">7th Semester</option>
                                        <option value="8th Sem" className="bg-black">8th Semester</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-white/80 text-sm mb-2 block">Password *</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                    placeholder="Create password"
                                    value={formData.password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    required
                                />
                            </div>
                            {passwordStrength.text && (
                                <p className={`text-xs mt-2 ${passwordStrength.color}`}>
                                    Strength: {passwordStrength.text}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-white/80 text-sm mb-2 block">Confirm Password *</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

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
                                    <CheckCircle className="w-5 h-5" />
                                    Submit Registration
                                </>
                            )}
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

export default StudentRegistration;
