import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BackgroundImage from './image.png'; // Image is in the same folder as Login.jsx

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login Data:', formData);
        // Add your login logic here
    };

    const handleSignUpClick = () => {
        navigate('/signup'); // Navigate to the Sign Up page
    };

    return (
        <LoginWrapper>
            <LoginContainer>
                <LoginTitle>Login to InsurExceed</LoginTitle>
                <LoginForm onSubmit={handleSubmit}>
                    <LoginInput
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <LoginInput
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <LoginButton type="submit">Login</LoginButton>
                </LoginForm>
                <SignUpSection>
                    <SignUpText>Don't have an ACCOUNT?</SignUpText>
                    <SignUpButton onClick={handleSignUpClick}>Sign Up</SignUpButton>
                </SignUpSection>
            </LoginContainer>
        </LoginWrapper>
    );
};

const LoginWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: url(${BackgroundImage}) no-repeat center center/cover;
    background-color: rgba(0, 0, 0, 0.5); /* Dark overlay */
    background-blend-mode: darken;
`;

const LoginContainer = styled.div`
    background-color: rgba(255, 255, 255, 0.8); /* White with transparency */
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
`;

const LoginTitle = styled.h2`
    text-align: center;
    color: #2E0059;
    margin-bottom: 30px;
    font-size: 28px;
    font-weight: bold;
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
`;

const LoginInput = styled.input`
    padding: 15px;
    margin-bottom: 20px;
    font-size: 16px;
    border: 2px solid #ddd;
    border-radius: 5px;
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #A24ED6;
        outline: none;
    }
`;

const LoginButton = styled.button`
    padding: 15px;
    font-size: 18px;
    background-color: #6D83F2;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #4E2A84;
    }
`;

const SignUpSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    gap: 10px; /* Space between the text and button */
`;

const SignUpText = styled.p`
    color: #2E0059;
    margin: 0;
    font-size: 16px;
`;

const SignUpButton = styled.button`
    background-color: #fff;
    color: #2E0059;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #D4C2FC;
    }
`;

export default Login;
