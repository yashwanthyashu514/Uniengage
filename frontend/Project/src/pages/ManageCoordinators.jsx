import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, Edit, Save, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageCoordinators = () => {
    const [coordinators, setCoordinators] = useState([
        { id: 1, name: 'John Doe', email: 'john@gmu.edu', department: 'CSE', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@gmu.edu', department: 'ISE', status: 'Active' },
    ]);
    const [isAdding, setIsAdding] = useState(false);
    const [newCoordinator, setNewCoordinator] = useState({ name: '', email: '', department: '', password: '' });

    const handleAddCoordinator = (e) => {
        e.preventDefault();
        // Mock API call
        const newId = coordinators.length + 1;
        setCoordinators([...coordinators, { ...newCoordinator, id: newId, status: 'Active' }]);
        setIsAdding(false);
        setNewCoordinator({ name: '', email: '', department: '', password: '' });
        toast.success('Coordinator added successfully!');
    };

    const handleDelete = (id) => {
        setCoordinators(coordinators.filter(c => c.id !== id));
        toast.success('Coordinator removed successfully');
    };

    return (
        <Layout>
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Manage Coordinators</h1>
                        <p className="text-white/70">Add and manage department coordinators</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAdding(true)}
                        className="px-4 py-2 bg-gradient-to-r from-gmu-maroon to-gmu-maroon-dark text-white rounded-lg font-semibold flex items-center gap-2"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add Coordinator
                    </motion.button>
                </motion.div>

                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-4">Add New Coordinator</h2>
                        <form onSubmit={handleAddCoordinator} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={newCoordinator.name}
                                onChange={(e) => setNewCoordinator({ ...newCoordinator, name: e.target.value })}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gmu-gold"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={newCoordinator.email}
                                onChange={(e) => setNewCoordinator({ ...newCoordinator, email: e.target.value })}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gmu-gold"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Department"
                                value={newCoordinator.department}
                                onChange={(e) => setNewCoordinator({ ...newCoordinator, department: e.target.value })}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gmu-gold"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newCoordinator.password}
                                onChange={(e) => setNewCoordinator({ ...newCoordinator, password: e.target.value })}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gmu-gold"
                                required
                            />
                            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gmu-gold text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="pb-4 text-white/60 font-medium">Name</th>
                                    <th className="pb-4 text-white/60 font-medium">Email</th>
                                    <th className="pb-4 text-white/60 font-medium">Department</th>
                                    <th className="pb-4 text-white/60 font-medium">Status</th>
                                    <th className="pb-4 text-white/60 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {coordinators.map((coordinator) => (
                                    <tr key={coordinator.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 text-white font-medium">{coordinator.name}</td>
                                        <td className="py-4 text-white/80">{coordinator.email}</td>
                                        <td className="py-4 text-white/80">{coordinator.department}</td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                                                {coordinator.status}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex gap-2">
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coordinator.id)}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default ManageCoordinators;
