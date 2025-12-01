import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import CountdownTimer from '../components/CountdownTimer';
import { motion } from 'framer-motion';
import { Trophy, Calendar, TrendingUp, Clock, Award } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [availableEvents, setAvailableEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/student/dashboard', config);
            setDashboardData(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load dashboard data');
        }
    };

    const fetchEvents = async () => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/events/list', config);
            setAvailableEvents(data.filter(e => e.status === 'APPROVED').slice(0, 4));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
            fetchEvents();
        }
    }, [user]);

    const handleRegister = async (eventId) => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/events/register', { eventId }, config);
            toast.success('Successfully registered for event! 🎉');
            fetchDashboardData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    if (loading || !dashboardData) {
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

    const chartData = [
        { name: 'Earned Credits', value: dashboardData.totalCredits || 0, color: '#8b5cf6' },
        { name: 'Remaining to Goal', value: Math.max(0, 100 - (dashboardData.totalCredits || 0)), color: 'rgba(255,255,255,0.2)' },
    ];

    return (
        <Layout>
            <div className="space-y-6">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-white/70">Track your participation and earn credits for university events</p>
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
                                <p className="text-4xl font-bold text-white">{dashboardData.totalCredits}</p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                                <Trophy className="w-7 h-7 text-white" />
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
                                <p className="text-4xl font-bold text-white">{dashboardData.attendedEvents?.length || 0}</p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                                <Award className="w-7 h-7 text-white" />
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
                                <p className="text-white/70 text-sm font-medium mb-1">Participation Rate</p>
                                <p className="text-4xl font-bold text-white">{dashboardData.totalCredits > 0 ? '85%' : '0%'}</p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Credits Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Credit Progress</h2>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-64 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between glass-card p-4">
                                    <span className="text-white/80">Current Credits</span>
                                    <span className="text-white font-bold text-xl">{dashboardData.totalCredits}</span>
                                </div>
                                <div className="flex items-center justify-between glass-card p-4">
                                    <span className="text-white/80">Target Goal</span>
                                    <span className="text-white font-bold text-xl">100</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Upcoming Events */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Upcoming Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableEvents.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ scale: 1.02 }}
                                className="glass-card p-4"
                            >
                                <h3 className="font-bold text-white text-lg mb-2">{event.title}</h3>
                                <p className="text-white/70 text-sm mb-3 line-clamp-2">{event.description}</p>
                                <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Trophy className="w-4 h-4" />
                                        {event.credits} Credits
                                    </div>
                                </div>
                                <CountdownTimer eventDate={event.date} />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleRegister(event._id)}
                                    className="w-full py-2 bg-gradient-to-r from-gmu-maroon to-gmu-maroon-dark text-white rounded-lg font-semibold text-sm mt-3"
                                >
                                    Register Now
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Credit History */}
                {dashboardData.creditHistory && dashboardData.creditHistory.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
                        <div className="space-y-3">
                            {dashboardData.creditHistory.slice(0, 5).map((tx, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="flex items-center justify-between glass-card p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-white">{tx.eventId?.title || 'Event Participation'}</span>
                                    </div>
                                    <span className="text-green-400 font-bold">+{tx.credits} Credits</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
