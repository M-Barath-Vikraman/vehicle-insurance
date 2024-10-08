import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import InsuranceImage from './Insurance-Image-1.png'; // Ensure this path is correct

const MainContent = () => {                 // used to store the user given data and the data fetched form DB
    const navigate = useNavigate();
    const [carNumber, setCarNumber] = useState('');
    const [carModel, setCarModel] = useState(''); 
    const [brandName, setBrandName] = useState(''); 
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {              // convert to upper case
        const uppercasedValue = e.target.value.toUpperCase();
        setCarNumber(uppercasedValue);
    };

    const validateCarNumberFormat = () => {
        const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{1,4}$/; //  car number format
        return regex.test(carNumber);
    };
    

    const validateCarNumber = async () => {
        if (!validateCarNumberFormat()) {
            setErrorMessage('Invalid car number format. Please use correct format.'); // wrong formate error
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/validate-vehicle/${carNumber}`); // frtch from db
            const data = await response.json(); // convert to json foramte data reicver form server
            if (response.ok && data.valid) {
                setCarModel(data.carModel);  
                setBrandName(data.brandName); 
                setErrorMessage('');
                navigate('/car-detail', { state: { carNumber, carModel:data.carModel, brandName:data.brandName } }); // pass the car detil to next page

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

    const handleNewCarClick = () => {
        navigate('/new-car-detail');
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
                <NewCarButton onClick={handleNewCarClick}>
                    <CarIcon />
                    <span>Insure your <strong>Brand New Car</strong></span>
                    <ArrowIcon />
                </NewCarButton>
            </TextSection>
            <ImageSection>
                <img src={InsuranceImage} alt="Insurance Directions" />
            </ImageSection>
        </MainWrapper>
    );
};
const MainWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 50px;
    background-color: #1C0046;
    color: white;
`;


const TextSection = styled.div`
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

const NewCarButton = styled(Button)`
    margin-top: 20px;
    display: flex;
    align-items: center;
    background-color: #F4F4F4;
    padding: 10px 20px;
    border-radius: 30px;
    color: #1C0046;
    width: fit-content;
    cursor: pointer;
`;

const CarIcon = styled.div`
    width: 30px;
    height: 30px;
    background: url('./car-icon.png') no-repeat center center;
    background-size: contain;
    margin-right: 10px;
`;

const ArrowIcon = styled.div`
    width: 20px;
    height: 20px;
    background: url('/path-to-arrow-icon.png') no-repeat center center;
    background-size: contain;
    margin-left: 10px;
`;

const ErrorMessage = styled.div`
    color: red;
    font-size: 14px;
    margin-top: 10px;
`;

export default MainContent;
