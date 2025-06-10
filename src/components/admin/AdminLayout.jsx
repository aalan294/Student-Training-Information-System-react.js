import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTachometerAlt, FaUserGraduate, FaChalkboardTeacher, FaClipboardList, FaUpload, FaTrophy, FaBuilding, FaUsersCog, FaHistory, FaSignOutAlt } from 'react-icons/fa';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background-color: #f9fafb;
`;

const Sidebar = styled.div`
  width: ${props => props.isOpen ? '250px' : '0'};
  background-color: #181f2a;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  overflow: hidden;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${props => props.isOpen ? '250px' : '0'};
  transition: margin-left 0.3s ease;
  padding: 2rem;
  background: linear-gradient(120deg, #f9fafb 60%, #e0e7ff 100%);
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
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
  display: flex;
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
      transform: ${props => props.isOpen ? 'translateX(20px)' : 'translateX(0)'};
    }
    
    &:nth-child(3) {
      top: ${props => props.isOpen ? '7px' : '14px'};
      transform: ${props => props.isOpen ? 'rotate(-135deg)' : 'rotate(0)'};
    }
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 4rem;
`;

const MenuItem = styled.li`
  padding: 0.5rem 1rem;
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: ${props => props.active ? '#fff' : '#b0b8c9'};
  text-decoration: none;
  border-radius: 0.375rem;
  font-weight: ${props => props.active ? '600' : 'normal'};
  background-color: ${props => props.active ? '#2563eb' : 'transparent'};
  transition: all 0.2s ease;
  font-size: 1.08rem;
  margin-bottom: 0.25rem;
  svg {
    margin-right: 14px;
    font-size: 1.2em;
  }
  &:hover {
    background-color: #232b3e;
    color: #fff;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #dc2626;
  text-decoration: none;
  border-radius: 0.375rem;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 2rem;
  font-family: inherit;
  svg {
    margin-right: 14px;
    font-size: 1.2em;
  }
  &:hover {
    background-color: #fee2e2;
  }
`;

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Students', href: '/admin/students', icon: <FaUserGraduate /> },
    { name: 'Training', href: '/admin/training', icon: <FaChalkboardTeacher /> },
    { name: 'Scores', href: '/admin/scores', icon: <FaClipboardList /> },
    { name: 'Bulk Upload', href: '/admin/bulk-upload', icon: <FaUpload /> },
    { name: 'Leaderboard', href: '/admin/leaderboard', icon: <FaTrophy /> },
    { name: 'Venues', href: '/admin/venues', icon: <FaBuilding /> },
    { name: 'Staff', href: '/admin/staff', icon: <FaUsersCog /> },
    { name: 'Attendance History', href: '/admin/attendance-history', icon: <FaHistory /> },
  ];

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
        <MenuList>
          {navigation.map((item) => (
            <MenuItem key={item.href}>
              <MenuLink
                to={item.href}
                active={location.pathname === item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.icon && <span style={{marginRight: 10}}>{item.icon}</span>}
                {item.name}
              </MenuLink>
            </MenuItem>
          ))}
          <MenuItem>
            <LogoutButton onClick={handleLogout}>
                Logout
            </LogoutButton>
          </MenuItem>
        </MenuList>
      </Sidebar>

      <MainContent isOpen={isOpen}>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout;
