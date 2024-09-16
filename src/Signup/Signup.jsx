import React, { useState } from 'react';
import './Signup.css';
import BackgroundImage from './image.png'; // Image is in the same folder as Signup.jsx

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        number: '',
        age: '',
        dob: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // Add your signup logic here
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
                    name="number" 
                    placeholder="Phone Number" 
                    value={formData.number} 
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
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
        </div>
    );
}

export default Signup;
    