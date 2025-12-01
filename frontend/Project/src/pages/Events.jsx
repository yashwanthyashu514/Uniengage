import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, Tag, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Events = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = user.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5000/api/events/list', config);
                setEvents(data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchEvents();
    }, [user]);

    const handleRegister = async (eventId) => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/events/register', { eventId }, config);
            toast.success('Successfully registered! 🎉');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    const filteredEvents = filter === 'ALL'
        ? events
        : events.filter(e => e.status === filter);

    const getStatusColor = (status) => {
        if (status === 'APPROVED') return 'from-green-400 to-emerald-400';
        if (status === 'REJECTED') return 'from-red-400 to-rose-400';
        return 'from-yellow-400 to-orange-400';
    };

    if (loading) {
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

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Browse Events</h1>
                    <p className="text-white/70">Discover and register for upcoming university events</p>
                </motion.div>

                {/* Filter Chips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-3 flex-wrap"
                >
                    {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((status) => (
                        <motion.button
                            key={status}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${filter === status
                                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg'
                                    : 'glass-button text-white/80'
                                }`}
                        >
                            {status}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (index % 6) }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="glass-card p-6 h-full flex flex-col"
                        >
                            {/* Status Badge */}
                            <div className="flex items-center justify-between mb-4">
                                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(event.status)} text-white text-xs font-bold`}>
                                    {event.status}
                                </div>
                                {event.category && (
                                    <div className="flex items-center gap-1 text-white/60 text-xs">
                                        <Tag className="w-3 h-3" />
                                        {event.category}
                                    </div>
                                )}
                            </div>

                            {/* Event Details */}
                            <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                            <p className="text-white/70 text-sm mb-4 flex-grow line-clamp-3">{event.description}</p>

                            {/* Meta Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <MapPin className="w-4 h-4" />
                                    {event.venue}
                                </div>
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <Trophy className="w-4 h-4" />
                                    {event.credits} Credits
                                </div>
                            </div>

                            {/* Register Button (only for students and approved events) */}
                            {user.role === 'STUDENT' && event.status === 'APPROVED' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleRegister(event._id)}
                                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Register Now
                                </motion.button>
                            )}
                        </motion.div>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card p-12 text-center"
                    >
                        <p className="text-white/60 text-lg">No events found matching your filter</p>
                    </motion.div>
                )}
            </div>
        </Layout>
    );
};

export default Events;
