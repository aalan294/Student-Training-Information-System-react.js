import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const Error = ({ message }) => (
  <div style={{ color: '#d32f2f', textAlign: 'center', padding: '2rem', fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
    <FaExclamationTriangle style={{ fontSize: 32, marginBottom: 12 }} />
    <div>{message}</div>
  </div>
);

export default Error; 