import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const { user, logout } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', category: '', credits: 0, date: '', venue: ''
    });
    const [qrCode, setQrCode] = useState(null);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/events/list', config);
            setEvents(data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { if (user) fetchEvents(); }, [user]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/events/create', newEvent, config);
            fetchEvents();
            setNewEvent({ title: '', description: '', category: '', credits: 0, date: '', venue: '' });
            alert('Event Created Successfully');
        } catch (error) { alert('Error creating event'); }
    };

    const handleStatusUpdate = async (eventId, status) => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/events/update-status', { eventId, status }, config);
            fetchEvents();
        } catch (error) { alert('Error updating status'); }
    };

    const generateQR = async (eventId) => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5000/api/events/attendance/generate-qr', { eventId }, config);
            setQrCode(data.qrCode);
        } catch (error) { alert('Error generating QR'); }
    };

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Panel</h1>
                <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>

            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl font-bold mb-4">Create New Event</h2>
                <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Title" className="border p-2 rounded" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} required />
                    <input placeholder="Category" className="border p-2 rounded" value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })} required />
                    <input placeholder="Venue" className="border p-2 rounded" value={newEvent.venue} onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })} required />
                    <input type="number" placeholder="Credits" className="border p-2 rounded" value={newEvent.credits} onChange={e => setNewEvent({ ...newEvent, credits: e.target.value })} required />
                    <input type="date" className="border p-2 rounded" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} required />
                    <textarea placeholder="Description" className="border p-2 rounded md:col-span-2" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2">Create Event</button>
                </form>
            </div>

            {qrCode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded shadow-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">Event QR Code</h2>
                        <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
                        <button onClick={() => setQrCode(null)} className="bg-red-500 text-white px-4 py-2 rounded">Close</button>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Manage Events</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b p-2">Title</th>
                            <th className="border-b p-2">Date</th>
                            <th className="border-b p-2">Status</th>
                            <th className="border-b p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event._id}>
                                <td className="border-b p-2">{event.title}</td>
                                <td className="border-b p-2">{new Date(event.date).toLocaleDateString()}</td>
                                <td className="border-b p-2">
                                    <span className={`px-2 py-1 rounded text-sm ${event.status === 'APPROVED' ? 'bg-green-100 text-green-800' : event.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="border-b p-2 space-x-2">
                                    {event.status === 'PENDING' && (
                                        <>
                                            <button onClick={() => handleStatusUpdate(event._id, 'APPROVED')} className="text-green-600 hover:underline">Approve</button>
                                            <button onClick={() => handleStatusUpdate(event._id, 'REJECTED')} className="text-red-600 hover:underline">Reject</button>
                                        </>
                                    )}
                                    {event.status === 'APPROVED' && (
                                        <button onClick={() => generateQR(event._id)} className="bg-indigo-600 text-white px-2 py-1 rounded text-sm">Generate QR</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
