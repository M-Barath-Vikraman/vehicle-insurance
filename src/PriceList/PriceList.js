import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import styled from 'styled-components';

const PriceList = () => {
    const navigate = useNavigate(); // Initialize navigation hook

    const insuranceOptions = [
        {
            title: 'Basic Coverage',
            description: 'Covers liability and limited collision.',
            price: '₹2,000'
        },
        {
            title: 'Standard Coverage',
            description: 'Includes liability, collision, and theft protection.',
            price: '₹4,500'
        },
        {
            title: 'Comprehensive Coverage',
            description: 'Offers full protection, including natural disasters.',
            price: '₹7,000'
        },
        {
            title: 'Third-Party Liability',
            description: 'Covers damages you cause to others.',
            price: '₹3,000'
        },
        {
            title: 'Collision Coverage',
            description: 'Pays for repairs after an accident.',
            price: '₹5,500'
        },
        {
            title: 'Theft Protection',
            description: 'Covers your vehicle in case of theft.',
            price: '₹4,000'
        },
        {
            title: 'Fire and Theft Coverage',
            description: 'Covers fire and theft damages, excluding collisions.',
            price: '₹3,500'
        },
        {
            title: 'Personal Injury Protection',
            description: 'Covers medical expenses regardless of fault.',
            price: '₹6,000'
        },
        {
            title: 'Uninsured Motorist Coverage',
            description: 'Protects you against uninsured drivers.',
            price: '₹4,500'
        },
        {
            title: 'Roadside Assistance',
            description: 'Includes towing, flat tire changes, and more.',
            price: '₹1,500'
        }
    ];

    const handleInsureClick = (insurance) => {
        navigate('/payment', { state: { insurance } }); // to locate to payment page
    };

    return (
        <Container>
            <Title>Available Insurance Plans</Title>
            <InsuranceList>
                {insuranceOptions.map((insurance, index) => (
                    <InsuranceItem key={index}>
                        <Details>
                            <InsuranceTitle>{insurance.title}</InsuranceTitle>
                            <Description>{insurance.description}</Description>
                        </Details>
                        <Price>{insurance.price}</Price>
                        <InsureButton onClick={() => handleInsureClick(insurance)}>Insure</InsureButton>
                    </InsuranceItem>
                ))}
            </InsuranceList>
        </Container>
    );
};

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
    gap: 10px; /* Adds space between the title and description */
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
    min-width: 70px; /* Smaller price bar */
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

export default PriceList;
