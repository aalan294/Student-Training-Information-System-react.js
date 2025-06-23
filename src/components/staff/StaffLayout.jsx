import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCalendarCheck, FaUsers, FaTrophy, FaHistory, FaSignOutAlt } from 'react-icons/fa';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background-color: #f9fafb;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #181f2a;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
  overflow-y: auto;
  padding: 20px;

  @media (max-width: 768px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
  padding: 2rem;
  background: linear-gradient(120deg, #f9fafb 60%, #e0e7ff 100%);
  font-family: 'Inter', 'Roboto', Arial, sans-serif;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const MenuButton = styled.button`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 1001;
  background: white;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  display: none;
  align-items: center;
  justify-content: center;
  color: #374151;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    color: #2563eb;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MenuIcon = styled.div`
  width: 20px;
  height: 16px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;
  
  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: currentColor;
    border-radius: 2px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
    
    &:nth-child(1) {
      top: ${props => props.isOpen ? '7px' : '0px'};
      transform: ${props => props.isOpen ? 'rotate(135deg)' : 'rotate(0)'};
    }
    
    &:nth-child(2) {
      top: 7px;
      opacity: ${props => props.isOpen ? '0' : '1'};
      transform: ${props => props.isOpen ? 'translateX(-20px)' : 'translateX(0)'};
    }
    
    &:nth-child(3) {
      top: ${props => props.isOpen ? '7px' : '14px'};
      transform: ${props => props.isOpen ? 'rotate(-135deg)' : 'rotate(0)'};
    }
  }
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #fff;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const SidebarItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #b0b8c9;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px 0;
  font-size: 1.08rem;
  svg {
    margin-right: 14px;
    font-size: 1.2em;
  }
  &:hover {
    background: #232b3e;
    color: #fff;
  }
  &.active {
    background: #2563eb;
    color: #fff;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #dc2626;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-top: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-family: inherit;
  width: 100%;
  text-align: left;
  svg {
    margin-right: 14px;
    font-size: 1.2em;
  }
  &:hover {
    background: #fee2e2;
  }
`;

const StaffLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffData');
    navigate('/staff/login');
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <LayoutContainer>
      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon isOpen={isOpen}>
          <span></span>
          <span></span>
          <span></span>
        </MenuIcon>
      </MenuButton>

      <Sidebar isOpen={isOpen}>
        <Logo>Staff Portal</Logo>
        <Nav>
          <SidebarItem to="/staff/attendance" onClick={handleLinkClick}>
            <FaCalendarCheck />
            Mark Attendance
          </SidebarItem>
          <SidebarItem to="/staff/students" onClick={handleLinkClick}>
            <FaUsers />
            Students
          </SidebarItem>
          <SidebarItem to="/staff/leaderboard" onClick={handleLinkClick}>
            <FaTrophy />
            Leaderboard
          </SidebarItem>
          <SidebarItem to="/staff/attendance-history" onClick={handleLinkClick}>
            <FaHistory />
            Attendance History
          </SidebarItem>
        </Nav>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </LogoutButton>
      </Sidebar>

      <MainContent isOpen={isOpen}>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default StaffLayout; 