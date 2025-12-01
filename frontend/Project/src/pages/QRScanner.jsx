import { useEffect, useState, useContext } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle, XCircle, Scan, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const QRScanner = () => {
    const { user } = useContext(AuthContext);
    const [scanResult, setScanResult] = useState(null);
    const [scanning, setScanning] = useState(true);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let scanner = null;

        const startScanner = () => {
            scanner = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                false
            );

            scanner.render(onScanSuccess, onScanFailure);
        };

        async function onScanSuccess(decodedText, decodedResult) {
            setScanning(false);
            scanner?.clear();

            try {
                const token = user.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Send the raw QR data to backend
                await axios.post('http://localhost:5000/api/events/attendance/scan', { qrData: decodedText }, config);
                setScanResult('Attendance Marked Successfully!');
                setSuccess(true);
                toast.success('Attendance marked! Credits earned 🎉');

                setTimeout(() => navigate('/student/dashboard'), 3000);
            } catch (error) {
                const errorMsg = error.response?.data?.message || 'Failed to mark attendance';
                setScanResult(errorMsg);
                setSuccess(false);
                toast.error(errorMsg);

                setTimeout(() => {
                    setScanResult(null);
                    setScanning(true);
                    startScanner();
                }, 3000);
            }
        }

        function onScanFailure(error) {
            // Ignore scan failures during scanning
        }

        if (scanning) {
            startScanner();
        }

        return () => {
            scanner?.clear().catch(err => console.error("Scanner cleanup error:", err));
        };
    }, [user, navigate, scanning]);

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">QR Code Scanner</h1>
                            <p className="text-white/70">Scan event QR code to mark attendance</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="glass-button text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </motion.button>
                    </div>
                </motion.div>

                {/* Scanner Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-8 relative overflow-hidden"
                >
                    {/* Scanning Animation Overlay */}
                    {scanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-indigo-500/20 to-transparent h-32 flex items-center justify-center"
                        >
                            <div className="flex items-center gap-3 text-white">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Scan className="w-6 h-6" />
                                </motion.div>
                                <span className="font-semibold">Scanning...</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Scanner */}
                    <div id="reader" className="rounded-lg overflow-hidden"></div>

                    {/* Camera Frame Decoration */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none">
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-indigo-400 rounded-br-lg"></div>
                    </div>
                </motion.div>

                {/* Result Modal */}
                <AnimatePresence>
                    {scanResult && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 50 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.8, y: 50 }}
                                className="glass-card p-8 text-center max-w-md"
                            >
                                {success ? (
                                    <>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: 'spring' }}
                                            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center"
                                        >
                                            <CheckCircle className="w-12 h-12 text-white" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-white mb-3">Success!</h2>
                                        <p className="text-white/80 text-lg mb-2">{scanResult}</p>
                                        <p className="text-white/60 text-sm">Redirecting to dashboard...</p>
                                    </>
                                ) : (
                                    <>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: 'spring' }}
                                            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-400 to-rose-400 flex items-center justify-center"
                                        >
                                            <XCircle className="w-12 h-12 text-white" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-white mb-3">Error</h2>
                                        <p className="text-white/80 text-lg mb-2">{scanResult}</p>
                                        <p className="text-white/60 text-sm">Restarting scanner...</p>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center flex-shrink-0">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-2">How to scan</h3>
                            <ul className="text-white/70 text-sm space-y-1">
                                <li>• Allow camera access when prompted</li>
                                <li>• Position the QR code within the frame</li>
                                <li>• Hold steady until the code is scanned</li>
                                <li>• Your attendance will be marked automatically</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default QRScanner;
