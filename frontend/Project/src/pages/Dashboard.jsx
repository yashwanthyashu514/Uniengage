import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [availableEvents, setAvailableEvents] = useState([]);
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/student/dashboard', config);
            setDashboardData(data);
        } catch (error) { console.error(error); }
    };

    const fetchEvents = async () => {
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/events/list', config);
            // Filter for approved events only
            setAvailableEvents(data.filter(e => e.status === 'APPROVED'));
        } catch (error) { console.error(error); }
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
            alert('Registered Successfully');
            fetchDashboardData(); // Refresh to show potentially updated status
        } catch (error) { alert(error.response?.data?.message || 'Registration failed'); }
    };

    if (!dashboardData) return <div className="p-8">Loading...</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                <div className="space-x-4">
                    <button onClick={() => navigate('/scan')} className="bg-indigo-600 text-white px-4 py-2 rounded">Scan QR Code</button>
                    <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-100 p-6 rounded shadow">
                    <h3 className="text-lg font-bold text-blue-800">Total Credits</h3>
                    <p className="text-4xl font-bold text-blue-900">{dashboardData.totalCredits}</p>
                </div>
                <div className="bg-green-100 p-6 rounded shadow">
                    <h3 className="text-lg font-bold text-green-800">Events Attended</h3>
                    <p className="text-4xl font-bold text-green-900">{dashboardData.attendedEvents?.length || 0}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl font-bold mb-4">Available Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableEvents.map(event => (
                        <div key={event._id} className="border p-4 rounded hover:shadow-md transition">
                            <h3 className="font-bold text-lg">{event.title}</h3>
                            <p className="text-gray-600">{event.description}</p>
                            <p className="text-sm mt-2">Date: {new Date(event.date).toLocaleDateString()}</p>
                            <p className="text-sm">Credits: {event.credits}</p>
                            <button onClick={() => handleRegister(event._id)} className="mt-3 bg-blue-500 text-white px-3 py-1 rounded text-sm">Register</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Credit History</h2>
                <ul>
                    {dashboardData.creditHistory?.map((tx, index) => (
                        <li key={index} className="border-b py-2 flex justify-between">
                            <span>{tx.eventId?.title || 'Event Participation'}</span>
                            <span className="font-bold text-green-600">+{tx.credits} Credits</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
