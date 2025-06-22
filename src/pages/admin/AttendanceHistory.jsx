import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { FaCheckCircle, FaTimesCircle, FaUserTie } from 'react-icons/fa';
import AttendanceVisualization from '../../components/admin/AttendanceVisualization';

const Container = styled.div`
  display: flex;
  height: calc(100vh - 100px);
  gap: 0;
`;

const Sidebar = styled.div`
  width: 300px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
  padding: 0;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
`;

const SidebarTitle = styled.h3`
  margin: 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
`;

const VenueList = styled.div`
  padding: 0;
`;

const VenueItem = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.2s;
  background: ${props => props.selected ? '#dbeafe' : '#fff'};
  border-left: 3px solid ${props => props.selected ? '#3b82f6' : 'transparent'};

  &:hover {
    background: ${props => props.selected ? '#dbeafe' : '#f1f5f9'};
  }
`;

const VenueName = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 5px;
`;

const VenueStats = styled.div`
  display: flex;
  gap: 10px;
  font-size: 12px;
`;

const Count = styled.div`
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ type }) => {
    if (type === 'present') return '#dcfce7';
    if (type === 'absent') return '#fee2e2';
    if (type === 'od') return '#fef3c7';
    return '#f3f4f6';
  }};
  color: ${({ type }) => {
    if (type === 'present') return '#166534';
    if (type === 'absent') return '#dc2626';
    if (type === 'od') return '#d97706';
    return '#374151';
  }};
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

const DayList = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
`;

const DayItem = styled.button`
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: ${props => props.selected ? '#3b82f6' : '#fff'};
  color: ${props => props.selected ? 'white' : '#374151'};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-size: 14px;

  &:hover {
    background: ${props => props.selected ? '#2563eb' : '#f1f5f9'};
  }
`;

const SessionTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 20px;
  background: #f3f4f6;
  padding: 0.5rem;
  border-radius: 0.5rem;
  width: fit-content;
`;

const SessionTab = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;
  background-color: ${props => props.active ? '#3b82f6' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6b7280'};

  &:hover {
    background-color: ${props => props.active ? '#2563eb' : '#e5e7eb'};
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const Stat = styled.div`
  background: ${({ type }) => {
    if (type === 'present') return '#dcfce7';
    if (type === 'absent') return '#fee2e2';
    if (type === 'od') return '#fef3c7';
    return '#f3f4f6';
  }};
  color: ${({ type }) => {
    if (type === 'present') return '#166534';
    if (type === 'absent') return '#dc2626';
    if (type === 'od') return '#d97706';
    return '#374151';
  }};
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StudentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
`;

const StudentCard = styled.div`
  background: ${({ status }) => {
    if (status === 'present') return '#dcfce7';
    if (status === 'absent') return '#fee2e2';
    if (status === 'od') return '#fef3c7';
    return '#f3f4f6';
  }};
  border: 1px solid ${({ status }) => {
    if (status === 'present') return '#bbf7d0';
    if (status === 'absent') return '#fecaca';
    if (status === 'od') return '#fed7aa';
    return '#e5e7eb';
  }};
  border-radius: 8px;
  padding: 15px;
`;

const StudentName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
  color: #1e293b;
`;

const StudentDetails = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${({ status }) => {
    if (status === 'present') return '#166534';
    if (status === 'absent') return '#dc2626';
    if (status === 'od') return '#d97706';
    return '#374151';
  }};
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

const AttendanceHistoryAdmin = () => {
  const [venueAttendance, setVenueAttendance] = useState([]);
  const [selectedVenueIdx, setSelectedVenueIdx] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSession, setSelectedSession] = useState('forenoon');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/attendance-history');
      setVenueAttendance(response.data.venueAttendance);
      setSelectedVenueIdx(0);
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
  if (!venueAttendance.length) return <Error>No attendance history found.</Error>;

  const selectedVenue = venueAttendance[selectedVenueIdx];
  const selectedDay = selectedVenue?.attendanceHistory[selectedDayIdx];
  const sessionData = selectedDay?.[selectedSession];

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>Venues</SidebarTitle>
        </SidebarHeader>
        <VenueList>
          {venueAttendance.map((venue, idx) => (
            <VenueItem
              key={venue.venue.id}
              selected={idx === selectedVenueIdx}
              onClick={() => {
                setSelectedVenueIdx(idx);
                setSelectedDayIdx(0);
              }}
            >
              <VenueName>{venue.venue.name}</VenueName>
              <VenueStats>
                <Count type="present">
                  <FaCheckCircle />
                  {venue.attendanceHistory.reduce((sum, day) => 
                    sum + (day.forenoon?.present?.length || 0) + (day.afternoon?.present?.length || 0), 0
                  )}
                </Count>
                <Count type="absent">
                  <FaTimesCircle />
                  {venue.attendanceHistory.reduce((sum, day) => 
                    sum + (day.forenoon?.absent?.length || 0) + (day.afternoon?.absent?.length || 0), 0
                  )}
                </Count>
                <Count type="od">
                  <FaUserTie />
                  {venue.attendanceHistory.reduce((sum, day) => 
                    sum + (day.forenoon?.od?.length || 0) + (day.afternoon?.od?.length || 0), 0
                  )}
                </Count>
              </VenueStats>
            </VenueItem>
          ))}
        </VenueList>
      </Sidebar>

      <DetailsPanel>
        <Title>
          {selectedVenue?.venue.name} - {selectedDay ? new Date(selectedDay.date).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          }) : 'Select a day'}
        </Title>

        {selectedVenue && (
          <>
            <DayList>
              {selectedVenue.attendanceHistory.map((day, idx) => (
                <DayItem
                  key={day.date}
                  selected={idx === selectedDayIdx}
                  onClick={() => setSelectedDayIdx(idx)}
                >
                  {new Date(day.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </DayItem>
              ))}
            </DayList>

            {selectedDay && (
              <>
                <SessionTabs>
                  <SessionTab
                    active={selectedSession === 'forenoon'}
                    onClick={() => setSelectedSession('forenoon')}
                  >
                    Forenoon Session
                  </SessionTab>
                  <SessionTab
                    active={selectedSession === 'afternoon'}
                    onClick={() => setSelectedSession('afternoon')}
                  >
                    Afternoon Session
                  </SessionTab>
                </SessionTabs>

                {sessionData && (
                  <>
                    <Stats>
                      <Stat type="present">
                        <FaCheckCircle />
                        Present: {sessionData.present.length}
                      </Stat>
                      <Stat type="absent">
                        <FaTimesCircle />
                        Absent: {sessionData.absent.length}
                      </Stat>
                      <Stat type="od">
                        <FaUserTie />
                        On Duty: {sessionData.od.length}
                      </Stat>
                    </Stats>

                    <StudentList>
                      {sessionData.present.map(student => (
                        <StudentCard key={student.id} status="present">
                          <StatusIcon status="present">
                            <FaCheckCircle />
                            Present
                          </StatusIcon>
                          <StudentName>{student.name}</StudentName>
                          <StudentDetails>
                            {student.regNo} • {student.batch} • {student.department}
                          </StudentDetails>
                        </StudentCard>
                      ))}
                      {sessionData.absent.map(student => (
                        <StudentCard key={student.id} status="absent">
                          <StatusIcon status="absent">
                            <FaTimesCircle />
                            Absent
                          </StatusIcon>
                          <StudentName>{student.name}</StudentName>
                          <StudentDetails>
                            {student.regNo} • {student.batch} • {student.department}
                          </StudentDetails>
                        </StudentCard>
                      ))}
                      {sessionData.od.map(student => (
                        <StudentCard key={student.id} status="od">
                          <StatusIcon status="od">
                            <FaUserTie />
                            On Duty
                          </StatusIcon>
                          <StudentName>{student.name}</StudentName>
                          <StudentDetails>
                            {student.regNo} • {student.batch} • {student.department}
                          </StudentDetails>
                        </StudentCard>
                      ))}
                    </StudentList>

                    <AttendanceVisualization sessionData={sessionData} />

                  </>
                )}
              </>
            )}
          </>
        )}
      </DetailsPanel>
    </Container>
  );
};

export default AttendanceHistoryAdmin; 