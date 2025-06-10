import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaCalendarCheck, FaUsers, FaTrophy, FaHistory, FaSignOutAlt } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: 250px;
  background: #181f2a;
  padding: 20px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
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
  margin: 4px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-family: inherit;
  svg {
    margin-right: 14px;
    font-size: 1.2em;
  }
  &:hover {
    background: #fee2e2;
  }
`;

const StaffSidebar = () => {
  return (
    <SidebarContainer>
      <Logo>Staff Portal</Logo>
      <Nav>
        <SidebarItem to="/staff/attendance">
          <FaCalendarCheck />
          Mark Attendance
        </SidebarItem>
        <SidebarItem to="/staff/students">
          <FaUsers />
          Students
        </SidebarItem>
        <SidebarItem to="/staff/leaderboard">
          <FaTrophy />
          Leaderboard
        </SidebarItem>
        <SidebarItem to="/staff/attendance-history">
          <FaHistory />
          Attendance History
        </SidebarItem>
      </Nav>
      <LogoutButton onClick={() => {
        localStorage.removeItem('staffToken');
        localStorage.removeItem('staffData');
        window.location.href = '/staff/login';
      }}>
        <FaSignOutAlt />
        Logout
      </LogoutButton>
    </SidebarContainer>
  );
};

export default StaffSidebar; 