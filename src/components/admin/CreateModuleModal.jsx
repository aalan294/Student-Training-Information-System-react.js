import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { addModule, getAllVenues } from '../../services/api';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 32rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
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

const Input = styled.input`
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const TextArea = styled.textarea`
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-height: 6rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;

  ${props => props.variant === 'secondary' ? `
    background-color: white;
    border: 1px solid #d1d5db;
    color: #374151;

    &:hover {
      background-color: #f3f4f6;
    }
  ` : `
    background-color: #2563eb;
    border: none;
    color: white;

    &:hover {
      background-color: #1d4ed8;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `}
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const VenueSelectRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const VenueTag = styled.span`
  background: #6366f1;
  color: #fff;
  border-radius: 12px;
  padding: 0.25rem 0.75rem;
  margin-right: 0.5rem;
  font-size: 0.85em;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;
const RemoveTag = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  margin-left: 0.25rem;
`;
const AddVenueButton = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 0.5rem;
`;
const VenueDropdown = styled.select`
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  font-size: 0.95em;
`;
const VenueSummary = styled.div`
  margin-top: 0.5rem;
  font-size: 0.95em;
  color: #374151;
`;

const CreateModuleModal = ({ isOpen, onClose, studentIds, batchName }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationDays: '',
    examsCount: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [venues, setVenues] = useState([]);
  const [assignedVenues, setAssignedVenues] = useState([]);
  const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);
  const [venueToAdd, setVenueToAdd] = useState('');
  const [venueStudentMap, setVenueStudentMap] = useState({});
  const [dropdownRef, setDropdownRef] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchVenues();
      setAssignedVenues([]);
      setVenueToAdd('');
      setVenueDropdownOpen(false);
      setError('');
      setFormData({ title: '', description: '', durationDays: '', examsCount: '' });
    }
  }, [isOpen]);

  useEffect(() => {
    // Map students to venues by capacity whenever assignedVenues or studentIds changes
    if (assignedVenues.length > 0 && studentIds.length > 0) {
      let map = {};
      let idx = 0;
      assignedVenues.forEach(venue => {
        const cap = parseInt(venue.capacity);
        map[venue._id] = studentIds.slice(idx, idx + cap);
        idx += cap;
      });
      setVenueStudentMap(map);
    } else {
      setVenueStudentMap({});
    }
  }, [assignedVenues, studentIds]);

  useEffect(() => {
    if (venueDropdownOpen && dropdownRef) {
      dropdownRef.focus();
    }
  }, [venueDropdownOpen, dropdownRef]);

  const fetchVenues = async () => {
    try {
      const res = await getAllVenues();
      setVenues(res.data.venues.filter(v => v.status === 'assigned'));
    } catch (err) {
      setVenues([]);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVenue = () => {
    if (!venueToAdd) return;
    const venueObj = venues.find(v => v._id === venueToAdd);
    if (venueObj && !assignedVenues.some(v => v._id === venueObj._id)) {
      setAssignedVenues(prev => [...prev, venueObj]);
    }
    setVenueToAdd('');
    setTimeout(() => setVenueDropdownOpen(true), 0); // keep open for next selection
  };

  const handleRemoveVenue = (venueId) => {
    setAssignedVenues(prev => prev.filter(v => v._id !== venueId));
  };

  const handleDropdownChange = (e) => {
    setVenueToAdd(e.target.value);
    setTimeout(handleAddVenue, 100); // add after select
  };

  const allFieldsFilled =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.durationDays &&
    formData.examsCount &&
    assignedVenues.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const moduleData = {
        ...formData,
        durationDays: parseInt(formData.durationDays),
        examsCount: parseInt(formData.examsCount),
        venueStudentMap
      };
      await addModule(moduleData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create training module');
    } finally {
      setIsLoading(false);
    }
  };

  // Venue summary for preview
  const venueSummary = assignedVenues.map((venue, i) => (
    <VenueSummary key={venue._id}>
      <b>{venue.name}</b> (Capacity: {venue.capacity}): {venueStudentMap[venue._id]?.length || 0} students
    </VenueSummary>
  ));
  const totalAssigned = Object.values(venueStudentMap).reduce((acc, arr) => acc + (arr?.length || 0), 0);
  const unassignedCount = studentIds.length - totalAssigned;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>Create Training Module for {batchName}</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Module Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="durationDays">Duration (days)</Label>
            <Input
              id="durationDays"
              name="durationDays"
              type="number"
              min="1"
              value={formData.durationDays}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="examsCount">Number of Exams</Label>
            <Input
              id="examsCount"
              name="examsCount"
              type="number"
              min="1"
              value={formData.examsCount}
              onChange={handleChange}
              required
            />
          </FormGroup>

          {/* Venues Field */}
          <FormGroup>
            <Label>Venues</Label>
            <VenueSelectRow>
              {assignedVenues.map(venue => (
                <VenueTag key={venue._id}>
                  {venue.name}
                  <RemoveTag type="button" onClick={() => handleRemoveVenue(venue._id)} title="Remove">&times;</RemoveTag>
                </VenueTag>
              ))}
              <AddVenueButton type="button" title="Add Venue" onClick={() => setVenueDropdownOpen(true)}>+</AddVenueButton>
              {venueDropdownOpen && (
                <VenueDropdown
                  ref={el => setDropdownRef(el)}
                  value={venueToAdd}
                  onChange={handleDropdownChange}
                  autoFocus
                >
                  <option value="">Select Venue</option>
                  {venues.filter(v => !assignedVenues.some(av => av._id === v._id)).map(venue => (
                    <option key={venue._id} value={venue._id}>{venue.name} (Capacity: {venue.capacity})</option>
                  ))}
                </VenueDropdown>
              )}
            </VenueSelectRow>
            {venueSummary}
            {unassignedCount > 0 && (
              <VenueSummary style={{ color: '#dc2626' }}>
                {unassignedCount} students will not be assigned to any venue (not enough capacity).
              </VenueSummary>
            )}
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !allFieldsFilled}>
              {isLoading ? 'Creating...' : 'Create Module'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateModuleModal; 