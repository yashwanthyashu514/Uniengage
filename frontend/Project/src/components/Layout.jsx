import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import campus1 from '../assets/campus1.png';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen relative">
            {/* Fixed Background */}
            <div className="fixed inset-0 z-0">
                <img
                    src={campus1}
                    alt="Background"
                    className="w-full h-full object-cover opacity-10 blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-black/90" />
            </div>

            <div className="relative z-10">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

                <div className="lg:ml-[280px] transition-all duration-300">
                    <div className="p-6">
                        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                        <main>{children}</main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
