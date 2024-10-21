import React, { useState } from 'react';
import './Signup.css';
import BackgroundImage from './image.png';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        age: '',
        dob: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert('User registered successfully!');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phoneNumber: '',
                    age: '',
                    dob: ''
                });
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('There was a problem with registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="phoneNumber" 
                    placeholder="Phone Number" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="age" 
                    placeholder="Age" 
                    value={formData.age} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="date" 
                    name="dob" 
                    placeholder="Date of Birth" 
                    value={formData.dob} 
                    onChange={handleChange} 
                    required 
                />
                <button type="submit" className="signup-button" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default Signup;
