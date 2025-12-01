import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, CheckCircle, BarChart3, Eye, X, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const CoordinatorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [coordinators, setCoordinators] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        category: '',
        credits: '',
        coordinator: ''
    });

    const fetchAnalytics = async () => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [eventsRes, coordRes] = await Promise.all([
                axios.get('http://localhost:5000/api/events/list', config),
                axios.get('http://localhost:5000/api/auth/coordinators', config).catch(() => ({ data: [] }))
            ]);

            const myEvents = eventsRes.data.filter(e => e.createdBy === user._id);
            const approvedEvents = myEvents.filter(e => e.status === 'APPROVED').length;
            const totalParticipants = myEvents.reduce((sum, e) => sum + (e.registrations?.length || 0), 0);

            setAnalytics({
                totalEvents: myEvents.length,
                approvedEvents,
                totalParticipants,
                events: myEvents
            });
            setCoordinators(coordRes.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchAnalytics();
    }, [user]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        // Combine date and time
        const eventDateTime = new Date(`${formData.date}T${formData.time || '00:00'}`);

        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/events/create', {
                title: formData.title,
                description: formData.description,
                date: eventDateTime,
                venue: formData.venue,
                category: formData.category,
                credits: parseInt(formData.credits)
            }, config);

            toast.success('Event created successfully! 🎉');
            setShowCreateModal(false);
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                venue: '',
                category: '',
                credits: '',
                coordinator: ''
            });
            fetchAnalytics();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create event');
        }
    };

    const viewParticipants = async (event) => {
        try {
            setSelectedEvent(event);
            setParticipants([
                { name: 'Sample Student 1', email: 'student1@gmu.edu', attended: true },
                { name: 'Sample Student 2', email: 'student2@gmu.edu', attended: false },
            ]);
        } catch (error) {
            toast.error('Failed to load participants');
        }
    };

    if (loading || !analytics) {
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

    const categoryData = analytics.events.reduce((acc, event) => {
        const category = event.category || 'Other';
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
                    className="glass-card p-6 flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Coordinator Dashboard 📋</h1>
                        <p className="text-white/70">Manage your events and track participation</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Create Event
                    </motion.button>
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
                                <p className="text-white/70 text-sm mb-1">My Events</p>
                                <p className="text-4xl font-bold text-white">{analytics.totalEvents}</p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                                <Calendar className="w-7 h-7 text-white" />
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
                                <p className="text-white/70 text-sm mb-1">Approved Events</p>
                                <p className="text-4xl font-bold text-white">{analytics.approvedEvents}</p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                                <CheckCircle className="w-7 h-7 text-white" />
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
                                <p className="text-white/70 text-sm mb-1">Total Participants</p>
                                <p className="text-4xl font-bold text-white">{analytics.totalParticipants}</p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Event Category Chart */}
                {categoryData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
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

                {/* My Events List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-6">My Events</h2>
                    <div className="space-y-3">
                        {analytics.events.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index }}
                                className="glass-card p-4 flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold">{event.title}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <p className="text-white/60 text-sm">{new Date(event.date).toLocaleDateString()}</p>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.status === 'APPROVED' ? 'bg-green-500/20 text-green-200' :
                                            event.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-200' :
                                                'bg-red-500/20 text-red-200'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                </div>
                                {event.status === 'APPROVED' && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.location.href = '/attendance'}
                                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Manage Attendance
                                    </motion.button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Create Event Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Create New Event</h2>
                            <form onSubmit={handleCreateEvent} className="space-y-4">
                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Event Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter event title"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Description *</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter event description"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white/80 text-sm mb-2 block">Date *</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/80 text-sm mb-2 block">Time</label>
                                        <input
                                            type="time"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Venue *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.venue}
                                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter venue"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white/80 text-sm mb-2 block">Category *</label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Select category</option>
                                            <option value="Technical">Technical</option>
                                            <option value="Cultural">Cultural</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Workshop">Workshop</option>
                                            <option value="Seminar">Seminar</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-white/80 text-sm mb-2 block">Credits *</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.credits}
                                            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold"
                                    >
                                        Create Event
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold"
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Participants Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedEvent(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-card p-8 w-full max-w-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">{selectedEvent.title} - Participants</h2>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {participants.length > 0 ? (
                                    participants.map((participant, index) => (
                                        <div key={index} className="glass-card p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium">{participant.name}</p>
                                                <p className="text-white/60 text-sm">{participant.email}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${participant.attended
                                                ? 'bg-green-500/20 text-green-200'
                                                : 'bg-yellow-500/20 text-yellow-200'
                                                }`}>
                                                {participant.attended ? 'Attended' : 'Registered'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white/60 text-center py-8">No participants yet</p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default CoordinatorDashboard;
