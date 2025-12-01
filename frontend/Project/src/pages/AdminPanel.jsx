import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, QrCode, Check, XCircle, Calendar, MapPin, Trophy, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', category: '', credits: 0, date: '', venue: ''
    });

    const fetchEvents = async () => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/events/list', config);
            setEvents(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load events');
        }
    };

    useEffect(() => {
        if (user) fetchEvents();
    }, [user]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/events/create', newEvent, config);
            toast.success('Event created successfully! 🎉');
            fetchEvents();
            setNewEvent({ title: '', description: '', category: '', credits: 0, date: '', venue: '' });
            setShowModal(false);
        } catch (error) {
            toast.error('Error creating event');
        }
    };

    const handleStatusUpdate = async (eventId, status) => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/events/update-status', { eventId, status }, config);
            toast.success(`Event ${status.toLowerCase()} successfully!`);
            fetchEvents();
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    const generateQR = async (eventId) => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5000/api/events/attendance/generate-qr', { eventId }, config);
            setQrCode(data.qrCode);
        } catch (error) {
            toast.error('Error generating QR code');
        }
    };

    const getStatusColor = (status) => {
        if (status === 'APPROVED') return 'bg-green-500/20 text-green-200';
        if (status === 'REJECTED') return 'bg-red-500/20 text-red-200';
        return 'bg-yellow-500/20 text-yellow-200';
    };

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
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                        <p className="text-white/70">Manage events and approval workflows</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Create Event
                    </motion.button>
                </motion.div>

                {/* Events Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 overflow-x-auto"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Manage Events</h2>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="text-left text-white/80 font-semibold pb-3 px-4">Event</th>
                                <th className="text-left text-white/80 font-semibold pb-3 px-4">Date</th>
                                <th className="text-left text-white/80 font-semibold pb-3 px-4">Credits</th>
                                <th className="text-left text-white/80 font-semibold pb-3 px-4">Status</th>
                                <th className="text-right text-white/80 font-semibold pb-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => (
                                <motion.tr
                                    key={event._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                                >
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="text-white font-semibold">{event.title}</p>
                                            <p className="text-white/60 text-sm">{event.venue}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-white/80">
                                        {new Date(event.date).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center gap-1 text-yellow-300">
                                            <Trophy className="w-4 h-4" />
                                            {event.credits}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {event.status === 'PENDING' && (
                                                <>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleStatusUpdate(event._id, 'APPROVED')}
                                                        className="p-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleStatusUpdate(event._id, 'REJECTED')}
                                                        className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </motion.button>
                                                </>
                                            )}
                                            {event.status === 'APPROVED' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => generateQR(event._id)}
                                                    className="px-3 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30 transition-all flex items-center gap-1 text-sm"
                                                >
                                                    <QrCode className="w-4 h-4" />
                                                    QR Code
                                                </motion.button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* Create Event Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="glass-card p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-white/60 hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateEvent} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-white/90 mb-2 font-medium">Event Title</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 glass-card text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                placeholder="E.g., Tech Workshop"
                                                value={newEvent.title}
                                                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white/90 mb-2 font-medium">Category</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 glass-card text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                placeholder="E.g., Technology"
                                                value={newEvent.category}
                                                onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white/90 mb-2 font-medium">Venue</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 glass-card text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                placeholder="E.g., Main Auditorium"
                                                value={newEvent.venue}
                                                onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white/90 mb-2 font-medium">Credits</label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-3 glass-card text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                placeholder="5"
                                                value={newEvent.credits}
                                                onChange={e => setNewEvent({ ...newEvent, credits: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-white/90 mb-2 font-medium">Event Date</label>
                                            <input
                                                type="date"
                                                className="w-full px-4 py-3 glass-card text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                value={newEvent.date}
                                                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-white/90 mb-2 font-medium">Description</label>
                                            <textarea
                                                className="w-full px-4 py-3 glass-card text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                                                rows="4"
                                                placeholder="Describe your event..."
                                                value={newEvent.description}
                                                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold"
                                        >
                                            Create Event
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-6 py-3 glass-button text-white rounded-lg font-semibold"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* QR Code Modal */}
                <AnimatePresence>
                    {qrCode && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setQrCode(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="glass-card p-8 text-center max-w-md"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">Event QR Code</h2>
                                <div className="bg-white p-4 rounded-lg mb-6 inline-block">
                                    <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                                </div>
                                <p className="text-white/70 mb-6">Students can scan this QR code to mark attendance</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setQrCode(null)}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold"
                                >
                                    Close
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default AdminPanel;
