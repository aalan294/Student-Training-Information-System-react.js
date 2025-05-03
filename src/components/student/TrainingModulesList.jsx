import React, { useState } from 'react';
import styled from 'styled-components';
import { getStudentModuleDetails } from '../../services/api';
import ModuleDetailsModal from './ModuleDetailsModal';

const Container = styled.div`
  margin-top: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ModuleCard = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ModuleTitle = styled.h3`
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #2563eb;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.875rem;
`;

const TrainingModulesList = ({ modules }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleDetails, setModuleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleModuleClick = async (module) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudentModuleDetails(module._id);
      setModuleDetails(response.data.data);
      setSelectedModule(module);
    } catch (err) {
      console.error('Error fetching module details:', err);
      setError(err.response?.data?.message || 'Failed to load module details');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (module) => {
    if (!module.examScores || module.examScores.length === 0) return 0;
    const totalExams = module.examScores.length;
    const completedExams = module.examScores.filter(score => score.score !== null && score.score !== undefined).length;
    return (completedExams / totalExams) * 100;
  };

  return (
    <Container>
      <Title>Your Training Modules</Title>
      <ModulesGrid>
        {modules.map((module) => (
          <ModuleCard key={module._id} onClick={() => handleModuleClick(module)}>
            <ModuleTitle>{module.title}</ModuleTitle>
            <ProgressBar>
              <Progress percentage={calculateProgress(module)} />
            </ProgressBar>
            <Stats>
              <span>Average Score: {module.averageScore || 0}%</span>
              <span>Status: {module.isCompleted ? 'Completed' : 'In Progress'}</span>
            </Stats>
          </ModuleCard>
        ))}
      </ModulesGrid>

      {selectedModule && (
        <ModuleDetailsModal
          module={selectedModule}
          details={moduleDetails}
          onClose={() => {
            setSelectedModule(null);
            setModuleDetails(null);
          }}
          loading={loading}
          error={error}
        />
      )}
    </Container>
  );
};

export default TrainingModulesList; 