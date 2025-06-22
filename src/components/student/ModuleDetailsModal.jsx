import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;

  &:hover {
    color: #1a1a1a;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  color: #1a1a1a;
  font-weight: 500;
`;

const ScoreValue = styled.span`
  color: ${props => {
    if (props.score === null) return '#6b7280';
    if (props.score >= 80) return '#166534';
    if (props.score >= 60) return '#92400e';
    return '#991b1b';
  }};
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  text-align: center;
  padding: 2rem;
`;

const AttendanceList = styled.div`
  margin-top: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
`;

const AttendanceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;

  &:last-child {
    border-bottom: none;
  }
`;

const AttendanceDate = styled.span`
  color: #374151;
  font-weight: 500;
`;

const AttendanceSessions = styled.div`
  display: flex;
  gap: 1rem;
`;

const SessionStatus = styled.span`
  color: ${props => {
    if (props.status === 'OD') return '#d97706';
    if (props.status === 'Present') return '#059669';
    if (props.status === 'Absent') return '#dc2626';
    return '#6b7280';
  }};
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: ${props => {
    if (props.status === 'OD') return '#fef3c7';
    if (props.status === 'Present') return '#dcfce7';
    if (props.status === 'Absent') return '#fee2e2';
    return '#f3f4f6';
  }};
`;

const SessionLabel = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const ModuleDetailsModal = ({ module, details, onClose, loading, error }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <ModalOverlay>
        <ModalContent>
          <LoadingMessage>Loading module details...</LoadingMessage>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (error) {
    return (
      <ModalOverlay>
        <ModalContent>
          <ErrorMessage>{error}</ErrorMessage>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (!details) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <Title>{module.title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <Section>
          <SectionTitle>Module Overview</SectionTitle>
          <Grid>
            <StatCard>
              <StatLabel>Duration</StatLabel>
              <StatValue>{details.module.durationDays} days</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Total Exams</StatLabel>
              <StatValue>{details.module.examsCount}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Average Score</StatLabel>
              <StatValue>
                <ScoreValue score={details.performance.averageScore}>
                  {details.performance.averageScore || 0}%
                </ScoreValue>
              </StatValue>
            </StatCard>
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Attendance</SectionTitle>
          <Grid>
            <StatCard>
              <StatLabel>Attendance Rate</StatLabel>
              <StatValue>{details.performance.attendance.percentage}%</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Present Sessions</StatLabel>
              <StatValue>
                {details.performance.attendance.presentSessions} / {details.performance.attendance.totalSessions}
              </StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>On Duty Sessions</StatLabel>
              <StatValue>
                {details.performance.attendance.odSessions}
              </StatValue>
            </StatCard>
          </Grid>
          <AttendanceList>
            {details.performance.attendance.details?.map((record, index) => (
              <AttendanceItem key={index}>
                <AttendanceDate>{formatDate(record.date)}</AttendanceDate>
                <AttendanceSessions>
                  {record.forenoon && (
                    <div>
                      <SessionLabel>AM</SessionLabel>
                      <SessionStatus status={record.forenoon.status}>
                        {record.forenoon.status}
                      </SessionStatus>
                    </div>
                  )}
                  {record.afternoon && (
                    <div>
                      <SessionLabel>PM</SessionLabel>
                      <SessionStatus status={record.afternoon.status}>
                        {record.afternoon.status}
                      </SessionStatus>
                    </div>
                  )}
                </AttendanceSessions>
              </AttendanceItem>
            ))}
          </AttendanceList>
        </Section>

        <Section>
          <SectionTitle>Exam Scores</SectionTitle>
          <Grid>
            {details.performance.examScores?.map((exam, index) => (
              <StatCard key={index}>
                <StatLabel>Exam {exam.exam}</StatLabel>
                <StatValue>
                  <ScoreValue score={exam.score}>
                    {exam.score}%
                  </ScoreValue>
                </StatValue>
              </StatCard>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Last Updated</SectionTitle>
          <StatCard>
            <StatValue>{formatDate(details.performance.lastUpdated)}</StatValue>
          </StatCard>
        </Section>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModuleDetailsModal; 