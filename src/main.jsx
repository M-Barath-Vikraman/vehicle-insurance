import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import InsuranceImage from './Insurance-Image-1.png'; // Ensure this path is correct

const MainContent = () => {
    const navigate = useNavigate();
    const [carNumber, setCarNumber] = useState('');
    const [carModel, setCarModel] = useState('');
    const [brandName, setBrandName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const uppercasedValue = e.target.value.toUpperCase();
        setCarNumber(uppercasedValue);
    };

    const validateCarNumberFormat = () => {
        const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{1,4}$/;
        return regex.test(carNumber);
    };

    const validateCarNumber = async () => {
        if (!validateCarNumberFormat()) {
            setErrorMessage('Invalid car number format. Please use correct format.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/validate-vehicle/${carNumber}`);
            const data = await response.json();
            if (response.ok && data.valid) {
                setCarModel(data.carModel);
                setBrandName(data.brandName);
                setErrorMessage('');
                navigate('/price-list', { state: { carNumber, carModel: data.carModel, brandName: data.brandName } });
            } else if (response.status === 404) {
                setErrorMessage('Incorrect car registration number.');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    const handleRenewClick = () => {
        navigate('/login');
    };

    return (
        <MainWrapper>
            <TextSection>
                <h2>Drive with Confidence - Insure Your Vehicle with InsurExceed</h2>
                <p>At InsurExceed, we know how much your vehicle means to you. Whether it's your daily commute, weekend getaways, or long road trips, your car is an essential part of your life. That's why we offer comprehensive vehicle insurance solutions designed to keep you protected on every journey.</p>
                <FormWrapper>
                    <FormLabel>Your Car Registration Number</FormLabel>
                    <Input
                        type="text"
                        placeholder="Your Car Number Here"
                        value={carNumber}
                        onChange={handleInputChange}
                    />
                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                    <ButtonWrapper>
                        <RenewButton onClick={handleRenewClick}>Renew Existing INSUREXCEED Policy</RenewButton>
                        <GetPriceButton onClick={validateCarNumber}>Get Price</GetPriceButton>
                    </ButtonWrapper>
                </FormWrapper>
            </TextSection>
            <ImageSection>
                <img src={InsuranceImage} alt="Insurance Directions" />
            </ImageSection>
        </MainWrapper>
    );
};

// Styled components for CSS
const MainWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 50px;
    background-color: #1C0046;
    color: white;
    height: 100vh; /* Takes full viewport height */
    width: 100%; /* Takes full viewport width */
    box-sizing: border-box; /* Ensure padding doesn't affect the width */
`;

const TextSection = styled.div`
    flex: 1;
    max-width: 50%;
    h2 {
        font-size: 36px;
    }
    p {
        margin: 20px 0;
        line-height: 1.6;
    }
`;

const ImageSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    img {
        width: 70%;
        height: auto;
        border-radius: 20px;
    }
`;

const FormWrapper = styled.div`
    margin-top: 30px;
    padding: 30px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const FormLabel = styled.label`
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
`;

const Input = styled.input`
    padding: 15px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ddd;
    width: 50%;
    text-transform: uppercase;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Button = styled.button`
    padding: 15px 30px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0046A6;
        color: white;
    }
`;

const RenewButton = styled(Button)`
    background-color: #E0E0E0;
    color: #1C0046;

    &:hover {
        background-color: #C0C0C0;
    }
`;

const GetPriceButton = styled(Button)`
    background-color: #005BFF;
    color: white;

    &:hover {
        background-color: #0046A6;
    }
`;

const ErrorMessage = styled.div`
    color: red;
    font-size: 14px;
    margin-top: 10px;
`;

export default MainContent;
