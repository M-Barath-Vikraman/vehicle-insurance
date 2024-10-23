import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const PriceList = () => {
    const location = useLocation();
    const { carNumber, carModel, brandName } = location.state || {};
    const [policies, setPolicies] = useState([]);
    const [selectedInsurance, setSelectedInsurance] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCarDetailsModal, setShowCarDetailsModal] = useState(false);
    const [carNum, setCarNumber] = useState('');
    const [carMod, setCarModel] = useState('');
    const [brand, setBrandName] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { isLoggin, name, email, phoneNumber } = location.state || {};

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/policies');
                setPolicies(response.data);
            } catch (error) {
                console.error('Error fetching policies:', error);
            }
        };

        fetchPolicies();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!carNum) newErrors.carNum = 'Car Number is required';
        if (!carMod) newErrors.carMod = 'Car Model is required';
        if (!brand) newErrors.brand = 'Brand Name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInsureClick = (insurance) => {
        setSelectedInsurance(insurance);
        setShowModal(true);
    };

    const handleCarDetailsSubmit = () => {
        if (validateForm()) {
            if (isLoggin) {
                navigate('/payment', {
                    state: {
                        insurance: selectedInsurance,
                        name,
                        email,
                        phoneNumber,
                        carNumber: carNum,
                        carModel: carMod,
                        brandName: brand,
                    },
                });
            }
            setShowCarDetailsModal(false);
        }
    };

    const handleAgree = () => {
        setShowModal(false);
        if (!carNumber || !carModel || !brandName) {
            setShowCarDetailsModal(true);
        } else {
            navigate('/login', {
                state: {
                    insurance: selectedInsurance,
                    carNumber: carNumber,
                    carModel: carModel,
                    brandName: brandName,
                },
            });
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setShowCarDetailsModal(false);
    };

    // Define the terms and conditions
    const termsAndConditions = `
        1. The insurance policies offered are subject to approval by the insurer.
        2. All claims are subject to the terms and conditions of the policy.
        3. The insured must provide true and accurate information at the time of purchase.
        4. Failure to provide accurate information may result in denial of claims.
        5. The insurer reserves the right to amend the terms of the policy at any time.
        6. Cancellation of the policy can be done within 15 days of purchase with a full refund.
        7. Policyholders must notify the insurer of any changes in circumstances that may affect the policy.
    `;

    return (
        <Container>
            <Title>Available Insurance Plans</Title>
            <InsuranceList>
                {policies.map((insurance, index) => (
                    <InsuranceItem key={index}>
                        <Details>
                            <InsuranceTitle>{insurance.Title}</InsuranceTitle>
                            <Description>{insurance.Description}</Description>
                        </Details>
                        <Price>{insurance.Price}</Price>
                        <InsureButton onClick={() => handleInsureClick(insurance)}>Insure</InsureButton>
                    </InsuranceItem>
                ))}
            </InsuranceList>

            {showModal && (
                <Modal>
                    <ModalContent>
                        <ModalTitle>Terms and Conditions</ModalTitle>
                        <ModalDescription>{termsAndConditions}</ModalDescription>
                        <ModalActions>
                            <AgreeButton onClick={handleAgree}>Agree</AgreeButton>
                            <CloseButton onClick={handleClose}>Close</CloseButton>
                        </ModalActions>
                    </ModalContent>
                </Modal>
            )}

            {showCarDetailsModal && (
                <Modal>
                    <ModalContent>
                        <ModalTitle>Enter Car Details</ModalTitle>
                        <ModalDescription>
                            <Form>
                                <Label>Car Number</Label>
                                <Input 
                                    type="text" 
                                    placeholder="Car Number" 
                                    value={carNum} 
                                    onChange={(e) => setCarNumber(e.target.value)} 
                                    required 
                                />
                                {errors.carNum && <Error>{errors.carNum}</Error>}

                                <Label>Car Model</Label>
                                <Input 
                                    type="text" 
                                    placeholder="Car Model" 
                                    value={carMod} 
                                    onChange={(e) => setCarModel(e.target.value)} 
                                    required 
                                />
                                {errors.carMod && <Error>{errors.carMod}</Error>}

                                <Label>Brand Name</Label>
                                <Input 
                                    type="text" 
                                    placeholder="Brand Name" 
                                    value={brand} 
                                    onChange={(e) => setBrandName(e.target.value)} 
                                    required 
                                />
                                {errors.brand && <Error>{errors.brand}</Error>}
                            </Form>
                        </ModalDescription>
                        <ModalActions>
                            <AgreeButton onClick={handleCarDetailsSubmit}>Submit</AgreeButton>
                            <CloseButton onClick={handleClose}>Close</CloseButton>
                        </ModalActions>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

// Styled Components
const Container = styled.div`
    padding: 20px;
    background-color: #f9f9f9;
    min-height: 100vh;
`;

const Title = styled.h1`
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
`;

const InsuranceList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const InsuranceItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px 20px;
    margin-bottom: 10px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: rgba(0, 123, 255, 0.1);
    }
`;

const Details = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    gap: 10px;
`;

const InsuranceTitle = styled.h2`
    font-size: 16px;
    margin: 0;
    font-weight: bold;
`;

const Description = styled.p`
    font-size: 14px;
    color: #555;
    margin: 0;
    align-self: center;
`;

const Price = styled.span`
    font-size: 16px;
    font-weight: bold;
    color: #28A745;
    background-color: #f1f1f1;
    padding: 5px 10px;
    border-radius: 10px;
    min-width: 70px;
    text-align: right;
    margin-right: 20px;
`;

const InsureButton = styled.button`
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    background-color: #005BFF;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0046A6;
    }
`;

// Modal styling
const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 400px;
`;

const ModalTitle = styled.h2`
    font-size: 20px;
    margin-bottom: 15px;
`;

const ModalDescription = styled.div`
    font-size: 14px;
    margin-bottom: 20px;
    white-space: pre-line; /* Preserve line breaks in the terms */
`;

const ModalActions = styled.div`
    display: flex;
    justify-content: space-around;
`;

const AgreeButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background-color: #28a745;
    color: white;
    cursor: pointer;
`;

const CloseButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background-color: #dc3545;
    color: white;
    cursor: pointer;
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
`;

const Input = styled.input`
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 14px;
`;

const Error = styled.span`
    color: red;
    font-size: 12px;
    margin-top: -10px;
`;

export default PriceList;
