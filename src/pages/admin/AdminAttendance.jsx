import React, { useEffect, useState, useMemo } from 'react';
import { getAllStudents, markAttendanceByAdmin, getExistingAttendance } from '../../services/api';
import { useSystemConfig } from '../../hooks/useSystemConfig';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaUserTie, FaSearch, FaSync } from 'react-icons/fa';

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

const AccordionButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 1rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1.5rem;
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

const ErrorMsg = styled.div`
  color: #dc2626;
  margin-bottom: 1rem;
`;

const StudentTable = ({ students, attendanceData, handleStatusChange, existingAttendance }) => (
  <Table>
    <thead>
      <tr>
        <Th>Attendance Status</Th>
        <Th>Name</Th>
        <Th>Reg No</Th>
        {students[0]?.venueName && <Th>Venue</Th>}
      </tr>
    </thead>
    <tbody>
      {students.map(student => (
        <tr key={student._id}>
          <Td>
            <select
              value={attendanceData[student._id]?.present ? (attendanceData[student._id]?.od ? 'On Duty' : 'Present') : 'Absent'}
              onChange={e => handleStatusChange(student._id, e.target.value)}
            >
              <option value="Present">Present</option>
              <option value="On Duty">On Duty</option>
              <option value="Absent">Absent</option>
            </select>
            {existingAttendance[student._id] && <span style={{ marginLeft: 8, color: '#888', fontSize: 12 }}>(Existing)</span>}
          </Td>
          <Td>{student.name}</Td>
          <Td>{student.regNo}</Td>
          {student.venueName && <Td>{student.venueName}</Td>}
        </tr>
      ))}
    </tbody>
  </Table>
);

const AdminAttendance = () => {
  const { config: systemConfig, loading: configLoading } = useSystemConfig();
  const [allStudents, setAllStudents] = useState([]);
  const [groupedStudents, setGroupedStudents] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [session, setSession] = useState(systemConfig.defaultSession);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [existingAttendance, setExistingAttendance] = useState({});
  const [hasExistingData, setHasExistingData] = useState(false);
  const [expandedVenue, setExpandedVenue] = useState('');

  useEffect(() => {
    if (!configLoading && systemConfig.defaultSession) {
      setSession(systemConfig.defaultSession);
    }
  }, [configLoading, systemConfig.defaultSession]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const studentsRes = await getAllStudents();
        const students = studentsRes.data.students;
        setAllStudents(students);
        // Group students by venue
        const groups = {};
        students.forEach(student => {
          const venue = student.venues && student.venues.length > 0 ? student.venues[0] : { venueName: 'No Venue' };
          student.venueName = venue.venueName;
          if (!groups[venue.venueName]) groups[venue.venueName] = [];
          groups[venue.venueName].push(student);
        });
        setGroupedStudents(groups);
        // Initialize attendance data
        const initialData = {};
        students.forEach(student => {
          initialData[student._id] = { present: true, od: false };
        });
        try {
          const attendanceRes = await getExistingAttendance(date, session);
          const existingData = attendanceRes.data.attendanceData;
          setExistingAttendance(existingData);
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
          setHasExistingData(Object.keys(existingData).length > 0);
        } catch {
          setAttendanceData(initialData);
          setHasExistingData(false);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  // Filtered students for search
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.trim().toLowerCase();
    return allStudents.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.regNo.toLowerCase().includes(q)
    );
  }, [searchQuery, allStudents]);

  // Venue names
  const venueNames = Object.keys(groupedStudents);

  // Attendance submission logic: only for visible students (filtered or by venue)
  const getVisibleStudents = () => {
    if (filteredStudents) return filteredStudents;
    if (expandedVenue) return groupedStudents[expandedVenue] || [];
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const visibleStudents = getVisibleStudents();
      // Only include students who are explicitly marked as absent or on duty
      const attendanceArray = visibleStudents
        .map(student => {
          const currentData = attendanceData[student._id];
          if (currentData.present && !currentData.od) {
            return null; // Skip students who are present (default state)
          }
          return {
            studentId: student._id,
            venueId: student.venues && student.venues.length > 0 ? student.venues[0].venueId : null,
            present: currentData.present,
            od: currentData.od
          };
        })
        .filter(item => item !== null);
      const response = await markAttendanceByAdmin(date, session, attendanceArray);
      const emailCount = response.data?.summary?.emailsSent || 0;
      const defaultedCount = response.data?.summary?.defaultedToPresent || 0;
      let message = `${session.charAt(0).toUpperCase() + session.slice(1)} attendance updated successfully!`;
      if (emailCount > 0) {
        message += ` ${emailCount} absence email(s) sent.`;
      }
      if (defaultedCount > 0) {
        message += ` ${defaultedCount} student(s) defaulted to present.`;
      }
      toast.success(message);
      // Refresh existing attendance data after successful update
      try {
        const attendanceRes = await getExistingAttendance(date, session);
        const existingData = attendanceRes.data.attendanceData;
        setExistingAttendance(existingData);
        setAttendanceData(prev => {
          const updated = { ...prev };
          Object.keys(existingData).forEach(studentId => {
            if (updated[studentId]) {
              updated[studentId] = {
                present: existingData[studentId].present,
                od: existingData[studentId].od
              };
            }
          });
          return updated;
        });
        setHasExistingData(Object.keys(existingData).length > 0);
        toast.success('Existing attendance data loaded successfully!');
      } catch {
        toast.error('Failed to load existing attendance data');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Mark Attendance (Admin)</Title>
        <div style={{ background: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.9rem' }}>
            <strong>Note:</strong> All students are marked as present by default. Only mark students as absent or on duty if they are not present.
          </p>
        </div>
        {/* Date and Session Selectors */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <DateInput type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <SessionSelector>
            <SessionButton type="button" active={session === 'forenoon'} onClick={() => setSession('forenoon')}>Forenoon Session</SessionButton>
            <SessionButton type="button" active={session === 'afternoon'} onClick={() => setSession('afternoon')}>Afternoon Session</SessionButton>
          </SessionSelector>
        </div>
        {/* Global Search */}
        <SearchInput
          type="text"
          placeholder="Search by name or registration number..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {loading ? (
          <div>Loading students...</div>
        ) : error ? (
          <ErrorMsg>{error}</ErrorMsg>
        ) : allStudents.length === 0 ? (
          <div>No students found.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* If searching, show only matching students */}
            {filteredStudents ? (
              <StudentTable
                students={filteredStudents}
                attendanceData={attendanceData}
                handleStatusChange={handleStatusChange}
                existingAttendance={existingAttendance}
              />
            ) : (
              // Venue accordions
              venueNames.map(venue => (
                <div key={venue} style={{ marginBottom: 12 }}>
                  <AccordionButton
                    type="button"
                    onClick={() => setExpandedVenue(expandedVenue === venue ? '' : venue)}
                    style={{ background: expandedVenue === venue ? '#e0f2fe' : undefined }}
                  >
                    {venue}
                  </AccordionButton>
                  {expandedVenue === venue && (
                    <StudentTable
                      students={groupedStudents[venue]}
                      attendanceData={attendanceData}
                      handleStatusChange={handleStatusChange}
                      existingAttendance={existingAttendance}
                    />
                  )}
                </div>
              ))
            )}
            <button type="submit" disabled={submitting} style={{ marginTop: 24, padding: '0.75rem 2rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
              {submitting ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </form>
        )}
      </Card>
    </Container>
  );
};

export default AdminAttendance; 