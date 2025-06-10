import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
`;

const Th = styled.th`
  background: #2563eb;
  color: #fff;
  font-weight: 700;
  padding: 16px 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1.08rem;
`;

const Td = styled.td`
  padding: 14px 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 15px;
  background: ${({ zebra }) => zebra ? '#f8fafc' : '#fff'};
  transition: background 0.2s;
`;

const Tr = styled.tr`
  &:hover td {
    background: #e0e7ff;
  }
`;

const AttendancePercentage = styled.span`
  color: ${({ percentage }) => {
    if (percentage >= 90) return '#1e7e34';
    if (percentage >= 75) return '#f57c00';
    return '#d32f2f';
  }};
  font-weight: 600;
`;

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/staff/venue-leaderboard');
      setLeaderboard(response.data.leaderboard);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leaderboard');
      toast.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <Container>
      <Title>Venue Leaderboard</Title>
      <Table>
        <thead>
          <tr>
            <Th>Rank</Th>
            <Th>Name</Th>
            <Th>Reg No</Th>
            <Th>Batch</Th>
            <Th>Department</Th>
            <Th>Average Score</Th>
            <Th>Attendance</Th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, idx) => (
            <Tr key={entry.student._id}>
              <Td zebra={idx % 2 === 1}>{idx + 1}</Td>
              <Td zebra={idx % 2 === 1}>{entry.student.name}</Td>
              <Td zebra={idx % 2 === 1}>{entry.student.regNo}</Td>
              <Td zebra={idx % 2 === 1}>{entry.student.batch}</Td>
              <Td zebra={idx % 2 === 1}>{entry.student.department}</Td>
              <Td zebra={idx % 2 === 1}>{entry.averageScore.toFixed(1)}%</Td>
              <Td zebra={idx % 2 === 1}>
                {entry.attendance.present}/{entry.attendance.total} days{' '}
                <AttendancePercentage percentage={entry.attendance.percentage}>
                  ({entry.attendance.percentage}%)
                </AttendancePercentage>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Leaderboard; 