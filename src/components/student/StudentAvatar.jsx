import React from 'react';
import styled, { keyframes } from 'styled-components';

const growAnimation = keyframes`
  0% { transform: scale(0.8); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const AvatarContainer = styled.div`
  width: 150px;
  height: 150px;
  position: relative;
  animation: ${growAnimation} 0.5s ease-out;
`;

const AvatarImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #4a5568;
  border: 4px solid ${props => {
    switch (props.level) {
      case 1: return '#48bb78'; // Green for beginner
      case 2: return '#4299e1'; // Blue for intermediate
      case 3: return '#9f7aea'; // Purple for advanced
      case 4: return '#f6ad55'; // Orange for expert
      default: return '#48bb78';
    }
  }};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LevelBadge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${props => {
    switch (props.level) {
      case 1: return '#48bb78';
      case 2: return '#4299e1';
      case 3: return '#9f7aea';
      case 4: return '#f6ad55';
      default: return '#48bb78';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressText = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: #4a5568;
  font-size: 0.875rem;
`;

const StudentAvatar = ({ level = 1, completedModules }) => {
  const getAvatarEmoji = (level) => {
    switch (level) {
      case 1: return '👶';
      case 2: return '🧒';
      case 3: return '🧑';
      case 4: return '👨‍🎓';
      default: return '👶';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      case 4: return 'Expert';
      default: return 'Beginner';
    }
  };

  return (
    <div>
      <AvatarContainer>
        <AvatarImage level={level}>
          {getAvatarEmoji(level)}
        </AvatarImage>
        <LevelBadge level={level}>
          Level {level}
        </LevelBadge>
      </AvatarContainer>
      <ProgressText>
        {getLevelText(level)} • {completedModules} modules completed
      </ProgressText>
    </div>
  );
};

export default StudentAvatar; 