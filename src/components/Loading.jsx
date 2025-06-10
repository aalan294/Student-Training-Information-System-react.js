import React from 'react';

const Loading = ({ message = 'Loading...' }) => (
  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>{message}</div>
);

export default Loading; 