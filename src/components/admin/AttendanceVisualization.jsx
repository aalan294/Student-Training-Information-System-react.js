import React, { useMemo } from 'react';
import styled from 'styled-components';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const VisualizationContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2.5rem;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const Th = styled.th`
  background-color: #f9fafb;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;

  &.total {
    font-weight: 700;
    background-color: #fefce8;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 2fr;
  }
`;

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const AttendanceVisualization = ({ sessionData }) => {
  const departmentData = useMemo(() => {
    if (!sessionData) return { summary: [], totals: {} };

    const allStudents = [
      ...sessionData.present,
      ...sessionData.absent,
      ...sessionData.od,
    ];
    
    if (allStudents.length === 0) return { summary: [], totals: {} };

    const departments = [...new Set(allStudents.map(s => s.department || 'Unknown'))];
    
    const summary = departments.map(dept => {
      const totalStudents = allStudents.filter(s => (s.department || 'Unknown') === dept).length;
      const presentCount = sessionData.present.filter(s => (s.department || 'Unknown') === dept).length;
      const absentCount = sessionData.absent.filter(s => (s.department || 'Unknown') === dept).length;
      const odCount = sessionData.od.filter(s => (s.department || 'Unknown') === dept).length;
      const percentage = totalStudents > 0 ? ((presentCount / (totalStudents - odCount)) * 100).toFixed(2) : '0.00';
      
      return {
        name: dept,
        total: totalStudents,
        present: presentCount,
        absent: absentCount,
        od: odCount,
        percentage: isNaN(percentage) ? '0.00' : percentage,
      };
    });

    const totals = {
      total: summary.reduce((acc, curr) => acc + curr.total, 0),
      present: summary.reduce((acc, curr) => acc + curr.present, 0),
      absent: summary.reduce((acc, curr) => acc + curr.absent, 0),
      od: summary.reduce((acc, curr) => acc + curr.od, 0),
    };
    
    const totalPercentage = totals.total > 0 ? ((totals.present / (totals.total - totals.od)) * 100).toFixed(2) : '0.00';
    totals.percentage = isNaN(totalPercentage) ? '0.00' : totalPercentage;

    return { summary, totals };
  }, [sessionData]);

  if (!sessionData || departmentData.summary.length === 0) {
    return null;
  }

  return (
    <VisualizationContainer>
      <SectionTitle>Department-wise Attendance Summary</SectionTitle>
      
      <Table>
        <thead>
          <tr>
            <Th>S.No</Th>
            <Th>Department</Th>
            <Th>Total Students</Th>
            <Th>Present</Th>
            <Th>Absent</Th>
            <Th>On Duty (OD)</Th>
            <Th>Percentage (%)</Th>
          </tr>
        </thead>
        <tbody>
          {departmentData.summary.map((dept, index) => (
            <tr key={dept.name}>
              <Td>{index + 1}</Td>
              <Td>{dept.name}</Td>
              <Td>{dept.total}</Td>
              <Td>{dept.present}</Td>
              <Td>{dept.absent}</Td>
              <Td>{dept.od}</Td>
              <Td>{dept.percentage}</Td>
            </tr>
          ))}
          <tr>
            <Td colSpan="2" className="total">Total</Td>
            <Td className="total">{departmentData.totals.total}</Td>
            <Td className="total">{departmentData.totals.present}</Td>
            <Td className="total">{departmentData.totals.absent}</Td>
            <Td className="total">{departmentData.totals.od}</Td>
            <Td className="total">{departmentData.totals.percentage}</Td>
          </tr>
        </tbody>
      </Table>
      
      <ChartsGrid>
        <div>
          <SectionTitle>Students by Department</SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData.summary}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
              >
                {departmentData.summary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <SectionTitle>Attendance Status by Department</SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={departmentData.summary}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" stackId="a" fill="#22c55e" />
              <Bar dataKey="absent" stackId="a" fill="#ef4444" />
              <Bar dataKey="od" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartsGrid>

    </VisualizationContainer>
  );
};

export default AttendanceVisualization; 