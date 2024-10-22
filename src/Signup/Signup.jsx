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
    const [errors, setErrors] = useState({}); // State to hold error messages

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear any previous error for the field
        setErrors({
            ...errors,
            [e.target.name]: ''
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const { name, email, password, phoneNumber, age, dob } = formData;

        // Name validation
        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!emailPattern.test(email)) {
            newErrors.email = 'Invalid email address';
        }

        // Password validation
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,12}$/;
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (!passwordPattern.test(password)) {
            newErrors.password = 'Password must be 4-12 characters long, include at least one uppercase letter, one number, and one special character';
        }

        // Phone Number validation
        if (!phoneNumber) {
            newErrors.phoneNumber = 'Phone Number is required';
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'Phone Number must be 10 digits';
        }

        // Age validation
        if (!age) {
            newErrors.age = 'Age is required';
        } else if (isNaN(age) || age <= 0) {
            newErrors.age = 'Age must be a positive number';
        }

        // Date of Birth validation
        if (!dob) {
            newErrors.dob = 'Date of Birth is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return; // Stop submission if validation fails
        }

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
                {errors.name && <p className="error-message">{errors.name}</p>} {/* Error message */}

                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />
                {errors.email && <p className="error-message">{errors.email}</p>} {/* Error message */}

                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                />
                {errors.password && <p className="error-message">{errors.password}</p>} {/* Error message */}

                <input 
                    type="text" 
                    name="phoneNumber" 
                    placeholder="Phone Number" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                    required 
                />
                {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>} {/* Error message */}

                <input 
                    type="number" 
                    name="age" 
                    placeholder="Age" 
                    value={formData.age} 
                    onChange={handleChange} 
                    required 
                />
                {errors.age && <p className="error-message">{errors.age}</p>} {/* Error message */}

                <input 
                    type="date" 
                    name="dob" 
                    placeholder="Date of Birth" 
                    value={formData.dob} 
                    onChange={handleChange} 
                    required 
                />
                {errors.dob && <p className="error-message">{errors.dob}</p>} {/* Error message */}

                <button type="submit" className="signup-button" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default Signup;
