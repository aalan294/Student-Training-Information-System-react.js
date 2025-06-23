import React, { useEffect, useState, useMemo } from 'react';
import { getAllStudents, markAttendanceByAdmin } from '../../services/api';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaUserTie, FaSearch } from 'react-icons/fa';

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

const SearchContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 400px;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #fff;

  svg {
    color: #9ca3af;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
`;

const VenueHeader = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
`;

const AdminAttendance = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [groupedStudents, setGroupedStudents] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
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
        const res = await getAllStudents();
        const students = res.data.students;
        setAllStudents(students);

        // Group students by venue
        const groups = {};
        const initialData = {};
        students.forEach(student => {
          if (student.venues && student.venues.length > 0) {
            const venue = student.venues[0]; // Assuming one venue per student for now
            if (!groups[venue.venueName]) {
              groups[venue.venueName] = [];
            }
            groups[venue.venueName].push(student);
          }
          initialData[student._id] = { present: true, od: false };
        });
        setGroupedStudents(groups);
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
      const attendanceArray = allStudents.map(student => {
        const venue = student.venues && student.venues.length > 0 ? student.venues[0] : null;
        return {
          studentId: student._id,
          venueId: venue ? venue.venueId : null,
          ...attendanceData[student._id]
        };
      }).filter(item => item.venueId); // Ensure we only send data for students with a venue

      await markAttendanceByAdmin(date, session, attendanceArray);
      toast.success(`${session.charAt(0).toUpperCase() + session.slice(1)} attendance marked successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredGroupedStudents = useMemo(() => {
    if (!searchQuery) {
      return groupedStudents;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = {};
    Object.keys(groupedStudents).forEach(venueName => {
      const students = groupedStudents[venueName].filter(
        student =>
          student.name.toLowerCase().includes(lowerCaseQuery) ||
          student.regNo.toLowerCase().includes(lowerCaseQuery)
      );
      if (students.length > 0) {
        filtered[venueName] = students;
      }
    });
    return filtered;
  }, [searchQuery, groupedStudents]);

  const getStats = () => {
    const studentIdsToConsider = Object.values(filteredGroupedStudents).flat().map(s => s._id);
    const relevantAttendance = Object.fromEntries(
        Object.entries(attendanceData).filter(([studentId]) => studentIdsToConsider.includes(studentId))
    );
    const present = Object.values(relevantAttendance).filter(d => d.present && !d.od).length;
    const absent = Object.values(relevantAttendance).filter(d => !d.present && !d.od).length;
    const od = Object.values(relevantAttendance).filter(d => d.od).length;
    return { present, absent, od, total: studentIdsToConsider.length };
  };

  const stats = getStats();

  return (
    <Container>
      <Card>
        <Title>Mark Attendance (Admin)</Title>
        
        {loading ? (
          <div>Loading students...</div>
        ) : error ? (
          <ErrorMsg>{error}</ErrorMsg>
        ) : allStudents.length === 0 ? (
          <div>No students found.</div>
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
            
            <SearchContainer>
              <FaSearch />
              <SearchInput 
                type="text"
                placeholder="Search by name or registration number..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </SearchContainer>

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
              <Stat>
                Total: {stats.total}
              </Stat>
            </Stats>

            {Object.keys(filteredGroupedStudents).sort().map(venueName => (
              <div key={venueName}>
                <VenueHeader>{venueName}</VenueHeader>
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
                    {filteredGroupedStudents[venueName].map(student => (
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
              </div>
            ))}
            
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : `Submit ${session.charAt(0).toUpperCase() + session.slice(1)} Attendance`}
            </Button>
          </form>
        )}
      </Card>
    </Container>
  );
};

export default AdminAttendance; 