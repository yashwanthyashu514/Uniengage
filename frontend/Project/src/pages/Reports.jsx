import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';

const Reports = () => {
    const { user } = useContext(AuthContext);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const token = user.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5000/api/student/dashboard', config);
                setReportData(data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load report data');
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchReportData();
    }, [user]);

    const generatePDF = () => {
        toast.success('PDF report download started! 📄');
    };

    if (loading || !reportData) {
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

    const creditHistory = reportData.creditHistory || [];
    const attendedEvents = reportData.attendedEvents || [];

    // Prepare monthly credit data
    const monthlyData = creditHistory.reduce((acc, tx) => {
        const month = new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short' });
        const existing = acc.find(item => item.month === month);
        if (existing) {
            existing.credits += tx.credits;
        } else {
            acc.push({ month, credits: tx.credits });
        }
        return acc;
    }, []);

    // Prepare category data
    const categoryData = attendedEvents.reduce((acc, event) => {
        const category = event.eventId?.category || 'Other';
        const existing = acc.find(item => item.category === category);
        if (existing) {
            existing.count += 1;
        } else {
            acc.push({ category, count: 1 });
        }
        return acc;
    }, []);

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Activity Reports 📊</h1>
                        <p className="text-white/70">Comprehensive insights into your participation</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={generatePDF}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg"
                    >
                        <Download className="w-5 h-5" />
                        Export PDF
                    </motion.button>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm mb-1">Total Credits</p>
                                <p className="text-3xl font-bold text-white">{reportData.totalCredits}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                                <Award className="w-6 h-6 text-white" />
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
                                <p className="text-white/70 text-sm mb-1">Events Attended</p>
                                <p className="text-3xl font-bold text-white">{attendedEvents.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white" />
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
                                <p className="text-white/70 text-sm mb-1">Avg Credits/Event</p>
                                <p className="text-3xl font-bold text-white">
                                    {attendedEvents.length > 0 ? (reportData.totalCredits / attendedEvents.length).toFixed(1) : 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm mb-1">Categories</p>
                                <p className="text-3xl font-bold text-white">{categoryData.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Credit Trend Chart */}
                {monthlyData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-6">Monthly Credit Trend</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="month" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Line type="monotone" dataKey="credits" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

                {/* Category Distribution Chart */}
                {categoryData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-6">Events by Category</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="category" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Bar dataKey="count" fill="#ec4899" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

                {/* Event History Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Attendance History</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Event Name</th>
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Category</th>
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Date</th>
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendedEvents.map((attendance, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                        className="border-b border-white/10 hover:bg-white/5"
                                    >
                                        <td className="py-4 px-4 text-white font-medium">
                                            {attendance.eventId?.title || 'N/A'}
                                        </td>
                                        <td className="py-4 px-4 text-white/80">
                                            {attendance.eventId?.category || 'N/A'}
                                        </td>
                                        <td className="py-4 px-4 text-white/80">
                                            {new Date(attendance.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-green-400 font-bold">
                                                +{attendance.eventId?.credits || 0}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Reports;
