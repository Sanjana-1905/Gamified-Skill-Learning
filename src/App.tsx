import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TestSetup from './pages/TestSetup';
import TestPage from './pages/TestPage';
import TestResults from './pages/TestResults';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: 'student' | 'teacher' }> = ({ 
  children, 
  role 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'student' ? '/student' : '/teacher'} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'student' ? '/student' : '/teacher'} replace /> : <LoginPage />} />
      
      <Route path="/student" element={
        <ProtectedRoute role="student">
          <Layout>
            <StudentDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/teacher" element={
        <ProtectedRoute role="teacher">
          <Layout>
            <TeacherDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/test-setup" element={
        <ProtectedRoute role="student">
          <Layout>
            <TestSetup />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/test" element={
        <ProtectedRoute role="student">
          <Layout>
            <TestPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/test-results" element={
        <ProtectedRoute role="student">
          <Layout>
            <TestResults />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <AppRoutes />
          </Router>
        </DataProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;