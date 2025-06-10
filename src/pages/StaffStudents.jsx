import React, { useEffect, useState } from 'react';
import { getVenueStudents } from '../services/api';
import styled from 'styled-components';
import { FaUserGraduate } from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem;
`;
const Card = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;
const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #22c55e;
  margin-bottom: 2rem;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  font-weight: 600;
`;
const Td = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
`;
const ErrorMsg = styled.div`
  color: #dc2626;
  margin-bottom: 1rem;
`;

const StaffStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getVenueStudents();
        setStudents(res.data.students);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <Container>
      <Card>
        <Title>Students in Your Venue</Title>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <ErrorMsg>{error}</ErrorMsg>
        ) : students.length === 0 ? (
          <div>No students assigned to your venue.</div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Reg No</Th>
                <Th>Email</Th>
                <Th>Batch</Th>
                <Th>Department</Th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <Td>{student.name}</Td>
                  <Td>{student.regNo}</Td>
                  <Td>{student.email}</Td>
                  <Td>{student.batch}</Td>
                  <Td>{student.department}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
};

export default StaffStudents; 