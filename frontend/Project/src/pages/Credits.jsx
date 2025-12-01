import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Calendar, Award, ArrowUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Credits = () => {
    const { user } = useContext(AuthContext);
    const [creditData, setCreditData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCreditData = async () => {
            try {
                const token = user.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5000/api/student/dashboard', config);
                setCreditData(data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load credit data');
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchCreditData();
    }, [user]);

    if (loading || !creditData) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-96">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
                    />
                </div>
            </Layout>
        );
    }

    const totalCredits = creditData.user?.totalCredits || 0;
    const creditHistory = creditData.creditHistory || [];

    // Prepare chart data
    const chartData = creditHistory.slice(0, 10).reverse().map((tx, index) => ({
        name: tx.eventId?.title?.substring(0, 15) || `Event ${index + 1}`,
        credits: tx.credits
    }));

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">My Credits 💎</h1>
                    <p className="text-white/70">Track your earned credits and transaction history</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm font-medium mb-1">Total Credits</p>
                                <p className="text-5xl font-bold text-white">{totalCredits}</p>
                            </div>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm font-medium mb-1">Events Attended</p>
                                <p className="text-5xl font-bold text-white">{creditHistory.length}</p>
                            </div>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm font-medium mb-1">Average Credits</p>
                                <p className="text-5xl font-bold text-white">
                                    {creditHistory.length > 0 ? (totalCredits / creditHistory.length).toFixed(1) : 0}
                                </p>
                            </div>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Credit Chart */}
                {chartData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-6">Credit Activity</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#fff" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#fff" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Bar dataKey="credits" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

                {/* Transaction History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Transaction History</h2>
                    {creditHistory.length > 0 ? (
                        <div className="space-y-3">
                            {creditHistory.map((tx, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                    className="glass-card p-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                                            <ArrowUp className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">
                                                {tx.eventId?.title || 'Event Participation'}
                                            </p>
                                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(tx.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-green-400 font-bold text-xl">+{tx.credits}</p>
                                        <p className="text-white/60 text-sm">Credits</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-white/60">No transactions yet. Start attending events to earn credits!</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </Layout>
    );
};

export default Credits;
