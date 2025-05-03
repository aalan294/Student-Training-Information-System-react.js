import React from 'react';
import styled from 'styled-components';

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const CardSubtext = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const PlacementTag = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.category) {
      case 'Marquee': return '#fef3c7';
      case 'Super Dream': return '#dbeafe';
      case 'Dream': return '#e0e7ff';
      case 'Service': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.category) {
      case 'Marquee': return '#92400e';
      case 'Super Dream': return '#1e40af';
      case 'Dream': return '#3730a3';
      case 'Service': return '#374151';
      default: return '#374151';
    }
  }};
`;

const ProgressSummary = ({
  totalModules,
  completedModules,
  averageScore,
  attendancePercentage,
  placementCategory
}) => {
  return (
    <SummaryContainer>
      <SummaryCard>
        <CardTitle>Training Progress</CardTitle>
        <CardValue>{completedModules}/{totalModules}</CardValue>
        <CardSubtext>Modules Completed</CardSubtext>
      </SummaryCard>

      <SummaryCard>
        <CardTitle>Average Score</CardTitle>
        <CardValue>{averageScore}%</CardValue>
        <CardSubtext>Across All Modules</CardSubtext>
      </SummaryCard>

      <SummaryCard>
        <CardTitle>Attendance</CardTitle>
        <CardValue>{attendancePercentage}%</CardValue>
        <CardSubtext>Overall Attendance Rate</CardSubtext>
      </SummaryCard>

      <SummaryCard>
        <CardTitle>Placement Category</CardTitle>
        <CardValue>
          <PlacementTag category={placementCategory}>
            {placementCategory || 'Not Assigned'}
          </PlacementTag>
        </CardValue>
        <CardSubtext>Current Status</CardSubtext>
      </SummaryCard>
    </SummaryContainer>
  );
};

export default ProgressSummary; 