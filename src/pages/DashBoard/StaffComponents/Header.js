import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Avatar from 'react-avatar';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/user/my-profile`;
        const response = await Axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setUserProfile(response.data.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchData();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUserProfile(null);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/assets/Logo.png" alt="Duck Clinic Logo" style={{ height: '50px' }} />
      </div>
      <button className="avatar-button" onClick={toggleDropdown}>
        <Avatar name={userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "User Name"} size="40" round={true} />
      </button>
      {isDropdownOpen && userProfile && (
        <div className="dropdown-content">
          <p className="dropdown-label">Full Name: <span className="dropdown-value">{`${userProfile.firstName} ${userProfile.lastName}`}</span></p>
          <p className="dropdown-label">Email: <span className="dropdown-value">{userProfile.email}</span></p>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
};

export default Header;
