import React from 'react';
import { Button } from 'antd';
import './Footer.css'; // Import the CSS file for custom styles

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h2>Duck Clinic</h2>
          <p>Providing top-notch dental care with personalized services and the latest technology.</p>
        </div>
        <div className="footer-section">
          <h2>Quick Links</h2>
          <div className="footer-buttons">
            <Button type="default" size="large">Home</Button>
            <Button type="default" size="large">About Us</Button>
            <Button type="default" size="large">Services</Button>
            <Button type="default" size="large">Contact</Button>
          </div>
        </div>
        <div className="footer-section">
          <h2>Contact Us</h2>
          <p>Phone: 019-215-1510</p>
          <p>Email: info@duckclinic.com</p>
          <p>Address: 123 Dental St, Smile City, Happyland</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Duck Clinic. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
