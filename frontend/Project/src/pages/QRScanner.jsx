import { useEffect, useState, useContext } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
    const { user } = useContext(AuthContext);
    const [scanResult, setScanResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);

        async function onScanSuccess(decodedText, decodedResult) {
            scanner.clear();
            try {
                const token = user.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Assuming decodedText is the eventId or a JSON containing it
                // If the QR code contains just the ID:
                const eventId = decodedText.replace(/"/g, '');

                await axios.post('http://localhost:5000/api/events/attendance/scan', { eventId }, config);
                setScanResult('Attendance Marked Successfully!');
                setTimeout(() => navigate('/dashboard'), 2000);
            } catch (error) {
                setScanResult(`Error: ${error.response?.data?.message || 'Failed to mark attendance'}`);
            }
        }

        function onScanFailure(error) {
            // handle scan failure, usually better to ignore and keep scanning.
            // console.warn(`Code scan error = ${error}`);
        }

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        };
    }, [user, navigate]);

    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-3xl font-bold mb-6">Scan Event QR Code</h1>
            <div id="reader" className="mx-auto max-w-md"></div>
            {scanResult && (
                <div className={`mt-4 p-4 rounded ${scanResult.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {scanResult}
                </div>
            )}
            <button onClick={() => navigate('/dashboard')} className="mt-6 bg-gray-500 text-white px-4 py-2 rounded">Back to Dashboard</button>
        </div>
    );
};

export default QRScanner;
