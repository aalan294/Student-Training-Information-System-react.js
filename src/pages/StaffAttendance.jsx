import React, { useEffect, useState } from 'react';
import { getVenueStudents, markAttendance, getExistingAttendance } from '../services/api';
import { useSystemConfig } from '../hooks/useSystemConfig';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaUserTie } from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #22c55e;
  margin-bottom: 2rem;
`;

const SessionSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: #f3f4f6;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

const SessionButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;
  background-color: ${props => props.active ? '#22c55e' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6b7280'};

  &:hover {
    background-color: ${props => props.active ? '#16a34a' : '#e5e7eb'};
  }
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  width: 200px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f3f4f6;
  font-weight: 600;
  color: #374151;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

const StatusDropdown = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  min-width: 100px;
  
  &:focus {
    outline: none;
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
`;

const StatusLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font-size: 0.8rem;
  color: #374151;
  white-space: nowrap;
`;

const Button = styled.button`
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  
  &:hover {
    background: #16a34a;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.div`
  color: #dc2626;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #fee2e2;
  border-radius: 0.5rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => {
    if (props.type === 'present') return '#dcfce7';
    if (props.type === 'absent') return '#fee2e2';
    if (props.type === 'od') return '#fef3c7';
    return '#f3f4f6';
  }};
  color: ${props => {
    if (props.type === 'present') return '#166534';
    if (props.type === 'absent') return '#dc2626';
    if (props.type === 'od') return '#d97706';
    return '#374151';
  }};
  border-radius: 0.375rem;
  font-weight: 500;
`;

const StaffAttendance = () => {
  const { config: systemConfig, loading: configLoading } = useSystemConfig();
  const [students, setStudents] = useState([]);
  const [session, setSession] = useState('forenoon');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [attendanceLocked, setAttendanceLocked] = useState(false);
  const [existingAttendance, setExistingAttendance] = useState({});

  useEffect(() => {
    if (!configLoading && systemConfig.defaultSession) {
      setSession(systemConfig.defaultSession);
    }
  }, [configLoading, systemConfig.defaultSession]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getVenueStudents();
        setStudents(res.data.students);
        // Initialize attendance data with all students present by default
        const initialData = {};
        res.data.students.forEach(student => {
          initialData[student._id] = { present: true, od: false };
        });
        setAttendanceData(initialData);
        // Fetch existing attendance for this date/session
        try {
          const attendanceRes = await getExistingAttendance(date, session);
          const existingData = attendanceRes.data.attendanceData;
          setExistingAttendance(existingData);
          if (Object.keys(existingData).length > 0) {
            setAttendanceLocked(true);
            // Pre-fill attendanceData with existing values
            const mergedData = { ...initialData };
            Object.keys(existingData).forEach(studentId => {
              if (mergedData[studentId]) {
                mergedData[studentId] = {
                  present: existingData[studentId].present,
                  od: existingData[studentId].od
                };
              }
            });
            setAttendanceData(mergedData);
          } else {
            setAttendanceLocked(false);
          }
        } catch {
          setAttendanceLocked(false);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
    // eslint-disable-next-line
  }, [date, session]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        present: status === 'Present' || status === 'On Duty',
        od: status === 'On Duty'
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Only include students who are explicitly marked as absent or on duty
      const attendanceArray = Object.entries(attendanceData)
        .map(([studentId, data]) => {
          if (data.present && !data.od) {
            return null; // Skip students who are present (default state)
          }
          return {
            studentId,
            present: data.present,
            od: data.od
          };
        })
        .filter(item => item !== null);
      await markAttendance(date, session, attendanceArray);
      toast.success('Attendance submitted successfully!');
      setAttendanceLocked(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const getStats = () => {
    const present = Object.values(attendanceData).filter(d => d.present && !d.od).length;
    const absent = Object.values(attendanceData).filter(d => !d.present && !d.od).length;
    const od = Object.values(attendanceData).filter(d => d.od).length;
    return { present, absent, od };
  };

  const stats = getStats();

  return (
    <Container>
      <Card>
        <Title>Mark Attendance</Title>
        {attendanceLocked && (
          <div style={{ color: '#888', marginBottom: 16 }}>
            Attendance editing is disabled after submission for this session/date.
          </div>
        )}
        <div style={{ 
          background: '#f0f9ff', 
          border: '1px solid #0ea5e9', 
          borderRadius: '0.5rem', 
          padding: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.9rem' }}>
            <strong>Note:</strong> All students are marked as present by default. Only mark students as absent or on duty if they are not present.
          </p>
        </div>
        
        {loading ? (
          <div>Loading students...</div>
        ) : error ? (
          <ErrorMsg>{error}</ErrorMsg>
        ) : students.length === 0 ? (
          <div>No students assigned to your venue.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <SessionSelector>
              <SessionButton
                type="button"
                active={session === 'forenoon'}
                onClick={() => setSession('forenoon')}
              >
                Forenoon Session
              </SessionButton>
              <SessionButton
                type="button"
                active={session === 'afternoon'}
                onClick={() => setSession('afternoon')}
              >
                Afternoon Session
              </SessionButton>
            </SessionSelector>

            <FormSection>
              <DateInput
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </FormSection>

            <Stats>
              <Stat type="present">
                <FaCheckCircle />
                Present: {stats.present}
              </Stat>
              <Stat type="absent">
                <FaTimesCircle />
                Absent: {stats.absent}
              </Stat>
              <Stat type="od">
                <FaUserTie />
                On Duty: {stats.od}
              </Stat>
            </Stats>

            <Table>
              <thead>
                <tr>
                  <Th style={{ minWidth: '150px' }}>Attendance Status</Th>
                  <Th>Name</Th>
                  <Th>Reg No</Th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <Td>
                      <select
                        value={attendanceData[student._id]?.present ? 'Present' : attendanceData[student._id]?.od ? 'On Duty' : 'Absent'}
                        onChange={e => handleStatusChange(student._id, e.target.value)}
                        disabled={attendanceLocked}
                        style={attendanceLocked ? { background: '#f3f4f6', color: '#888' } : {}}
                      >
                        <option value="Present">Present</option>
                        <option value="On Duty">On Duty</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </Td>
                    <Td>{student.name}</Td>
                    <Td>{student.regNo}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <Button type="submit" disabled={submitting || attendanceLocked}>
              {submitting ? 'Submitting...' : 'Submit Attendance'}
            </Button>
          </form>
        )}
      </Card>
    </Container>
  );
};

export default StaffAttendance;