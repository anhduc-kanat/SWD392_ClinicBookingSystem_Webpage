// components/Introducing.js
import React from 'react';
import './Introducing.css'; // Import CSS for this component
import { StarFilled } from '@ant-design/icons'; // Import star icon from Ant Design

const Introducing = () => {
  return (
    <div className="introducing-section">
      <h2>Introducing Duck Clinic</h2>
      <iframe
        width="100%"
        height="600"
        src="https://www.youtube.com/embed/74DWwSxsVSs?si=6SNZIEFN2wtbHdyc"
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className="reviews">
        <div className="review">
          <img src="/svgs/bukku-google.svg" alt="Google Logo" />
          <div className="stars">
            <StarFilled className="star-icon" />
            <StarFilled className="star-icon" />
            <StarFilled className="star-icon" />
            <StarFilled className="star-icon" />
            <StarFilled className="star-icon" />
          </div>
          <p>Rated as top accounting software in Vietnam.</p>
        </div>
        <div className="review">
          <img src="/svgs/bukku-facebook.svg" alt="Facebook Logo" />
          <div className="stars">
            <StarFilled className="star-icon" />
            <StarFilled className="star-icon" />
            <StarFilled className="star-icon" />
            <StarFilled className="star-icon" />
            <StarFilled className="star-icon" />
          </div>
          <p>Best accounting software in Vietnam.</p>
        </div>
      </div>
    </div>
  );
};

export default Introducing;
