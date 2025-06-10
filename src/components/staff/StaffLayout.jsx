import React from 'react';
import styled from 'styled-components';
import StaffSidebar from './StaffSidebar';

const Main = styled.div`
  margin-left: 250px;
  padding: 2rem 2rem 2rem 2rem;
  min-height: 100vh;
  background: #f9fafb;
`;

const StaffLayout = ({ children }) => {
  return (
    <>
      <StaffSidebar />
      <Main>{children}</Main>
    </>
  );
};

export default StaffLayout; 