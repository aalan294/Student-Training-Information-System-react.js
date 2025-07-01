import React, { useState, useEffect } from 'react';
import { getSystemConfig, updateSystemConfig } from '../../services/api';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaCog, FaSave, FaUndo } from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #22c55e;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f9fafb;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 1.2rem;
  height: 1.2rem;
  accent-color: #22c55e;
`;

const Description = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &.primary {
    background: #22c55e;
    color: white;
    
    &:hover {
      background: #16a34a;
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const Error = styled.div`
  color: #dc2626;
  text-align: center;
  padding: 1rem;
  background: #fee2e2;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const AdminSettings = () => {
  const [config, setConfig] = useState({
    defaultSession: 'forenoon',
    emailNotifications: true,
    autoMarkAbsent: false
  });
  const [originalConfig, setOriginalConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getSystemConfig();
      const configData = response.data.config;
      
      // Set defaults if config doesn't exist
      const defaultConfig = {
        defaultSession: configData.defaultSession || 'forenoon',
        emailNotifications: configData.emailNotifications !== undefined ? configData.emailNotifications : true,
        autoMarkAbsent: configData.autoMarkAbsent !== undefined ? configData.autoMarkAbsent : false
      };
      
      setConfig(defaultConfig);
      setOriginalConfig(defaultConfig);
    } catch (err) {
      setError('Failed to load system configuration');
      console.error('Error fetching config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      await updateSystemConfig(config);
      setOriginalConfig(config);
      toast.success('System configuration updated successfully!');
    } catch (err) {
      setError('Failed to update system configuration');
      toast.error('Failed to update system configuration');
      console.error('Error updating config:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(originalConfig);
    setError('');
  };

  const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig);

  if (loading) {
    return (
      <Container>
        <Card>
          <Loading>Loading system configuration...</Loading>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>
          <FaCog />
          System Settings
        </Title>

        {error && <Error>{error}</Error>}

        <Section>
          <SectionTitle>Attendance Settings</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="defaultSession">Default Session</Label>
            <Select
              id="defaultSession"
              value={config.defaultSession}
              onChange={(e) => handleConfigChange('defaultSession', e.target.value)}
            >
              <option value="forenoon">Forenoon Session</option>
              <option value="afternoon">Afternoon Session</option>
            </Select>
            <Description>
              This will be the default session selected when marking attendance for new records.
            </Description>
          </FormGroup>

          <FormGroup>
            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                id="emailNotifications"
                checked={config.emailNotifications}
                onChange={(e) => handleConfigChange('emailNotifications', e.target.checked)}
              />
              <Label htmlFor="emailNotifications" style={{ marginBottom: 0 }}>
                Enable Email Notifications
              </Label>
            </CheckboxGroup>
            <Description>
              Send automatic email notifications to students when they are marked absent.
            </Description>
          </FormGroup>

          <FormGroup>
            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                id="autoMarkAbsent"
                checked={config.autoMarkAbsent}
                onChange={(e) => handleConfigChange('autoMarkAbsent', e.target.checked)}
              />
              <Label htmlFor="autoMarkAbsent" style={{ marginBottom: 0 }}>
                Auto-mark Absent
              </Label>
            </CheckboxGroup>
            <Description>
              Automatically mark students as absent if they are not explicitly marked present or on duty.
            </Description>
          </FormGroup>
        </Section>

        <ButtonGroup>
          <Button
            className="primary"
            onClick={handleSave}
            disabled={saving || !hasChanges}
          >
            <FaSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          
          {hasChanges && (
            <Button className="secondary" onClick={handleReset}>
              <FaUndo />
              Reset
            </Button>
          )}
        </ButtonGroup>
      </Card>
    </Container>
  );
};

export default AdminSettings; 