import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllStudents, getStudentDetails } from '../services/api';
import CreateModuleModal from '../components/admin/CreateModuleModal';
import StudentDetailsModal from '../components/admin/StudentDetailsModal';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUserGraduate, FaBuilding, FaUsersCog, FaTrophy } from 'react-icons/fa';

const batchTypes = ['Marquee', 'Super Dream', 'Dream', 'Service', 'General'];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const TotalStatsCard = styled.div`
  background: linear-gradient(to bottom right, #3b82f6, #2563eb);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const BatchStatsCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 200ms ease-in-out;
  
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-0.25rem);
  }
`;

const StatsLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.isTotal ? '#e0e7ff' : '#4b5563'};
  margin-bottom: 0.5rem;
`;

const StatsValue = styled.p`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${props => props.isTotal ? 'white' : '#111827'};
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const TableTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

const StudentCount = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: #eff6ff;
  color: #1e40af;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
`;

const TableBody = styled.tbody`
  background-color: white;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 150ms ease-in-out;
  cursor: pointer;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  color: ${props => props.isName ? '#111827' : '#4b5563'};
  font-weight: ${props => props.isName ? '500' : 'normal'};
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const AdminDashboard = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [counts, setCounts] = useState({});
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModuleModalOpen, setIsCreateModuleModalOpen] = useState(false);
  const [isStudentDetailsModalOpen, setIsStudentDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [passoutYears, setPassoutYears] = useState([]);
  const [selectedPassoutYear, setSelectedPassoutYear] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllStudents();
  }, []);

  useEffect(() => {
    if (allStudents.length > 0) {
      const uniqueYears = [...new Set(allStudents.map(s => s.passoutYear))].sort((a, b) => b - a);
      setPassoutYears(uniqueYears);
      if (uniqueYears.length > 0 && !selectedPassoutYear) {
        setSelectedPassoutYear(uniqueYears[0]);
      }
    }
  }, [allStudents]);

  useEffect(() => {
    if (selectedPassoutYear) {
      updateCountsAndStudents();
    }
  }, [selectedPassoutYear]);

  const fetchAllStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllStudents();
      setAllStudents(response.data.students);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCountsAndStudents = () => {
    const yearFilteredStudents = allStudents.filter(s => s.passoutYear == selectedPassoutYear);
    const totalStudents = yearFilteredStudents.length;
    const batchCounts = batchTypes.reduce((acc, batch) => {
      acc[batch] = yearFilteredStudents.filter(s => s.batch === batch).length;
      return acc;
    }, {});
    setCounts({ total: totalStudents, ...batchCounts });

    if (selectedBatch) {
      const batchFilteredStudents = yearFilteredStudents.filter(s => s.batch === selectedBatch);
      setStudents(batchFilteredStudents);
    } else {
      setStudents([]);
    }
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedPassoutYear(year);
    setSelectedBatch(null); // Reset batch selection when year changes
    setStudents([]); // Clear student list
  };
  
  const fetchStudentsByBatch = (batch) => {
    setSelectedBatch(batch);
    const filteredStudents = allStudents.filter(s => s.passoutYear == selectedPassoutYear && s.batch === batch);
    setStudents(filteredStudents);
  };

  const handleCreateModule = () => {
    setIsCreateModuleModalOpen(true);
  };

  const handleStudentClick = (studentId) => {
    navigate(`/admin/students/${studentId}/dashboard`);
  };

  if (error) {
    return (
      <Container>
        <Card>
          <Title>Error</Title>
          <div style={{ color: '#dc2626', textAlign: 'center' }}>{error}</div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Header>
          <Title>Admin Dashboard</Title>
          {passoutYears.length > 0 && (
            <FilterGroup>
              <label htmlFor="year-select">Batch Year:</label>
              <Select id="year-select" value={selectedPassoutYear} onChange={handleYearChange}>
                {passoutYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Select>
            </FilterGroup>
          )}
        </Header>
      </Card>

      <StatsGrid>
        <TotalStatsCard>
          <StatsLabel isTotal>
            <FaTachometerAlt size={20} style={{ marginRight: '0.5rem' }} />
            Total Students
          </StatsLabel>
          <StatsValue isTotal>
            {isLoading ? 'Loading...' : counts.total || 0}
          </StatsValue>
        </TotalStatsCard>
        {batchTypes.map(batch => (
          <BatchStatsCard key={batch} onClick={() => fetchStudentsByBatch(batch)}>
            <StatsLabel>
              <FaUserGraduate size={20} style={{ marginRight: '0.5rem' }} />
              {batch}
            </StatsLabel>
            <StatsValue>
              {isLoading ? 'Loading...' : counts[batch] || 0}
            </StatsValue>
          </BatchStatsCard>
        ))}
      </StatsGrid>
      
      {selectedBatch && (
        <Card>
          <TableHeader>
            <TableTitle>{selectedBatch} Students ({selectedPassoutYear})</TableTitle>
            <StudentCount>{students.length} students</StudentCount>
            <ActionButton 
              onClick={handleCreateModule} 
              disabled={!selectedBatch || students.length === 0}
            >
              Create Module for this Batch
            </ActionButton>
          </TableHeader>
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Reg. No</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Passout Year</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="4" style={{ textAlign: 'center' }}>
                      {isLoading ? 'Loading...' : 'No students found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow 
                      key={student._id} 
                      onClick={() => handleStudentClick(student._id)}
                    >
                      <TableCell isName>{student.name}</TableCell>
                      <TableCell>{student.regNo}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.passoutYear}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <CreateModuleModal
        isOpen={isCreateModuleModalOpen}
        onClose={() => setIsCreateModuleModalOpen(false)}
        studentIds={students.map(student => student._id)}
        batchName={selectedBatch}
      />

      {isStudentDetailsModalOpen && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => {
            setIsStudentDetailsModalOpen(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </Container>
  );
};

export default AdminDashboard;
