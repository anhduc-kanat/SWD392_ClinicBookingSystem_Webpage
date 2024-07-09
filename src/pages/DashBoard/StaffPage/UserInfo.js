// UserInfo.js
import React, { useState, useEffect } from 'react';
import { Switch } from '@material-ui/core';
import { fetchUserInfo } from '../../../redux/UserInfoSlice';

const UserInfo = () => {
  // Sample user data
  const [userData, setUserData] = useState(null);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo(accessToken);
        setUserData(userInfo);
      } catch (error) {
        console.error(error);
        // Handle error fetching user info
      }
    };

    if (accessToken) {
      getUserInfo();
    }
  }, [accessToken]);

  const renderBusinessServices = () => {
    if (!userData.businessServices || userData.businessServices.length === 0) {
      return <p>No business services</p>;
    }
    return (
      <ul>
        {userData.businessServices.map((service, index) => (
          <li key={index}>{service}</li>
        ))}
      </ul>
    );
  };

  const renderSpecifications = () => {
    if (!userData.specifications || userData.specifications.length === 0) {
      return <p>No specifications</p>;
    }
    return (
      <ul>
        {userData.specifications.map((specification, index) => (
          <li key={index}>{specification}</li>
        ))}
      </ul>
    );
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 border border-4 rounded-lg shadow relative mt-10 max-w-screen-xl mx-auto">
      <div className="flex items-start justify-between p-5 border-b rounded-t border-gray-400">
        <h3 className="text-xl font-semibold">User Info</h3>
      </div>
      <div className="p-6">
        <div className="col-span-6 sm:col-span-3 mb-4">
          <label htmlFor="full-name" className="text-sm font-semibold text-gray-900 block mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="full-name"
            id="full-name"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-[25rem] p-2.5"
            value={`${userData.firstName} ${userData.lastName}`}
            readOnly
          />
        </div>
        <div className="col-span-6 sm:col-span-3 mb-4">
          <label htmlFor="email" className="text-sm font-semibold text-gray-900 block mb-2">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-[25rem] p-2.5"
            value={userData.email}
            readOnly
          />
        </div>
        <div className="col-span-6 sm:col-span-3 mb-4">
          <label htmlFor="phone-number" className="text-sm font-semibold text-gray-900 block mb-2">
            Phone Number
          </label>
          <input
            type="text"
            name="phone-number"
            id="phone-number"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-[25rem] p-2.5"
            value={userData.phoneNumber}
            readOnly
          />
        </div>
        <div className="col-span-6 sm:col-span-3 mb-4">
          <label htmlFor="address" className="text-sm font-semibold text-gray-900 block mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-[25rem] p-2.5"
            value={userData.address}
            readOnly
          />
        </div>
        <div className="flex justify-between mb-4">
          <div>
            <label htmlFor="email-confirmed" className="font-semibold mr-2">
              Email Confirmed:
            </label>
            <Switch checked={userData.emailConfirmed} />
          </div>
          <div>
            <label htmlFor="phone-confirmed" className="font-semibold mr-2">
              Phone Confirmed:
            </label>
            <Switch checked={userData.phoneConfirmed} />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="business-services" className="font-semibold">
            Business Services:
          </label>
          {renderBusinessServices()}
        </div>
        <div className="mb-4">
          <label htmlFor="specifications" className="font-semibold">
            Specifications:
          </label>
          {renderSpecifications()}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
