import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';  // Use axios to make HTTP requests
import { useLocation } from 'react-router-dom';

const PriceList = () => {
    const location = useLocation();
    const { carNumber, carModel, brandName } = location.state || {}; 
    const [policies, setPolicies] = useState([]); // To store policies fetched from the server
    const [selectedInsurance, setSelectedInsurance] = useState(null); // To store the selected insurance for modal
    const [showModal, setShowModal] = useState(false); // To control modal visibility
    const navigate = useNavigate();

    // Fetch policies from the server when the component loads
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/policies');
                setPolicies(response.data); // Store fetched policies in the state
            } catch (error) {
                console.error('Error fetching policies:', error);
            }
        };

        fetchPolicies();
    }, []);

    const handleInsureClick = (insurance) => {
        setSelectedInsurance(insurance);
        setShowModal(true); // Show modal when user clicks "Insure"
    };

    const handleAgree = () => {
        setShowModal(false);
        console.log(selectedInsurance);
        navigate('/login', { 
            state: { 
                insurance: selectedInsurance,
                carNumber: carNumber,
                carModel: carModel,
                brandName: brandName
            } 
        }); // Navigate to login page with selected policy
    };
    

    const handleClose = () => {
        setShowModal(false);
    };

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
                        <ModalDescription>{selectedInsurance?.Terms}</ModalDescription>
                        <ModalActions>
                            <AgreeButton onClick={handleAgree}>Agree</AgreeButton>
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

const ModalDescription = styled.p`
    font-size: 14px;
    margin-bottom: 20px;
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

export default PriceList;
