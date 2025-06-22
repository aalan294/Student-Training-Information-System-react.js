import React, { useEffect, useState } from 'react';
import { getVenueStudents, markAttendance } from '../services/api';
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
  gap: 1rem;
  align-items: center;
`;

const Checkbox = styled.input`
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
`;

const StatusLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
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
  const [students, setStudents] = useState([]);
  const [session, setSession] = useState('forenoon');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getVenueStudents();
        setStudents(res.data.students);
        // Initialize attendance data with all students present
        const initialData = {};
        res.data.students.forEach(student => {
          initialData[student._id] = { present: true, od: false };
        });
        setAttendanceData(initialData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const attendanceArray = Object.entries(attendanceData).map(([studentId, data]) => ({
        studentId,
        present: data.present,
        od: data.od
      }));

      await markAttendance(date, session, attendanceArray);
      toast.success(`${session.charAt(0).toUpperCase() + session.slice(1)} attendance marked successfully!`);
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
                  <Th>Status</Th>
                  <Th>Name</Th>
                  <Th>Reg No</Th>
                  <Th>Email</Th>
                  <Th>Batch</Th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <Td>
                      <CheckboxGroup>
                        <StatusLabel>
                          <Checkbox
                            type="checkbox"
                            checked={attendanceData[student._id]?.present && !attendanceData[student._id]?.od}
                            onChange={(e) => {
                              handleAttendanceChange(student._id, 'present', e.target.checked);
                              if (e.target.checked) {
                                handleAttendanceChange(student._id, 'od', false);
                              }
                            }}
                          />
                          Present
                        </StatusLabel>
                        <StatusLabel>
                          <Checkbox
                            type="checkbox"
                            checked={attendanceData[student._id]?.od}
                            onChange={(e) => {
                              handleAttendanceChange(student._id, 'od', e.target.checked);
                              if (e.target.checked) {
                                handleAttendanceChange(student._id, 'present', true);
                              }
                            }}
                          />
                          On Duty
                        </StatusLabel>
                      </CheckboxGroup>
                    </Td>
                    <Td>{student.name}</Td>
                    <Td>{student.regNo}</Td>
                    <Td>{student.email}</Td>
                    <Td>{student.batch}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : `Submit ${session.charAt(0).toUpperCase() + session.slice(1)} Attendance`}
            </Button>
          </form>
        )}
      </Card>
    </Container>
  );
};

export default StaffAttendance; 