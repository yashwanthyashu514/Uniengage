import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Events = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = user.token;
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const { data } = await axios.get('http://localhost:5000/api/events/list', config);
                setEvents(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (user) fetchEvents();
    }, [user]);

    const handleRegister = async (eventId) => {
        try {
            const token = user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            await axios.post('http://localhost:5000/api/events/register', { eventId }, config);
            setMessage('Registered successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Events</h1>
            {message && <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">{message}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event._id} className="bg-white p-6 rounded shadow border-l-4 border-indigo-500">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-2">{event.description}</p>
                        <p className="text-sm text-gray-500 mb-1">Date: {new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500 mb-1">Venue: {event.venue}</p>
                        <p className="text-sm text-gray-500 mb-1">Credits: {event.credits}</p>
                        <p className="text-sm font-semibold mb-4">Status: <span className={event.status === 'APPROVED' ? 'text-green-600' : event.status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'}>{event.status}</span></p>

                        {user.role === 'STUDENT' && event.status === 'APPROVED' && (
                            <button
                                onClick={() => handleRegister(event._id)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
                            >
                                Register
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
