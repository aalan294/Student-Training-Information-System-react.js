import React, { useEffect, useState, useMemo } from 'react';
import { getAllStudents, markAttendanceByAdmin, getExistingAttendance } from '../../services/api';
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

const RefreshButton = styled.button`
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const InfoText = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  border-left: 4px solid #3b82f6;
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
  const [existingAttendance, setExistingAttendance] = useState({});
  const [hasExistingData, setHasExistingData] = useState(false);
  const [modifiedStudents, setModifiedStudents] = useState(new Set());
  const [newlyAbsentStudents, setNewlyAbsentStudents] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const studentsRes = await getAllStudents();
        const students = studentsRes.data.students;
        setAllStudents(students);

        const groups = {};
        const initialData = {};
        students.forEach(student => {
          if (student.venues && student.venues.length > 0) {
            const venue = student.venues[0];
            if (!groups[venue.venueName]) {
              groups[venue.venueName] = [];
            }
            groups[venue.venueName].push(student);
          }
          initialData[student._id] = { present: true, od: false };
        });
        setGroupedStudents(groups);

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
        } catch (attendanceErr) {
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

  // Track modifications when attendance data changes
  useEffect(() => {
    const modified = new Set();
    const newlyAbsent = new Set();
    
    Object.keys(attendanceData).forEach(studentId => {
      const current = attendanceData[studentId];
      const existing = existingAttendance[studentId];
      
      if (existing) {
        // Check if current data differs from existing data
        if (current.present !== existing.present || current.od !== existing.od) {
          modified.add(studentId);
          
          // Check if student is newly absent (was present/OD before, now absent)
          const wasPresentOrOD = existing.present || existing.od;
          const isNowAbsent = !current.present && !current.od;
          const emailNotSent = !existing.emailSent;
          
          if (wasPresentOrOD && isNowAbsent && emailNotSent) {
            newlyAbsent.add(studentId);
          }
        }
      } else {
        // Check if current data differs from default (present: true, od: false)
        if (!current.present || current.od) {
          modified.add(studentId);
          
          // Check if student is newly absent (default was present, now absent)
          const isNowAbsent = !current.present && !current.od;
          if (isNowAbsent) {
            newlyAbsent.add(studentId);
          }
        }
      }
    });
    
    setModifiedStudents(modified);
    setNewlyAbsentStudents(newlyAbsent);
  }, [attendanceData, existingAttendance]);

  const refreshExistingAttendance = async () => {
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
    } catch (err) {
      toast.error('Failed to load existing attendance data');
    }
  };

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

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
      // Create attendance array for all students with venues
      const attendanceArray = allStudents
        .map(student => {
          const venue = student.venues && student.venues.length > 0 ? student.venues[0] : null;
          const currentData = attendanceData[student._id];
          
          // Only include students with venues
          if (!venue) return null;
          
          return {
            studentId: student._id,
            venueId: venue.venueId,
            present: currentData.present,
            od: currentData.od
          };
        })
        .filter(item => item !== null);

      if (attendanceArray.length === 0) {
        toast.error('No students with venues found to update attendance');
        return;
      }

      const response = await markAttendanceByAdmin(date, session, attendanceArray);
      const emailCount = response.data?.summary?.emailsSent || 0;
      
      if (emailCount > 0) {
        toast.success(`${session.charAt(0).toUpperCase() + session.slice(1)} attendance updated successfully! ${emailCount} absence email(s) sent.`);
      } else {
        toast.success(`${session.charAt(0).toUpperCase() + session.slice(1)} attendance updated successfully!`);
      }
      
      // Refresh existing attendance data after successful update
      await refreshExistingAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update attendance');
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

            {hasExistingData && (
              <InfoText>
                <strong>Existing attendance data found!</strong> You can modify individual student attendance records. 
                Students with existing data are pre-filled. You only need to update the records you want to change.
                {modifiedStudents.size > 0 && (
                  <span style={{ color: '#dc2626', fontWeight: '500' }}>
                    {' '}Modified: {modifiedStudents.size} student(s)
                  </span>
                )}
                {newlyAbsentStudents.size > 0 && (
                  <span style={{ color: '#dc2626', fontWeight: '500' }}>
                    {' '}• Newly absent: {newlyAbsentStudents.size} student(s) (will receive email)
                  </span>
                )}
                <RefreshButton 
                  type="button" 
                  onClick={refreshExistingAttendance}
                  style={{ marginLeft: '1rem' }}
                >
                  <FaSync /> Refresh Data
                </RefreshButton>
              </InfoText>
            )}

            {!hasExistingData && modifiedStudents.size > 0 && (
              <InfoText style={{ borderLeftColor: '#dc2626' }}>
                <strong>New attendance data will be created!</strong> 
                <span style={{ color: '#dc2626', fontWeight: '500' }}>
                  {' '}Modified: {modifiedStudents.size} student(s)
                </span>
                {newlyAbsentStudents.size > 0 && (
                  <span style={{ color: '#dc2626', fontWeight: '500' }}>
                    {' '}• Newly absent: {newlyAbsentStudents.size} student(s) (will receive email)
                  </span>
                )}
              </InfoText>
            )}
            
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
                      <Th style={{ minWidth: '150px' }}>Attendance Status</Th>
                      <Th>Name</Th>
                      <Th>Reg No</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGroupedStudents[venueName].map(student => {
                      const hasExisting = existingAttendance[student._id];
                      const isModified = modifiedStudents.has(student._id);
                      const isNewlyAbsent = newlyAbsentStudents.has(student._id);
                      const emailSent = hasExisting?.emailSent;
                      
                      return (
                        <tr key={student._id} style={{ 
                          backgroundColor: hasExisting ? '#f0f9ff' : 'transparent',
                          borderLeft: isModified ? '4px solid #dc2626' : 'none'
                        }}>
                          <Td>
                            <StatusDropdown
                              value={attendanceData[student._id]?.present ? 'Present' : attendanceData[student._id]?.od ? 'On Duty' : 'Absent'}
                              onChange={(e) => {
                                handleStatusChange(student._id, e.target.value);
                              }}
                            >
                              <option value="Present">Present</option>
                              <option value="On Duty">On Duty</option>
                              <option value="Absent">Absent</option>
                            </StatusDropdown>
                            {hasExisting && (
                              <span style={{ 
                                fontSize: '0.75rem', 
                                color: '#6b7280', 
                                marginLeft: '0.5rem' 
                              }}>
                                (Existing)
                              </span>
                            )}
                            {isModified && (
                              <span style={{ 
                                fontSize: '0.75rem', 
                                color: '#dc2626', 
                                marginLeft: '0.5rem',
                                fontWeight: '500'
                              }}>
                                (Modified)
                              </span>
                            )}
                            {isNewlyAbsent && (
                              <span style={{ 
                                fontSize: '0.75rem', 
                                color: '#dc2626', 
                                marginLeft: '0.5rem',
                                fontWeight: '500'
                              }}>
                                (Email will be sent)
                              </span>
                            )}
                            {emailSent && (
                              <span style={{ 
                                fontSize: '0.75rem', 
                                color: '#059669', 
                                marginLeft: '0.5rem',
                                fontWeight: '500'
                              }}>
                                (Email sent)
                              </span>
                            )}
                          </Td>
                          <Td>{student.name}</Td>
                          <Td>{student.regNo}</Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            ))}
            
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Updating...' : 
                `Update ${session.charAt(0).toUpperCase() + session.slice(1)} Attendance` +
                (modifiedStudents.size > 0 ? ` (${modifiedStudents.size} modified)` : '') +
                (newlyAbsentStudents.size > 0 ? ` • ${newlyAbsentStudents.size} emails` : '')
              }
            </Button>
          </form>
        )}
      </Card>
    </Container>
  );
};

export default AdminAttendance; 