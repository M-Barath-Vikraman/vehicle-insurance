import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CarImage from './car-icon.png'; // Ensure correct path
import RightSideImage from '../logo.png'; // Ensure correct path

const CarDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { carNumber, carModel, brandName } = location.state || {};// Optional chaining to safely access carNumber

    const [yearMonth, setYearMonth] = useState(''); // used to store input details
    const [expiryDate, setExpiryDate] = useState('');
    const [phone, setPhone] = useState('');
    const [isComprehensive, setIsComprehensive] = useState(false);  
    const [errors, setErrors] = useState({
        yearMonth: '',
        expiryDate: '',
        phone: ''
    });
    const validateForm = () => {
        let valid = true;
        const newErrors = { yearMonth: '', expiryDate: '', phone: '' };

        // Validate year and month
        const [year, month] = yearMonth.split('/');
        if (!year || !month || year.length !== 4 || month.length !== 2) {
            newErrors.yearMonth = 'Please enter a valid year and month (YYYY/MM).';
            valid = false;
        }

        // Validate expiry date
        if (!expiryDate) {
            newErrors.expiryDate = 'Please enter the expiry date of your previous policy.';
            valid = false;
        }

        // Validate phone number
        if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number.';
            valid = false;
        }

        // Validate checkbox
        if (!isComprehensive) {
            newErrors.expiryDate = 'Please confirm that your previous policy was comprehensive.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Redirect to the PriceList component
            navigate('/price-list', {
                state: { 
                    carNumber: carNumber, 
                    carModel: carModel, 
                    brandName: brandName 
                }
            });
        }
    };

    return (
        <Container>
            <InfoBox>
                <ContentSection>
                    <CarInfoSection>
                        <h2>{carNumber || 'Car Number'}</h2> {/* Display car number or default text */}
                        <CarDetails>
                            <CarImageIcon src={CarImage} alt="Car Icon" />
                            <Details>
                                <p>
                                    <strong>Brand:</strong> {brandName || 'Unknown Brand'} / 
                                    <strong>Model:</strong> {carModel || 'Unknown Model'}
                                </p>
                            </Details>
                        </CarDetails>
                        <p><strong>Confirm Your Details and See the Price</strong></p>
                        <NotMyCarButton>Not My Car</NotMyCarButton>
                    </CarInfoSection>
                    
                    <FormSection>
                        <FormLabel>Year and Month of Purchase</FormLabel>
                        <InputContainer>
                            <Input 
                                type="text" 
                                value={yearMonth} 
                                onChange={(e) => setYearMonth(e.target.value)} 
                                placeholder="YYYY/MM" 
                                maxLength="7" // Format is YYYY/MM
                            />
                            {errors.yearMonth && <ErrorMessage>{errors.yearMonth}</ErrorMessage>}
                        </InputContainer>
                        
                        <FormLabel>Previous Policy Expiry Date</FormLabel>
                        <InputContainer>
                            <Input 
                                type="date" 
                                value={expiryDate} 
                                onChange={(e) => setExpiryDate(e.target.value)} 
                            />
                            {errors.expiryDate && <ErrorMessage>{errors.expiryDate}</ErrorMessage>}
                        </InputContainer>
                        
                        <FormLabel>Phone Number</FormLabel>
                        <InputContainer>
                            <Input 
                                type="tel" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                placeholder="10-digit phone number"
                            />
                            {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                        </InputContainer>
                        
                        <CheckboxWrapper>
                            <input 
                                type="checkbox" 
                                checked={isComprehensive} 
                                onChange={() => setIsComprehensive(!isComprehensive)} 
                            />
                            <FormLabel>Previous Policy was Comprehensive</FormLabel>
                        </CheckboxWrapper>
                        
                        <ButtonWrapper>
                            <SeePriceButton onClick={handleSubmit}>See Price</SeePriceButton>
                            <AuthorizationText>
                                By clicking, I authorize INSUREXCEED to connect with me over Call/SMS/WhatsApp,<br />
                                overriding DNCR
                            </AuthorizationText>
                        </ButtonWrapper>
                    </FormSection>
                </ContentSection>
                <ImageWrapper>
                    <RightSideImageIcon src={RightSideImage} alt="Right Side Image" />
                </ImageWrapper>
            </InfoBox>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: rgba(245, 245, 245, 0.9); /* Slightly transparent background */
`;

const InfoBox = styled.div`
    display: flex;
    flex-direction: row; /* Align content and image side by side */
    align-items: flex-start; /* Align items at the start */
    background-color: white;
    padding: 10px; /* Decreased padding */
    border-radius: 10px; /* Adjusted rounded corners */
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2); /* Reduced shadow size */
    max-width: 1000px; /* Decreased width */
    width: 100%;
    margin-bottom: 15px; /* Decreased margin */
`;

const ContentSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px; /* Decreased gap */
`;

const CarInfoSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const CarDetails = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px; /* Decreased margin */
`;

const CarImageIcon = styled.img`
    width: 40px; /* Adjusted size */
    height: 40px; /* Adjusted size */
    margin-right: 10px; /* Adjusted margin */
`;

const Details = styled.div`
    p {
        font-size: 14px; /* Slightly smaller font size */
        margin: 0; /* No margin */
        font-weight: bold; /* Bold text */
        line-height: 1.5; /* Better line spacing */
    }
`;

const NotMyCarButton = styled.button`
    margin-top: 5px; /* Decreased margin */
    padding: 8px 16px; /* Adjusted padding */
    border: none;
    border-radius: 8px; /* Adjusted rounded corners */
    background-color: #ddd;
    color: #333;
    cursor: pointer;
    font-size: 12px; /* Slightly smaller font size */
    font-weight: bold; /* Bold text */
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #ccc;
    }
`;

const FormSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px; /* Decreased gap */
`;

const FormLabel = styled.label`
    display: block;
    font-size: 12px; /* Slightly smaller font size */
    font-weight: bold; /* Bold text */
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column; /* Stack label and input vertically */
    gap: 5px; /* Space between label and input */
    width: 100%; /* Full width of the container */
`;

const Input = styled.input`
    padding: 8px;
    border: 2px solid #ddd;
    border-radius: 10px; /* Adjusted rounded edges */
    font-size: 12px;
    box-sizing: border-box;
    width: 50%; /* Reduced width */
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px; /* Decreased margin */
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Align items to the left */
    gap: 5px; /* Decreased gap */
`;

const SeePriceButton = styled.button`
    padding: 14px 28px; /* Increased padding */
    border: none;
    border-radius: 25px; /* Adjusted rounded corners */
    background-color: #005BFF;
    color: white;
    font-size: 16px; /* Increased font size */
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0046A6;
    }
`;

const AuthorizationText = styled.p`
    font-size: 12px;
    color: #555;
    text-align: left; /* Align text to the left */
    margin: 0;
    white-space: pre-line;
`;

const ErrorMessage = styled.div`
    color: red;
    font-size: 12px;
    margin-top: 5px;
`;

const ImageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 15px; /* Decreased margin */
`;

const RightSideImageIcon = styled.img`
    width: 120px; /* Adjusted size */
    height: auto;
`;

export default CarDetail;
