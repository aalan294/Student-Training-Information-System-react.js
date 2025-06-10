import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllStaff, unassignStaffFromVenue } from '../../services/api';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaUserPlus } from 'react-icons/fa';

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
const StaffList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const StaffItem = styled.div`
  border: 2px solid ${p => p.selected ? '#22c55e' : '#e5e7eb'};
  background: ${p => p.selected ? '#bbf7d0' : '#fff'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    border-color: #22c55e;
    background: #bbf7d0;
  }
`;
const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;
const ToggleSwitch = styled.button`
  background: ${p => p.active ? '#22c55e' : '#e5e7eb'};
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
  position: relative;
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
const DangerButton = styled(Button)`
  background: #dc2626;
  &:hover { background: #b91c1c; }
`;

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [staffFilter, setStaffFilter] = useState('unassigned');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'details' or 'unassign'
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await getAllStaff();
      setStaff(response.data.staff);
    } catch (error) {
      toast.error('Error fetching staff');
    }
  };

  const handleStaffClick = (staffObj) => {
    setSelectedStaff(staffObj);
    setModalType(staffObj.status === 'assigned' ? 'unassign' : 'details');
    setShowModal(true);
  };

  const handleUnassign = async () => {
    if (!selectedStaff) return;
    setLoading(true);
    try {
      await unassignStaffFromVenue(selectedStaff.id);
      toast.success('Staff unassigned successfully');
      fetchStaff();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error unassigning staff');
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyUnassign = async () => {
    setLoading(true);
    try {
      await api.post('/admin/staff/emergency-unassign-all');
      toast.success('All staff and venues unassigned successfully');
      fetchStaff();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error unassigning everyone');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post('/admin/register-staff', newStaff);
      toast.success('Staff registered successfully');
      setShowCreateModal(false);
      setNewStaff({ name: '', email: '' });
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error registering staff');
    } finally {
      setCreating(false);
    }
  };

  const filteredStaff = staff.filter(s => s.status === staffFilter);

  return (
    <Container>
      <Grid>
        <Card>
          <ToggleRow>
            <ToggleSwitch
              active={staffFilter === 'unassigned'}
              onClick={() => setStaffFilter('unassigned')}
            >
              Unassigned
            </ToggleSwitch>
            <ToggleSwitch
              active={staffFilter === 'assigned'}
              onClick={() => setStaffFilter('assigned')}
            >
              Assigned
            </ToggleSwitch>
            <Button style={{marginLeft: 'auto', display: 'flex', alignItems: 'center'}} onClick={() => setShowCreateModal(true)}>
              <FaUserPlus style={{marginRight: 8}} /> Create Staff
            </Button>
            <DangerButton onClick={handleEmergencyUnassign} disabled={loading}>
              Unassign Everyone
            </DangerButton>
          </ToggleRow>
          <StaffList>
            {filteredStaff.map(staffObj => (
              <StaffItem
                key={staffObj.id}
                selected={selectedStaff?.id === staffObj.id}
                onClick={() => handleStaffClick(staffObj)}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600 }}>{staffObj.name}</span>
                  <span style={{ fontSize: 14, color: '#6b7280' }}>{staffObj.email}</span>
                  <span style={{ fontSize: 14, color: '#6b7280' }}>Status: {staffObj.status}</span>
                  {staffObj.venue && staffObj.venue.name && (
                    <span style={{ fontSize: 14, color: '#16a34a' }}>Venue: {staffObj.venue.name}</span>
                  )}
                </div>
              </StaffItem>
            ))}
          </StaffList>
        </Card>
      </Grid>

      {/* Modal for Staff Details or Unassign */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalClose onClick={() => setShowModal(false)}>&times;</ModalClose>
            {modalType === 'details' && selectedStaff && (
              <>
                <ModalTitle>Staff Details</ModalTitle>
                <div><b>Name:</b> {selectedStaff.name}</div>
                <div><b>Email:</b> {selectedStaff.email}</div>
                <div><b>Status:</b> {selectedStaff.status}</div>
                {selectedStaff.venue && selectedStaff.venue.name && (
                  <div><b>Venue:</b> {selectedStaff.venue.name}</div>
                )}
              </>
            )}
            {modalType === 'unassign' && selectedStaff && (
              <>
                <ModalTitle>Unassign Staff</ModalTitle>
                <div><b>Name:</b> {selectedStaff.name}</div>
                <div><b>Email:</b> {selectedStaff.email}</div>
                <div><b>Status:</b> {selectedStaff.status}</div>
                {selectedStaff.venue && selectedStaff.venue.name && (
                  <div><b>Venue:</b> {selectedStaff.venue.name}</div>
                )}
                <DangerButton onClick={handleUnassign} disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Unassigning...' : 'Unassign'}
                </DangerButton>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {showCreateModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Create New Staff</ModalTitle>
            <ModalClose onClick={() => setShowCreateModal(false)}>&times;</ModalClose>
            <form onSubmit={handleCreateStaff}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Name</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 16 }}
                  placeholder="Enter staff name"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Email</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 16 }}
                  placeholder="Enter staff email"
                />
              </div>
              <Button type="submit" disabled={creating} style={{ width: '100%' }}>
                {creating ? 'Registering...' : 'Register Staff'}
              </Button>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default StaffManagement; 