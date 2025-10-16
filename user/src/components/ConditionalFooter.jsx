import React, { useEffect } from 'react';
import Footer from '../assets/Components/Footer/Footer';

const ConditionalFooter = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  useEffect(() => {
    if (user.role === 'designer') {
      window.location.href = '/designer-panel';
    }
  }, [user.role]);
  
  if (user.role === 'designer') {
    return null;
  }
  
  return <Footer />;
};

export default ConditionalFooter;