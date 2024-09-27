// ProfilePage.tsx
import React, { useState } from 'react';
import '../Helpers/scss/ProfilePage.scss';

const ProfilePage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="profile-page">
      <aside className="sidebar">
        <div className="profile-pic">
          <img src="/path/to/default-avatar.png" alt="Profile" />
          <h3>Hello</h3>
        </div>
        <nav>
          <ul>
            <li>My Orders</li>
            <li>Account Settings</li>
            <li>Payments</li>
            <li>My Stuff</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <section className="profile-info">
          <h2>Personal Information</h2>
          <div className="profile-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <div className="gender-inputs">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                />
                Male
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                />
                Female
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
