import React, { useEffect, useState } from 'react';
import { getVenueStudents, markAttendance } from '../services/api';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
const Button = styled.button`
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: 0.2s;
  &:hover {
    background: #16a34a;
  }
`;
const DateInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const StaffAttendance = () => {
  const [students, setStudents] = useState([]);
  const [presentIds, setPresentIds] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getVenueStudents();
        setStudents(res.data.students);
        setPresentIds(res.data.students.map(s => s._id)); // default: all present
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleCheckbox = (id) => {
    setPresentIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await markAttendance(date, presentIds);
      toast.success('Attendance marked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Mark Attendance</Title>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <ErrorMsg>{error}</ErrorMsg>
        ) : students.length === 0 ? (
          <div>No students assigned to your venue.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DateInput
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
            <Table>
              <thead>
                <tr>
                  <Th>Present</Th>
                  <Th>Name</Th>
                  <Th>Reg No</Th>
                  <Th>Email</Th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <Td>
                      <input
                        type="checkbox"
                        checked={presentIds.includes(student._id)}
                        onChange={() => handleCheckbox(student._id)}
                      />
                    </Td>
                    <Td>{student.name}</Td>
                    <Td>{student.regNo}</Td>
                    <Td>{student.email}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Attendance'}</Button>
          </form>
        )}
      </Card>
    </Container>
  );
};

export default StaffAttendance; 