import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import CoordinatorPanel from './pages/CoordinatorPanel';
import QRScanner from './pages/QRScanner';
import PrivateRoute from './components/PrivateRoute'; // We need to create this

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute role="STUDENT"><Dashboard /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute role="ADMIN"><AdminPanel /></PrivateRoute>} />
          <Route path="/coordinator" element={<PrivateRoute role="COORDINATOR"><CoordinatorPanel /></PrivateRoute>} />
          <Route path="/scan" element={<PrivateRoute role="STUDENT"><QRScanner /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
