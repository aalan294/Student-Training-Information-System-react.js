import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SampleDataProvider } from './utils/sampleDataContext';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import StudentView from './pages/StudentView';
import NotFound from './pages/NotFound';
import AdminLayout from './components/admin/AdminLayout';
import BulkUpload from './components/admin/BulkUpload';
import ScoreUpload from './components/admin/ScoreUpload';
import TrainingModuleView from './components/admin/TrainingModuleView';
import Students from './pages/Students';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import ProtectedRoute from './components/student/ProtectedRoute';
import AdminStudentDashboard from './pages/AdminStudentDashboard';
import Leaderboard from './pages/Leaderboard';
import AdminLeaderboard from './pages/AdminLeaderboard';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <SampleDataProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Outlet />
                </AdminLayout>
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:studentId/dashboard" element={<AdminStudentDashboard />} />
            <Route path="leaderboard" element={<AdminLeaderboard />} />
            <Route path="bulk-upload" element={<BulkUpload />} />
            <Route path="scores" element={<ScoreUpload />} />
            <Route path="training" element={<TrainingModuleView />} />
          </Route>
          
          {/* Student Routes */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/student/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SampleDataProvider>
    </Router>
  );
}

export default App;
