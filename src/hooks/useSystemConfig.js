import { useState, useEffect } from 'react';
import { getSystemConfig } from '../services/api';

export const useSystemConfig = () => {
  const [config, setConfig] = useState({
    defaultSession: 'forenoon',
    emailNotifications: true,
    autoMarkAbsent: false
  });
  const [loading, setLoading] = useState(true);
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
    } catch (err) {
      console.error('Error fetching system config:', err);
      setError('Failed to load system configuration');
      // Use default values if config fetch fails
      setConfig({
        defaultSession: 'forenoon',
        emailNotifications: true,
        autoMarkAbsent: false
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    config,
    loading,
    error,
    refetch: fetchConfig
  };
}; 