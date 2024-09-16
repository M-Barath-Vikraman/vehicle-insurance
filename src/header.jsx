import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login'); // Navigate to the login page
    };

    const handleBackClick = () => {
        navigate('/'); // Navigate back to the main component
    };

    return (
        <HeaderWrapper>
            <Logo>INSUREXCEED</Logo>
            <ButtonWrapper>
                <BackButton onClick={handleBackClick}>Home</BackButton>
                <LoginButton onClick={handleLoginClick}>Login</LoginButton>
            </ButtonWrapper>
        </HeaderWrapper>
    );
};

const HeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #2E0059;
`;

const Logo = styled.h1`
    color: #fff;
    font-size: 24px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 10px;
`;

const LoginButton = styled.button`
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

const BackButton = styled.button`
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

export default Header;
