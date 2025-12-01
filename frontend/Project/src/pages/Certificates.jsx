import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Award, Download, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Certificates = () => {
    const { user } = useContext(AuthContext);

    // Mock certificates data
    const certificates = [
        { id: 1, eventName: 'Tech Workshop 2024', credits: 10, date: '2024-01-15', verified: true },
        { id: 2, eventName: 'Cultural Fest', credits: 15, date: '2024-02-10', verified: true },
        { id: 3, eventName: 'Sports Meet', credits: 8, date: '2024-03-05', verified: false },
    ];

    const handleDownload = (certId, eventName) => {
        toast.success(`Downloading certificate for ${eventName}...`);
        // In production, this would generate and download actual PDF
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">My Certificates 🏆</h1>
                    <p className="text-white/70">View and download your event participation certificates</p>
                </motion.div>

                {/* Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="glass-card p-6 border-2 border-gmu-gold/30 relative overflow-hidden"
                        >
                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gmu-gold/10 rounded-full -mr-12 -mt-12" />

                            {/* Certificate Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gmu-gold to-amber-600 flex items-center justify-center">
                                    <Award className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            {/* Certificate Details */}
                            <h3 className="text-white font-bold text-lg text-center mb-3">{cert.eventName}</h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/60">Credits Earned:</span>
                                    <span className="text-gmu-gold font-semibold">{cert.credits}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/60">Date Issued:</span>
                                    <span className="text-white">{new Date(cert.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/60">Status:</span>
                                    {cert.verified ? (
                                        <span className="text-green-400 font-medium">✓ Verified</span>
                                    ) : (
                                        <span className="text-yellow-400 font-medium">⏳ Processing</span>
                                    )}
                                </div>
                            </div>

                            {/* Download Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDownload(cert.id, cert.eventName)}
                                disabled={!cert.verified}
                                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${cert.verified
                                        ? 'bg-gradient-to-r from-gmu-maroon to-gmu-maroon-dark text-white'
                                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                                    }`}
                            >
                                <Download className="w-4 h-4" />
                                {cert.verified ? 'Download PDF' : 'Processing...'}
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {certificates.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card p-12 text-center"
                    >
                        <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
                        <p className="text-white/60 text-lg">No certificates yet</p>
                        <p className="text-white/40 text-sm mt-2">Attend events to earn certificates!</p>
                    </motion.div>
                )}
            </div>
        </Layout>
    );
};

export default Certificates;
