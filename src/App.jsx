import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SampleDataProvider } from './utils/sampleDataContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import StudentView from './pages/StudentView';
import NotFound from './pages/NotFound';
import AdminLayout from './components/admin/AdminLayout';
import BulkUpload from './components/admin/BulkUpload';
import ScoreUpload from './components/admin/ScoreUpload';
import TrainingModuleView from './components/admin/TrainingModuleView';
import VenueManagement from './components/admin/VenueManagement';
import Students from './pages/Students';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import ProtectedRoute from './components/student/ProtectedRoute';
import AdminStudentDashboard from './pages/AdminStudentDashboard';
import Leaderboard from './pages/staff/Leaderboard';
import AdminLeaderboard from './pages/AdminLeaderboard';
import StaffManagement from './components/admin/StaffManagement';
import StaffLogin from './pages/StaffLogin';
import StaffProtectedRoute from './routes/StaffProtectedRoute';
import StaffLayout from './components/staff/StaffLayout';
import StudentLayout from './components/student/StudentLayout';
import StaffDashboard from './pages/StaffDashboard';
import StaffAttendance from './pages/StaffAttendance';
import StaffStudents from './pages/StaffStudents';
import AttendanceHistory from './pages/staff/AttendanceHistory';
import AttendanceHistoryAdmin from './pages/admin/AttendanceHistory';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminSettings from './pages/admin/AdminSettings';

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
            <Route path="venues" element={<VenueManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="attendance-history" element={<AttendanceHistoryAdmin />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="settings" element={<AdminSettings />} />
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

          {/* Staff Routes */}
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route
            path="/staff"
            element={
              <StaffProtectedRoute>
                <StaffLayout>
                  <Outlet />
                </StaffLayout>
              </StaffProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/staff/attendance" replace />} />
            <Route path="attendance" element={<StaffAttendance />} />
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="students" element={<StaffStudents />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="attendance-history" element={<AttendanceHistory />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/student/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </SampleDataProvider>
    </Router>
  );
}

export default App;
