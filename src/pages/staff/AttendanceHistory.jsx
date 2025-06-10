import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  height: 80vh;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const DaysPanel = styled.div`
  width: 320px;
  background: #fff;
  border-right: 1px solid #eee;
  overflow-y: auto;
  padding: 24px 0 24px 0;
  display: flex;
  flex-direction: column;
`;

const DayItem = styled.div`
  padding: 16px 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ selected }) => (selected ? '#e0f2fe' : 'transparent')};
  border-left: 4px solid ${({ selected }) => (selected ? '#1a73e8' : 'transparent')};
  transition: background 0.2s, border 0.2s;
  &:hover {
    background: #f1f5f9;
  }
`;

const DayDate = styled.div`
  font-weight: 500;
  color: #222;
`;

const DayCounts = styled.div`
  display: flex;
  gap: 10px;
`;

const Count = styled.div`
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ type }) => (type === 'present' ? '#e6f4ea' : '#fce8e6')};
  color: ${({ type }) => (type === 'present' ? '#1e7e34' : '#d32f2f')};
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
`;

const DetailsPanel = styled.div`
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const Stat = styled.div`
  background: ${({ type }) => (type === 'present' ? '#e6f4ea' : '#fce8e6')};
  color: ${({ type }) => (type === 'present' ? '#1e7e34' : '#d32f2f')};
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
`;

const StudentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
`;

const StudentCard = styled.div`
  background: ${({ present }) => (present ? '#e6f4ea' : '#fce8e6')};
  border: 1px solid ${({ present }) => (present ? '#1e7e34' : '#d32f2f')};
  border-radius: 6px;
  padding: 15px;
`;

const StudentName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const StudentDetails = styled.div`
  font-size: 14px;
  color: #666;
`;

const Loading = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const Error = styled.div`
  color: #d32f2f;
  text-align: center;
  padding: 20px;
`;

const AttendanceHistory = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/staff/attendance-history');
      setAttendanceHistory(response.data.attendanceHistory);
      setSelectedDayIdx(0);
      setError(null);
    } catch (err) {
      setError('Failed to fetch attendance history');
      toast.error('Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading>Loading attendance history...</Loading>;
  if (error) return <Error>{error}</Error>;
  if (!attendanceHistory.length) return <Error>No attendance history found.</Error>;

  const selectedDay = attendanceHistory[selectedDayIdx];

  return (
    <Container>
      <DaysPanel>
        {attendanceHistory.map((day, idx) => (
          <DayItem
            key={day.date}
            selected={idx === selectedDayIdx}
            onClick={() => setSelectedDayIdx(idx)}
          >
            <DayDate>{new Date(day.date).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: '2-digit', weekday: 'short'
            })}</DayDate>
            <DayCounts>
              <Count type="present"><FaCheckCircle /> {day.present.length}</Count>
              <Count type="absent"><FaTimesCircle /> {day.absent.length}</Count>
            </DayCounts>
          </DayItem>
        ))}
      </DaysPanel>
      <DetailsPanel>
        <Title>
          {selectedDay ? new Date(selectedDay.date).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          }) : 'Select a day'}
        </Title>
        {selectedDay && (
          <>
            <Stats>
              <Stat type="present">Present: {selectedDay.present.length}</Stat>
              <Stat type="absent">Absent: {selectedDay.absent.length}</Stat>
            </Stats>
            <StudentList>
              {selectedDay.present.map(student => (
                <StudentCard key={student.id} present>
                  <StudentName>{student.name}</StudentName>
                  <StudentDetails>
                    {student.regNo} • {student.batch} • {student.department}
                  </StudentDetails>
                </StudentCard>
              ))}
              {selectedDay.absent.map(student => (
                <StudentCard key={student.id}>
                  <StudentName>{student.name}</StudentName>
                  <StudentDetails>
                    {student.regNo} • {student.batch} • {student.department}
                  </StudentDetails>
                </StudentCard>
              ))}
            </StudentList>
          </>
        )}
      </DetailsPanel>
    </Container>
  );
};

export default AttendanceHistory; 