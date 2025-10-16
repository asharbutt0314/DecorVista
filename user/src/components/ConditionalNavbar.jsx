import React, { useEffect } from 'react';
import Navbar from '../assets/Components/Navbar/Navbar';

const ConditionalNavbar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  useEffect(() => {
    if (user.role === 'designer') {
      window.location.href = '/designer-panel';
    }
  }, [user.role]);
  
  if (user.role === 'designer') {
    return null;
  }
  
  return <Navbar />;
};

export default ConditionalNavbar;