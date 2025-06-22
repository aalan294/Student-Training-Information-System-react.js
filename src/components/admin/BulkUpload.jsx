import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  bulkRegisterStudents, 
  registerStudent,
  bulkRegisterStudentsWithDetails
} from '../../services/api';

const Container = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  max-width: 48rem;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #111827;
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid #d1d5db;
  margin-bottom: 2rem;
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background-color: transparent;
  color: ${props => props.active ? '#2563eb' : '#6b7280'};
  border-bottom: 2px solid ${props => props.active ? '#2563eb' : 'transparent'};
  cursor: pointer;
  transition: all 150ms;
  
  &:hover {
    color: #111827;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px dashed #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const FileName = styled.span`
  font-size: 0.875rem;
  color: #374151;
`;

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #059669;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const batchTypes = ['Marquee', 'Super Dream', 'Dream', 'Service', 'General'];
const departmentOptions = ['CSE', 'IT', 'MECH', 'EEE', 'ECE', 'BIOTECH', 'CIVIL'];

const BulkUpload = () => {
  const [activeTab, setActiveTab] = useState('with-details');

  return (
    <Container>
      <Title>Student Registration</Title>
      <TabBar>
        <TabButton active={activeTab === 'with-details'} onClick={() => setActiveTab('with-details')}>
          Bulk with Details
        </TabButton>
        <TabButton active={activeTab === 'without-details'} onClick={() => setActiveTab('without-details')}>
          Bulk without Details
        </TabButton>
        <TabButton active={activeTab === 'individual'} onClick={() => setActiveTab('individual')}>
          Individual Entry
        </TabButton>
      </TabBar>

      {activeTab === 'with-details' && <BulkWithDetailsForm />}
      {activeTab === 'without-details' && <BulkWithoutDetailsForm />}
      {activeTab === 'individual' && <IndividualForm />}
    </Container>
  );
};

// New Component for Bulk Upload WITH details in Excel
const BulkWithDetailsForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload only Excel files (.xlsx or .xls)');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setError('Please select an Excel file');
      return;
    }

    try {
      setIsLoading(true);
      const res = await bulkRegisterStudentsWithDetails(selectedFile);
      setSuccess(res.message);
      setSelectedFile(null);
      const fileInput = document.getElementById('excel-file-with-details');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register students');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <p>Upload an Excel file with columns: <strong>name, regNo, email, department, batch, passoutYear</strong>.</p>
      <FormGroup>
        <Label htmlFor="excel-file-with-details">Upload Excel File</Label>
        <FileInputLabel>
          <svg /* icon */ xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
          <FileName>{selectedFile ? selectedFile.name : 'Choose file'}</FileName>
          <FileInput id="excel-file-with-details" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        </FileInputLabel>
      </FormGroup>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      <Button type="submit" disabled={isLoading || !selectedFile}>
        {isLoading ? 'Uploading...' : 'Upload Students'}
      </Button>
    </Form>
  );
};

// Existing Bulk Upload Logic (without details in Excel)
const BulkWithoutDetailsForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [batch, setBatch] = useState('');
  const [passoutYear, setPassoutYear] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload only Excel files (.xlsx or .xls)');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!selectedFile) { setError('Please select an Excel file'); return; }
    if (!batch) { setError('Please select a batch'); return; }
    if (!passoutYear) { setError('Please enter passout year'); return; }
    if (!department) { setError('Please select a department'); return; }

    try {
      setIsLoading(true);
      await bulkRegisterStudents(selectedFile, batch, passoutYear, department);
      setSuccess('Students registered successfully');
      setSelectedFile(null); setBatch(''); setPassoutYear(''); setDepartment('');
      const fileInput = document.getElementById('excel-file-no-details');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register students');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <p>Upload an Excel file with columns: <strong>name, regNo, email</strong>. Department and batch details will be applied to all students from the dropdowns below.</p>
      <FormGroup>
        <Label htmlFor="excel-file-no-details">Upload Excel File</Label>
        <FileInputLabel>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
          <FileName>{selectedFile ? selectedFile.name : 'Choose file'}</FileName>
          <FileInput id="excel-file-no-details" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        </FileInputLabel>
      </FormGroup>

      <FormGrid>
        <FormGroup>
          <Label htmlFor="batch-select">Batch</Label>
          <Select id="batch-select" value={batch} onChange={(e) => setBatch(e.target.value)}>
            <option value="">Select Batch</option>
            {batchTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="department-select">Department</Label>
          <Select id="department-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Select Department</option>
            {departmentOptions.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="passoutYear">Passout Year</Label>
          <Input id="passoutYear" type="number" placeholder="e.g., 2025" value={passoutYear} onChange={(e) => setPassoutYear(e.target.value)} />
        </FormGroup>
      </FormGrid>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Button type="submit" disabled={isLoading || !selectedFile || !batch || !passoutYear || !department}>
        {isLoading ? 'Uploading...' : 'Upload Students'}
      </Button>
    </Form>
  );
};

// Existing Individual Form Logic
const IndividualForm = () => {
  const [individualForm, setIndividualForm] = useState({ name: '', regNo: '', email: '', batch: '', passoutYear: '', department: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleIndividualInputChange = (e) => {
    const { name, value } = e.target;
    setIndividualForm(prev => ({ ...prev, [name]: value }));
  };

  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (Object.values(individualForm).some(field => !field)) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setIsLoading(true);
      await registerStudent(individualForm);
      setSuccess('Student registered successfully');
      setIndividualForm({ name: '', regNo: '', email: '', batch: '', passoutYear: '', department: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register student');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleIndividualSubmit}>
      <FormGrid>
        <FormGroup>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" value={individualForm.name} onChange={handleIndividualInputChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="regNo">Register Number</Label>
          <Input id="regNo" name="regNo" value={individualForm.regNo} onChange={handleIndividualInputChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={individualForm.email} onChange={handleIndividualInputChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="batch">Batch</Label>
          <Select id="batch" name="batch" value={individualForm.batch} onChange={handleIndividualInputChange}>
            <option value="">Select Batch</option>
            {batchTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="passoutYear-individual">Passout Year</Label>
          <Input id="passoutYear-individual" name="passoutYear" type="number" value={individualForm.passoutYear} onChange={handleIndividualInputChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="department">Department</Label>
          <Select id="department" name="department" value={individualForm.department} onChange={handleIndividualInputChange}>
            <option value="">Select Department</option>
            {departmentOptions.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </Select>
        </FormGroup>
      </FormGrid>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      <Button type="submit" disabled={isLoading}>{isLoading ? 'Registering...' : 'Register Student'}</Button>
    </Form>
  );
};

export default BulkUpload;