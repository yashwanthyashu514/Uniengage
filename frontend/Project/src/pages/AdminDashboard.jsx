import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Calendar,
    Award,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    Plus,
    FileText,
    Bell,
    Edit,
    Trash2
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ studentCount: 0, coordinatorCount: 0 });
    const [events, setEvents] = useState([]);
    const [coordinators, setCoordinators] = useState([]);
    const [students, setStudents] = useState([]);
    const [pendingStudents, setPendingStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        password: ''
    });
    const [eventFormData, setEventFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        category: '',
        credits: ''
    });

    const fetchData = async () => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [statsRes, eventsRes, coordRes, studentsRes, pendingRes] = await Promise.all([
                axios.get('http://localhost:5000/api/auth/stats', config),
                axios.get('http://localhost:5000/api/events/list', config),
                axios.get('http://localhost:5000/api/auth/coordinators', config),
                axios.get('http://localhost:5000/api/auth/students', config),
                axios.get('http://localhost:5000/api/auth/pending-students', config)
            ]);

            setStats(statsRes.data);
            setEvents(eventsRes.data);
            setCoordinators(coordRes.data);
            setStudents(studentsRes.data);
            setPendingStudents(pendingRes.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const handleEventAction = async (eventId, status) => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/events/update-status', { eventId, status }, config);
            toast.success(`Event ${status.toLowerCase()} successfully!`);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleCreateCoordinator = async (e) => {
        e.preventDefault();
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/auth/coordinator/create', formData, config);
            toast.success('Coordinator created successfully! ✅');
            setShowModal(false);
            setFormData({ name: '', email: '', department: '', password: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create coordinator');
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        const eventDateTime = new Date(`${eventFormData.date}T${eventFormData.time || '00:00'}`);

        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/events/create', {
                title: eventFormData.title,
                description: eventFormData.description,
                date: eventDateTime,
                venue: eventFormData.venue,
                category: eventFormData.category,
                credits: parseInt(eventFormData.credits)
            }, config);

            toast.success('Event created successfully! 🎉');
            setShowCreateEventModal(false);
            setEventFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                venue: '',
                category: '',
                credits: ''
            });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create event');
        }
    };

    const handleApproveStudent = async (studentId) => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/auth/approve-student/${studentId}`, {}, config);
            toast.success('Student approved successfully! ✅');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve student');
        }
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

    const totalCredits = students.reduce((sum, s) => sum + (s.totalCredits || 0), 0);

    // Monthly event data
    const monthlyData = events.reduce((acc, event) => {
        const month = new Date(event.date).toLocaleDateString('en-US', { month: 'short' });
        const existing = acc.find(item => item.month === month);
        if (existing) {
            existing.count += 1;
        } else {
            acc.push({ month, count: 1 });
        }
        return acc;
    }, []);

    // Credit distribution by student
    const topStudents = students
        .sort((a, b) => (b.totalCredits || 0) - (a.totalCredits || 0))
        .slice(0, 5)
        .map(s => ({ name: s.name, credits: s.totalCredits || 0 }));

    const statusData = [
        { name: 'Approved', value: events.filter(e => e.status === 'APPROVED').length, color: '#10b981' },
        { name: 'Pending', value: events.filter(e => e.status === 'PENDING').length, color: '#f59e0b' },
        { name: 'Rejected', value: events.filter(e => e.status === 'REJECTED').length, color: '#ef4444' }
    ];

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard 🎯</h1>
                    <p className="text-white/70">Comprehensive system overview and management</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 hover:scale-105 transition-transform"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm mb-1">Total Students</p>
                                <p className="text-4xl font-bold text-white">{stats.studentCount}</p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6 hover:scale-105 transition-transform"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm mb-1">Total Coordinators</p>
                                <p className="text-4xl font-bold text-white">{stats.coordinatorCount}</p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 hover:scale-105 transition-transform"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm mb-1">Total Events</p>
                                <p className="text-4xl font-bold text-white">{events.length}</p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                <Calendar className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-6 hover:scale-105 transition-transform"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm mb-1">Total Credits</p>
                                <p className="text-4xl font-bold text-white">{totalCredits}</p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                <Award className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowCreateEventModal(true)}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-semibold shadow-lg"
                        >
                            <Plus className="w-6 h-6" />
                            Create Event
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-semibold shadow-lg"
                        >
                            <Plus className="w-6 h-6" />
                            Create Coordinator
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.location.href = '/admin/reports'}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold shadow-lg"
                        >
                            <FileText className="w-6 h-6" />
                            Open Reports
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toast.success('Announcement feature coming soon!')}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-semibold shadow-lg"
                        >
                            <Bell className="w-6 h-6" />
                            Send Announcement
                        </motion.button>
                    </div>
                </motion.div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-6">Monthly Event Participation</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
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
                                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-6">Event Status Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Pending Approvals */}
                {pendingStudents.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.75 }}
                        className="glass-card p-6 border border-yellow-500/30"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Users className="w-6 h-6 text-yellow-400" />
                            Pending Student Approvals
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="text-left text-white/80 font-semibold pb-3 px-4">Name</th>
                                        <th className="text-left text-white/80 font-semibold pb-3 px-4">Email</th>
                                        <th className="text-left text-white/80 font-semibold pb-3 px-4">USN</th>
                                        <th className="text-left text-white/80 font-semibold pb-3 px-4">Department</th>
                                        <th className="text-left text-white/80 font-semibold pb-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingStudents.map((student, index) => (
                                        <motion.tr
                                            key={student._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                            className="border-b border-white/10 hover:bg-white/5"
                                        >
                                            <td className="py-4 px-4 text-white font-medium">{student.name}</td>
                                            <td className="py-4 px-4 text-white/80">{student.email}</td>
                                            <td className="py-4 px-4 text-white/80">{student.usn}</td>
                                            <td className="py-4 px-4 text-white/80">{student.department}</td>
                                            <td className="py-4 px-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleApproveStudent(student._id)}
                                                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 flex items-center gap-2 font-semibold"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Approve
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* Event Management Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Event Management</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Event Name</th>
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Category</th>
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Date</th>
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Status</th>
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.slice(0, 10).map((event, index) => (
                                    <motion.tr
                                        key={event._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                        className="border-b border-white/10 hover:bg-white/5"
                                    >
                                        <td className="py-4 px-4 text-white font-medium">{event.title}</td>
                                        <td className="py-4 px-4 text-white/80">{event.category || 'N/A'}</td>
                                        <td className="py-4 px-4 text-white/80">{new Date(event.date).toLocaleDateString()}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'APPROVED' ? 'bg-green-500/20 text-green-200' :
                                                event.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-200' :
                                                    event.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-200' :
                                                        'bg-red-500/20 text-red-200'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                {event.status === 'PENDING' && (
                                                    <>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleEventAction(event._id, 'APPROVED')}
                                                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleEventAction(event._id, 'REJECTED')}
                                                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </motion.button>
                                                    </>
                                                )}
                                                {event.status === 'APPROVED' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEventAction(event._id, 'COMPLETED')}
                                                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </motion.button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Coordinator Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Coordinator Management</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Name</th>
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Email</th>
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Department</th>
                                    <th className="text-left text-white/80 font-semibold pb-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coordinators.map((coord, index) => (
                                    <motion.tr
                                        key={coord._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                        className="border-b border-white/10 hover:bg-white/5"
                                    >
                                        <td className="py-4 px-4 text-white font-medium">{coord.name}</td>
                                        <td className="py-4 px-4 text-white/80">{coord.email}</td>
                                        <td className="py-4 px-4 text-white/80">{coord.department || 'N/A'}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => toast('Edit feature coming soon!')}
                                                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => toast.error('Delete feature coming soon!')}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Create Coordinator Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-card p-8 max-w-md w-full"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Create New Coordinator</h2>
                            <form onSubmit={handleCreateCoordinator} className="space-y-4">
                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="coordinator@gmu.edu"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Department</label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Computer Science"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold"
                                    >
                                        Create Coordinator
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => setShowModal(false)}
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

            {/* Create Event Modal */}
            <AnimatePresence>
                {showCreateEventModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCreateEventModal(false)}
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
                                        value={eventFormData.title}
                                        onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter event title"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Description *</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={eventFormData.description}
                                        onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
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
                                            value={eventFormData.date}
                                            onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/80 text-sm mb-2 block">Time</label>
                                        <input
                                            type="time"
                                            value={eventFormData.time}
                                            onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Venue *</label>
                                    <input
                                        type="text"
                                        required
                                        value={eventFormData.venue}
                                        onChange={(e) => setEventFormData({ ...eventFormData, venue: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter venue"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white/80 text-sm mb-2 block">Category *</label>
                                        <select
                                            required
                                            value={eventFormData.category}
                                            onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value })}
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
                                            value={eventFormData.credits}
                                            onChange={(e) => setEventFormData({ ...eventFormData, credits: e.target.value })}
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
                                        onClick={() => setShowCreateEventModal(false)}
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
        </Layout>
    );
};

export default AdminDashboard;
