import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleAdminClick = () => {
        navigate('/admin-login');
    };

    const handleBackClick = () => {
        navigate('/');
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

const Button = styled.button`
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

const LoginButton = styled(Button)``;

const BackButton = styled(Button)``;

const AdminButton = styled(Button)`
    background-color: #FF4C4C;
    color: white;

    &:hover {
        background-color: #FFA5A5;
    }
`;

export default Header;
