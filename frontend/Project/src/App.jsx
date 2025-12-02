import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import CoordinatorPanel from './pages/CoordinatorPanel';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import QRScanner from './pages/QRScanner';
import Credits from './pages/Credits';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Certificates from './pages/Certificates';
import ManageCoordinators from './pages/ManageCoordinators';
import Attendance from './pages/Attendance';
import StudentRegistration from './pages/StudentRegistration';
import VerifyOtp from './pages/VerifyOtp';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/student-registration" element={<StudentRegistration />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/welcome" element={<PrivateRoute><LandingPage /></PrivateRoute>} />
          <Route path="/student/dashboard" element={<PrivateRoute role="STUDENT"><Dashboard /></PrivateRoute>} />
          <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute role="ADMIN"><AdminPanel /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/coordinators" element={<PrivateRoute role="ADMIN"><ManageCoordinators /></PrivateRoute>} />
          <Route path="/coordinator" element={<PrivateRoute role="COORDINATOR"><CoordinatorPanel /></PrivateRoute>} />
          <Route path="/coordinator/dashboard" element={<PrivateRoute role="COORDINATOR"><CoordinatorDashboard /></PrivateRoute>} />
          <Route path="/scan" element={<PrivateRoute><QRScanner /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute role="COORDINATOR"><Attendance /></PrivateRoute>} />
          <Route path="/coordinator/attendance" element={<PrivateRoute role="COORDINATOR"><Attendance /></PrivateRoute>} />
          <Route path="/credits" element={<PrivateRoute role="STUDENT"><Credits /></PrivateRoute>} />
          <Route path="/student/certificates" element={<PrivateRoute role="STUDENT"><Certificates /></PrivateRoute>} />
          <Route path="/student/events" element={<PrivateRoute><Events /></PrivateRoute>} />
          <Route path="/admin/reports" element={<PrivateRoute role="ADMIN"><Reports /></PrivateRoute>} />
          <Route path="/coordinator/reports" element={<PrivateRoute role="COORDINATOR"><Reports /></PrivateRoute>} />
          <Route path="/student/reports" element={<PrivateRoute role="STUDENT"><Reports /></PrivateRoute>} />
          <Route path="/student/leaderboard" element={<PrivateRoute role="STUDENT"><Dashboard /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/certificates" element={<PrivateRoute role="STUDENT"><Certificates /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
