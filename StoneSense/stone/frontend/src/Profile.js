import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './Profile.css';
import profileImage from './components/Medicine-bro 1.svg';
import logoImage from './components/logo.png';

const Profile = ({ onLogout }) => {
  const { userProfile, updateProfile, currentUser } = useAuth();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userProfile) {
      setAge(userProfile.age || '');
      setGender(userProfile.gender || '');
      setDoctorName(userProfile.doctorName || '');
      setPhoneNumber(userProfile.phoneNumber || '');
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await updateProfile({
        age: age ? parseInt(age) : null,
        gender: gender || null,
        doctorName: doctorName || null,
        phoneNumber: phoneNumber || null
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-left">
        <h3 className="profile-greeting">Your Profile,</h3>
        <div className="profile-illustration">
          <img src={profileImage} alt="Profile Illustration" className="profile-image" />
        </div>
      </div>

      <div className="profile-right">
        <div className="profile-section">
          <h3>Profile Information</h3>
          
          <div className="profile-info-display">
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{userProfile?.name || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{currentUser?.email || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Patient ID:</span>
              <span className="info-value">{userProfile?.patientId || 'N/A'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <h4>Update Medical Information</h4>
            
            {success && <div className="success-message">Profile updated successfully!</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                min="1"
                max="150"
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Doctor Name (Optional)</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Dr. Smith"
              />
            </div>

            <div className="form-group">
              <label>WhatsApp Number (with country code)</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            <button type="submit" className="update-button" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>

          <button onClick={onLogout} className="logout-button-profile">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
