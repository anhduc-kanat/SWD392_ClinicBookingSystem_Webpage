import React, { useState, useEffect } from 'react';
import { Switch } from '@material-ui/core';
import { fetchUserProfile, updateUserProfile } from '../../../redux/UserProfileSlice'; // Import API functions

const UserProfile = () => {
  const initialUserData = {
    id: 0,
    firstName: "",
    lastName: "",
    gender: 0,
    address: "",
    dateOfBirth: "",
    phoneNumber: "",
    cccd: "",
    email: "",
    groupId: "",
    type: ""
  };

  const [userData, setUserData] = useState(initialUserData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUserData(data);
      } catch (error) {
        console.error('Error loading user profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setUserData({
      ...userData,
      [name]: checked
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(userData);
      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-gray-100 border border-4 rounded-lg shadow relative mt-10 max-w-screen-xl mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 p-6">
        <div>
          <div className="mb-4">
            <label htmlFor="firstName" className="text-sm font-semibold text-gray-900 block mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              value={userData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="text-sm font-semibold text-gray-900 block mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              value={userData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="text-sm font-semibold text-gray-900 block mb-2">
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              value={userData.gender}
              onChange={handleChange}
            >
              <option value={0}>Male</option>
              <option value={1}>Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-900 block mb-2">
              Date of Birth
            </label>
            <input
              type="text"
              name="dateOfBirth"
              id="dateOfBirth"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              value={formatDate(userData.dateOfBirth)}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-900 block mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              value={userData.phoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <div className="mb-4">
            <label htmlFor="address" className="text-sm font-semibold text-gray-900 block mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              value={userData.address}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cccd" className="text-sm font-semibold text-gray-900 block mb-2">
              CCCD (ID Card)
            </label>
            <input
              type="text"
              name="cccd"
              id="cccd"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              value={userData.cccd}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="groupId" className="text-sm font-semibold text-gray-900 block mb-2">
              Group ID
            </label>
            <input
              type="text"
              name="groupId"
              id="groupId"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              value={userData.groupId}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="text-sm font-semibold text-gray-900 block mb-2">
              Type
            </label>
            <input
              type="text"
              name="type"
              id="type"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              value={userData.type}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between mb-4">
            <div>
              <label htmlFor="emailConfirmed" className="font-semibold mr-2">
                Email Confirmed:
              </label>
              <Switch
                name="emailConfirmed"
                checked={userData.emailConfirmed}
                onChange={handleSwitchChange}
              />
            </div>
            <div>
              <label htmlFor="phoneConfirmed" className="font-semibold mr-2">
                Phone Confirmed:
              </label>
              <Switch
                name="phoneConfirmed"
                checked={userData.phoneConfirmed}
                onChange={handleSwitchChange}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
