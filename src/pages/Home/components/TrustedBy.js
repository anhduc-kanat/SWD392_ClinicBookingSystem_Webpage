// TrustedBy.js
import React from 'react';
import './TrustedBy.css'; // Import the CSS file for custom styles

const TrustedBy = () => {
  return (
    <div className="trusted-by-section">
     <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'gray', marginBottom:'10px' }}>Trusted by:</h2>
      <div className="trusted-logos">
        <img src="/images/Trusted by 1.png" alt="Liceria Hospital" />
        <img src="/images/Trusted by 2.png" alt="Keithston Medical Clinics" />
        <img src="/images/Trusted by 3.png" alt="Medicare Healthy" />
        <img src="/images/Trusted by 4.png" alt="Herbasul Medicine" />
      </div>
    </div>
  );
};

export default TrustedBy;
