import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { registerVenue, getAllVenues, getAllStaff, assignStaffToVenue } from '../../services/api';
import { toast } from 'react-toastify';

const Container = styled.div`
  padding: 2rem;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 2rem;
`;
const VenueList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const VenueItem = styled.div`
  border: 2px solid ${p => p.selected ? '#6366f1' : '#e5e7eb'};
  background: ${p => p.selected ? '#eef2ff' : '#fff'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    border-color: #6366f1;
    background: #eef2ff;
  }
`;
const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;
const ToggleSwitch = styled.button`
  background: ${p => p.active ? '#6366f1' : '#e5e7eb'};
  color: ${p => p.active ? '#fff' : '#374151'};
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
`;
const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;
const ModalClose = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;
const Button = styled.button`
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #16a34a;
  }
  &:disabled {
    background: #a7f3d0;
    color: #374151;
    cursor: not-allowed;
  }
`;

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [newVenue, setNewVenue] = useState({ name: '', capacity: '' });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'assign' or 'details'
  const [venueFilter, setVenueFilter] = useState('unassigned');

  useEffect(() => {
    fetchVenues();
    fetchStaff();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await getAllVenues();
      setVenues(response.data.venues);
    } catch (error) {
      toast.error('Error fetching venues');
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await getAllStaff();
      setStaff(response.data.staff);
    } catch (error) {
      toast.error('Error fetching staff');
    }
  };

  const handleVenueSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerVenue(newVenue);
      toast.success('Venue registered successfully');
      setNewVenue({ name: '', capacity: '' });
      fetchVenues();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error registering venue');
    } finally {
      setLoading(false);
    }
  };

  const handleVenueClick = (venue) => {
    setSelectedVenue(venue);
    setSelectedStaff('');
    if (venue.status === 'unassigned') {
      setModalType('assign');
    } else {
      setModalType('details');
    }
    setShowModal(true);
  };

  const handleStaffAssignment = async () => {
    if (!selectedVenue || !selectedStaff) {
      toast.error('Please select both venue and staff');
      return;
    }
    setLoading(true);
    try {
      await assignStaffToVenue(selectedStaff, selectedVenue._id);
      toast.success('Staff assigned successfully');
      fetchVenues();
      fetchStaff();
      setShowModal(false);
      setSelectedStaff('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error assigning staff');
    } finally {
      setLoading(false);
    }
  };

  // Filter staff and venues
  const unassignedStaff = staff.filter(s => s.status === 'unassigned');
  const filteredVenues = venues.filter(v => v.status === venueFilter);

  return (
    <Container>
      <Grid>
        {/* Venue Registration Form */}
        <Card>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Register New Venue</h2>
          <form onSubmit={handleVenueSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Venue Name</label>
              <input
                type="text"
                value={newVenue.name}
                onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #e5e7eb', marginTop: 4 }}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Capacity</label>
              <input
                type="number"
                value={newVenue.capacity}
                onChange={(e) => setNewVenue({ ...newVenue, capacity: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #e5e7eb', marginTop: 4 }}
                required
              />
            </div>
            <Button type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Registering...' : 'Register Venue'}
            </Button>
          </form>
        </Card>

        {/* Venue List and Staff Assignment */}
        <Card>
          <ToggleRow>
            <ToggleSwitch
              active={venueFilter === 'unassigned'}
              onClick={() => setVenueFilter('unassigned')}
            >
              Unassigned
            </ToggleSwitch>
            <ToggleSwitch
              active={venueFilter === 'assigned'}
              onClick={() => setVenueFilter('assigned')}
            >
              Assigned
            </ToggleSwitch>
          </ToggleRow>
          <VenueList>
            {filteredVenues.map((venue) => (
              <VenueItem
                key={venue._id}
                selected={selectedVenue?._id === venue._id}
                onClick={() => handleVenueClick(venue)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontWeight: 600 }}>{venue.name}</h3>
                    <p style={{ fontSize: 14, color: '#6b7280' }}>Capacity: {venue.capacity}</p>
                    <p style={{ fontSize: 14, color: '#6b7280' }}>Status: {venue.status}</p>
                  </div>
                </div>
              </VenueItem>
            ))}
          </VenueList>
        </Card>
      </Grid>

      {/* Modal for Assigning Staff or Viewing Details */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
            <ModalClose onClick={() => setShowModal(false)}>&times;</ModalClose>
            {modalType === 'assign' && (
              <>
                <ModalTitle>Assign Staff to {selectedVenue?.name}</ModalTitle>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Select Staff</label>
                  <select
                    value={selectedStaff}
                    onChange={e => setSelectedStaff(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #e5e7eb', marginTop: 4 }}
                  >
                    <option value="">Select Staff</option>
                    {unassignedStaff.map(staffMember => (
                      <option key={staffMember.id} value={staffMember.id}>
                        {staffMember.name} ({staffMember.email})
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleStaffAssignment} disabled={loading || !selectedStaff} style={{ width: '100%' }}>
                  {loading ? 'Assigning...' : 'Assign Staff'}
                </Button>
              </>
            )}
            {modalType === 'details' && (
              <>
                <ModalTitle>Venue Details</ModalTitle>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Name:</strong> {selectedVenue?.name}<br />
                  <strong>Capacity:</strong> {selectedVenue?.capacity}<br />
                  <strong>Status:</strong> {selectedVenue?.status}<br />
                </div>
                {selectedVenue?.status === 'assigned' && (
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Assigned Staff</h4>
                    {staff.filter(s => s.venue && s.venue.id === selectedVenue._id).map(s => (
                      <div key={s.id} style={{ marginBottom: 8 }}>
                        <strong>{s.name}</strong> ({s.email})
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default VenueManagement; 