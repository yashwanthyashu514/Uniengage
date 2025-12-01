import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { User, Mail, Building, Award, LogOut, Key, Settings, Edit3, Save, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        usn: user?.usn || 'N/A'
    });

    const handleSave = () => {
        // TODO: Add API call to update profile
        toast.success('Profile updated successfully! 🎉');
        setIsEditing(false);
    };

    const handleCancel = () => {
        setProfileData({
            name: user?.name || '',
            email: user?.email || '',
            usn: user?.usn || 'N/A'
        });
        setProfilePicture(null);
        setIsEditing(false);
    };

    const handlePictureUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
                toast.success('Profile picture uploaded!');
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                    <p className="text-white/70">Manage your account settings and preferences</p>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-8"
                >
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gmu-gold to-amber-600 flex items-center justify-center text-white font-bold text-4xl overflow-hidden">
                                    {profilePicture ? (
                                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePictureUpload}
                                        />
                                    </label>
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                                <p className="text-white/60 uppercase tracking-wide font-medium">{user?.role}</p>
                                {user?.role === 'STUDENT' && user?.totalCredits !== undefined && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Award className="w-5 h-5 text-yellow-400" />
                                        <span className="text-white font-semibold">{user.totalCredits} Credits</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {!isEditing ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold flex items-center gap-2"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </motion.button>
                        ) : (
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCancel}
                                    className="px-4 py-2 glass-button text-white rounded-lg font-semibold flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </motion.button>
                            </div>
                        )}
                    </div>

                    {/* Profile Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full px-4 py-3 glass-card text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            ) : (
                                <div className="flex items-center gap-3 glass-card p-4">
                                    <User className="w-5 h-5 text-white/60" />
                                    <span className="text-white font-medium">{user?.name}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">Email Address</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full px-4 py-3 glass-card text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            ) : (
                                <div className="flex items-center gap-3 glass-card p-4">
                                    <Mail className="w-5 h-5 text-white/60" />
                                    <span className="text-white font-medium">{user?.email}</span>
                                </div>
                            )}
                        </div>

                        {user?.role === 'STUDENT' && (
                            <div>
                                <label className="block text-white/70 text-sm font-medium mb-2">USN</label>
                                <div className="flex items-center gap-3 glass-card p-4">
                                    <Building className="w-5 h-5 text-white/60" />
                                    <span className="text-white font-medium">{user?.usn || 'N/A'}</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">Role</label>
                            <div className="flex items-center gap-3 glass-card p-4">
                                <Award className="w-5 h-5 text-white/60" />
                                <span className="text-white font-medium uppercase">{user?.role}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toast.info('Change password functionality coming soon!')}
                            className="flex items-center gap-3 glass-card p-4 text-white hover:bg-white/10 transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                                <Key className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Change Password</p>
                                <p className="text-white/60 text-sm">Update your account password</p>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toast.info('Settings functionality coming soon!')}
                            className="flex items-center gap-3 glass-card p-4 text-white hover:bg-white/10 transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                                <Settings className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Preferences</p>
                                <p className="text-white/60 text-sm">Manage app settings</p>
                            </div>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Danger Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 border-2 border-red-500/30"
                >
                    <h3 className="text-xl font-bold text-white mb-4">Danger Zone</h3>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={logout}
                        className="flex items-center gap-3 bg-red-500/20 hover:bg-red-500/30 p-4 rounded-lg text-red-200 transition-all w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        <div className="text-left">
                            <p className="font-semibold">Logout</p>
                            <p className="text-red-200/70 text-sm">Sign out of your account</p>
                        </div>
                    </motion.button>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Profile;
