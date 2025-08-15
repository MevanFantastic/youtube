import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideoPage from './pages/VideoPage';
import ChannelPage from './pages/ChannelPage';
import EditVideoPage from './pages/EditVideoPage';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
    <Router>
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/videos/:id" element={<VideoPage />} />
   
          
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/channel" element={<ProtectedRoute><ChannelPage /></ProtectedRoute>} />
      <Route path="/edit/:id" element={<ProtectedRoute><EditVideoPage /></ProtectedRoute>} />
      </Routes>
      </Router>
    </AuthProvider>
  );
}

