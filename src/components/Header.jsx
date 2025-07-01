import React from 'react';
import styled from 'styled-components';
import srmLogo from '../assets/srmlogo.jpg';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 72px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding-left: 4rem; // Make room for the mobile menu button
  }
`;

const Logo = styled.img`
  height: 45px;
  width: auto;
  margin-right: 1.5rem;
  object-fit: contain;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MainTitle = styled.h1`
  color: #22577A;
  font-size: 1.3rem;
  margin: 0;
  font-weight: 600;
  white-space: nowrap;
`;

const SubTitle = styled.h2`
  color: #38A3A5;
  font-size: 1rem;
  margin: 0.2rem 0 0 0;
  font-weight: 500;
  white-space: nowrap;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo src={srmLogo} alt="SRM Logo" />
      <TitleContainer>
        <MainTitle>SRM Ramapuram</MainTitle>
        <SubTitle>Placement Training Dashboard</SubTitle>
      </TitleContainer>
    </HeaderContainer>
  );
};

export default Header; 