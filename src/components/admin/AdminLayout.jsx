import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTachometerAlt, FaUserGraduate, FaChalkboardTeacher, FaClipboardList, FaUpload, FaTrophy, FaBuilding, FaUsersCog, FaHistory, FaSignOutAlt, FaCheckSquare, FaCog } from 'react-icons/fa';
import Header from '../Header';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #181f2a;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: fixed;
  top: 72px; // Height of the header
  left: 0;
  height: calc(100vh - 72px);
  z-index: 999;
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
  overflow-y: auto;

  @media (max-width: 768px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 250px;
  padding: 1rem 2rem;
  background: linear-gradient(120deg, #f9fafb 60%, #e0e7ff 100%);
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
  margin-top: 72px; // Height of the header
  min-height: calc(100vh - 72px);

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: 1rem;
  }
`;

const MenuButton = styled.button`
  position: fixed;
  top: 1.2rem;
  left: 1rem;
  z-index: 1001;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  display: none;
  align-items: center;
  justify-content: center;
  color: #374151;
  
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

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  padding-top: 1rem;
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
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Students', href: '/admin/students', icon: <FaUserGraduate /> },
    { name: 'Training', href: '/admin/training', icon: <FaChalkboardTeacher /> },
    { name: 'Attendance', href: '/admin/attendance', icon: <FaClipboardList /> },
    { name: 'Score Upload', href: '/admin/scores', icon: <FaUpload /> },
    { name: 'Bulk Upload', href: '/admin/bulk-upload', icon: <FaUpload /> },
    { name: 'Leaderboard', href: '/admin/leaderboard', icon: <FaTrophy /> },
    { name: 'Venues', href: '/admin/venues', icon: <FaBuilding /> },
    { name: 'Staff', href: '/admin/staff', icon: <FaUsersCog /> },
    { name: 'Attendance History', href: '/admin/attendance-history', icon: <FaHistory /> },
    { name: 'Settings', href: '/admin/settings', icon: <FaCog /> }
  ];

  return (
    <LayoutContainer>
      <Header />
      <ContentWrapper>
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
              <MenuItem key={item.name}>
                <MenuLink
                  to={item.href}
                  active={location.pathname === item.href ? 1 : 0}
                  onClick={handleLinkClick}
                >
                  {item.icon}
                  {item.name}
                </MenuLink>
              </MenuItem>
            ))}
            <MenuItem>
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt />
                Logout
              </LogoutButton>
            </MenuItem>
          </MenuList>
        </Sidebar>

        <MainContent>
          {children}
        </MainContent>
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default AdminLayout;
