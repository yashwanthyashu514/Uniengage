import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import CountdownTimer from '../components/CountdownTimer';
import { motion } from 'framer-motion';
import { Trophy, Calendar, TrendingUp, Clock, Award, FileText } from 'lucide-react';
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
            setAvailableEvents(data.filter(e => e.status === 'APPROVED'));
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

    const [registrationEvent, setRegistrationEvent] = useState(null);
    const [isRuleAccepted, setIsRuleAccepted] = useState(false);

    const openRegistrationModal = (event) => {
        setRegistrationEvent(event);
        setIsRuleAccepted(false);
    };

    const handleConfirmRegistration = async () => {
        if (!isRuleAccepted) return;

        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/events/register', {
                eventId: registrationEvent._id,
                acceptedRules: true
            }, config);
            toast.success('Registered Successfully! 🎉');
            setRegistrationEvent(null);
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

                {/* Available Events */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Available Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableEvents.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="glass-card p-4 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white text-lg">{event.title}</h3>
                                        <span className="bg-white/10 px-2 py-1 rounded text-xs text-white/80">{event.category}</span>
                                    </div>
                                    <p className="text-white/70 text-sm mb-3 line-clamp-2">{event.description}</p>

                                    <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Trophy className="w-4 h-4" />
                                            {event.credits} Credits
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => openRegistrationModal(event)}
                                    className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold"
                                >
                                    Register
                                </motion.button>
                            </motion.div>
                        ))}
                        {availableEvents.length === 0 && (
                            <p className="text-white/50 col-span-2 text-center py-4">No available events at the moment.</p>
                        )}
                    </div>
                </motion.div>

                {/* Registered Events */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Registered Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dashboardData.registeredEvents?.map((reg, index) => {
                            const event = reg.eventId;
                            if (!event) return null;

                            // Format registration timestamp
                            const regDate = new Date(reg.createdAt);
                            const formattedDate = regDate.toLocaleDateString('en-GB'); // DD-MM-YYYY
                            const formattedTime = regDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                            const timestampStr = `Registered on: ${formattedDate.replace(/\//g, '-')} | ${formattedTime}`;

                            return (
                                <motion.div
                                    key={reg._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    whileHover={{ scale: 1.02 }}
                                    className="glass-card p-4"
                                >
                                    <h3 className="font-bold text-white text-lg mb-1">{event.title}</h3>
                                    <p className="text-white/60 text-xs mb-2 font-mono">{timestampStr}</p>
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
                                </motion.div>
                            );
                        })}
                        {(!dashboardData.registeredEvents || dashboardData.registeredEvents.length === 0) && (
                            <p className="text-white/50 col-span-2 text-center py-4">No registered events yet.</p>
                        )}
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

            {/* Registration Modal */}
            {registrationEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setRegistrationEvent(null)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass-card p-8 max-w-md w-full"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Register for {registrationEvent.title}</h2>
                        <p className="text-white/70 mb-6">Please review the event rules and terms before confirming your registration.</p>

                        {registrationEvent.rulebookUrl && (
                            <a
                                href={`http://localhost:5000/${registrationEvent.rulebookUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-300 hover:text-blue-200 mb-6 p-3 bg-white/5 rounded-lg transition-colors"
                            >
                                <FileText className="w-5 h-5" />
                                <span className="font-medium">View Rulebook (PDF)</span>
                            </a>
                        )}

                        <label className="flex items-start gap-3 cursor-pointer group mb-8">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isRuleAccepted}
                                    onChange={(e) => setIsRuleAccepted(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/30 bg-white/10 transition-all checked:border-indigo-500 checked:bg-indigo-500"
                                />
                                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-sm text-white/80 group-hover:text-white transition-colors select-none">
                                I have read and accept the event rules & terms and conditions.
                            </span>
                        </label>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setRegistrationEvent(null)}
                                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRegistration}
                                disabled={!isRuleAccepted}
                                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                            >
                                Confirm Registration
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
