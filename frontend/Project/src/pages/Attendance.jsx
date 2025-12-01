import { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Calendar, Users, CheckCircle, XCircle, Search, Save, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

const Attendance = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events] = useState([
        { id: 1, title: 'Tech Talk: AI Futures', date: '2023-11-15', registered: 45, status: 'Upcoming' },
        { id: 2, title: 'Web Dev Workshop', date: '2023-11-20', registered: 30, status: 'Upcoming' },
        { id: 3, title: 'Hackathon Kickoff', date: '2023-11-10', registered: 120, status: 'Completed' },
    ]);

    const [participants, setParticipants] = useState([
        { id: 101, name: 'Alice Johnson', usn: '1GM20CS001', status: 'Present' },
        { id: 102, name: 'Bob Smith', usn: '1GM20CS002', status: 'Absent' },
        { id: 103, name: 'Charlie Brown', usn: '1GM20CS003', status: 'Present' },
        { id: 104, name: 'David Lee', usn: '1GM20CS004', status: 'Pending' },
        { id: 105, name: 'Eva Green', usn: '1GM20CS005', status: 'Pending' },
    ]);

    const handleStatusChange = (id, newStatus) => {
        setParticipants(participants.map(p =>
            p.id === id ? { ...p, status: newStatus } : p
        ));
    };

    const handleSubmitAttendance = () => {
        // Mock API call
        toast.success('Attendance submitted successfully!');
        setSelectedEvent(null);
    };

    return (
        <Layout>
            <div className="space-y-6">
                {!selectedEvent ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-white">Attendance Management</h1>
                            <a
                                href="/scan"
                                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                            >
                                <QrCode className="w-5 h-5" />
                                Scan QR Code
                            </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <motion.div
                                    key={event.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-all"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-gmu-gold/20 rounded-lg">
                                            <Calendar className="w-6 h-6 text-gmu-gold" />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                    <p className="text-white/60 text-sm mb-4">{event.date}</p>
                                    <div className="flex items-center gap-2 text-white/50 text-sm">
                                        <Users className="w-4 h-4" />
                                        <span>{event.registered} Registered</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="text-white/50 hover:text-white text-sm mb-2 hover:underline"
                                >
                                    ← Back to Events
                                </button>
                                <h1 className="text-2xl font-bold text-white">{selectedEvent.title} - Participants</h1>
                            </div>
                            <button
                                onClick={handleSubmitAttendance}
                                className="px-6 py-2 bg-gmu-gold text-black font-bold rounded-lg hover:bg-yellow-400 transition-all flex items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Submit Attendance
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="pb-4 text-white/60 font-medium">Student Name</th>
                                        <th className="pb-4 text-white/60 font-medium">USN</th>
                                        <th className="pb-4 text-white/60 font-medium">Status</th>
                                        <th className="pb-4 text-white/60 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {participants.map((participant) => (
                                        <tr key={participant.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4 text-white font-medium">{participant.name}</td>
                                            <td className="py-4 text-white/80">{participant.usn}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${participant.status === 'Present' ? 'bg-green-500/20 text-green-300' :
                                                    participant.status === 'Absent' ? 'bg-red-500/20 text-red-300' :
                                                        'bg-yellow-500/20 text-yellow-300'
                                                    }`}>
                                                    {participant.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusChange(participant.id, 'Present')}
                                                        className={`p-2 rounded-lg transition-all ${participant.status === 'Present'
                                                            ? 'bg-green-500 text-black'
                                                            : 'bg-white/10 text-white/50 hover:bg-green-500/20 hover:text-green-300'
                                                            }`}
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(participant.id, 'Absent')}
                                                        className={`p-2 rounded-lg transition-all ${participant.status === 'Absent'
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-white/10 text-white/50 hover:bg-red-500/20 hover:text-red-300'
                                                            }`}
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
        </Layout>
    );
};

export default Attendance;
