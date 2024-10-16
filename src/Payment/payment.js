import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Payment = () => {
    const location = useLocation();
    const insurance = location.state?.insurance;

    const [name, setName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!name) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!/^\d{16}$/.test(cardNumber)) {
            newErrors.cardNumber = 'Card number must be 16 digits';
            isValid = false;
        }

        if (!expiryDate) {
            newErrors.expiryDate = 'Expiry date is required';
            isValid = false;
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            newErrors.cvv = 'CVV must be 3 or 4 digits';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handlePayment = () => {
        if (validateForm()) {
            alert('Payment Successful!');
        }
    };

    return (
        <Container>
            <ContentWrapper>
                <Form>
                    <FormLabel>Cardholder Name</FormLabel>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                    {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}

                    <FormLabel>Card Number</FormLabel>
                    <Input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="16-digit card number"
                        maxLength="16"
                    />
                    {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}

                    <FormLabel>Expiry Date</FormLabel>
                    <Input
                        type="month"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                    />
                    {errors.expiryDate && <ErrorMessage>{errors.expiryDate}</ErrorMessage>}

                    <FormLabel>CVV</FormLabel>
                    <Input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="3 or 4-digit CVV"
                        maxLength="4"
                    />
                    {errors.cvv && <ErrorMessage>{errors.cvv}</ErrorMessage>}

                    <PayButton onClick={handlePayment}>Pay Now</PayButton>
                </Form>
            </ContentWrapper>
        </Container>
    );
};

const Container = styled.div`
    padding: 20px;
    background-color: #f9f9f9;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ContentWrapper = styled.div`
    width: 100%;
    max-width: 600px; /* Set a max-width for the form to keep it compact */
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const LeftSide = styled.div`
    flex: 1;
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const RightSide = styled.div`
    flex: 1;
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const InsuranceSummary = styled.div`
    margin-bottom: 20px;
    text-align: left;
`;

const Price = styled.p`
    font-size: 20px;
    font-weight: bold;
    color: #333;
`;

const TermsAndConditions = styled.div`
    margin-top: 20px;
    h3 {
        font-size: 18px;
        margin-bottom: 10px;
    }
    p {
        font-size: 14px;
        color: #555;
        line-height: 1.6;
    }
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const FormLabel = styled.label`
    font-size: 14px;
    font-weight: bold;
`;

const Input = styled.input`
    padding: 10px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
`;

const PayButton = styled.button`
    padding: 15px;
    border: none;
    border-radius: 25px;
    background-color: #28a745;
    color: white;
    font-size: 16px;
    cursor: pointer;
    font-weight: bold;
    text-align: center;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #218838;
    }
`;

const ErrorMessage = styled.div`
    color: red;
    font-size: 12px;
`;

export default Payment;
