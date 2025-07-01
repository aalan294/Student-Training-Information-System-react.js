import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStudentProfile } from '../services/api';
import StudentAvatar from '../components/student/StudentAvatar';
import ProgressSummary from '../components/student/ProgressSummary';
import TrainingModulesList from '../components/student/TrainingModulesList';
import Header from '../components/Header';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 72px auto 0; // Add top margin to account for fixed header
  position: relative;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const WelcomeSection = styled.div`
  flex: 1;
`;

const WelcomeText = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SubText = styled.p`
  color: #666;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Map completed trainings to 4 levels
const getLevelFromCompleted = (numCompleted) => {
  if (numCompleted >= 12) return 4;
  if (numCompleted >= 8) return 3;
  if (numCompleted >= 4) return 2;
  return 1;
};

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const studentData = JSON.parse(localStorage.getItem('studentData'));
      if (!studentData?._id) {
        throw new Error('Student data not found. Please login again.');
      }
      const profileResponse = await getStudentProfile();
      const { student, progress } = profileResponse.data;
      setStudentData(student);
      // Map progress to modules for dashboard
      setModules(progress.map(p => ({
        _id: p.training._id,
        title: p.training.title,
        isCompleted: p.training.isCompleted,
        examScores: p.examScores || [],
        attendance: p.attendance || [],
        averageScore: p.averageScore ?? 0
      })));
      setError(null);
    } catch (err) {
      if (err.message === 'Student data not found. Please login again.') {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        window.location.href = '/student/login';
      } else {
        setError(err.response?.data?.message || 'Failed to load student data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageScore = (modules) => {
    if (!modules.length) return 0;
    const totalScore = modules.reduce((sum, module) => sum + module.averageScore, 0);
    return (totalScore / modules.length).toFixed(1);
  };

  const calculateAttendancePercentage = (modules) => {
    if (!modules.length) return 0;
    const totalAttendance = modules.reduce((sum, module) => {
      const attended = module.attendance.filter(a => a.present).length;
      const total = module.attendance.length;
      return sum + (total ? (attended / total) * 100 : 0);
    }, 0);
    return (totalAttendance / modules.length).toFixed(1);
  };

  if (loading) {
    return (
      <PageContainer>
        <Header />
        <Container>Loading...</Container>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Header />
        <Container>{error}</Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header />
      <Container>
        <DashboardHeader>
          <WelcomeSection>
            <WelcomeText>Welcome, {studentData?.name}!</WelcomeText>
            <SubText>Track your training progress and performance</SubText>
          </WelcomeSection>
          <StudentAvatar student={studentData} size="large" />
        </DashboardHeader>

        <ProgressSummary
          completedModules={modules.filter(m => m.isCompleted).length}
          totalModules={modules.length}
          averageScore={calculateAverageScore(modules)}
          attendancePercentage={calculateAttendancePercentage(modules)}
          level={getLevelFromCompleted(modules.filter(m => m.isCompleted).length)}
        />

        <TrainingModulesList modules={modules} />
      </Container>
    </PageContainer>
  );
};

export default StudentDashboard; 