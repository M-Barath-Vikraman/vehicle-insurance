import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import styled from 'styled-components';

const PriceList = () => {
    const navigate = useNavigate(); // Initialize navigation hook

    const insuranceOptions = [
        {
            title: 'Basic Coverage',
            description: 'Provides minimal protection, covering the essentials like liability and limited collision.',
            price: '₹2,000'
        },
        {
            title: 'Standard Coverage',
            description: 'A balanced plan covering liability, collision, and theft protection with higher limits.',
            price: '₹4,500'
        },
        {
            title: 'Comprehensive Coverage',
            description: 'Offers extensive protection, covering non-collision incidents such as natural disasters, vandalism, and theft.',
            price: '₹7,000'
        },
        {
            title: 'Third-Party Liability',
            description: 'Covers damages and injuries you cause to others in an accident.',
            price: '₹3,000'
        },
        {
            title: 'Collision Coverage',
            description: 'Pays for repairs to your car after an accident, regardless of fault.',
            price: '₹5,500'
        },
        {
            title: 'Theft Protection',
            description: 'Covers your vehicle if it is stolen or damaged in an attempted theft.',
            price: '₹4,000'
        },
        {
            title: 'Fire and Theft Coverage',
            description: 'Provides coverage if your car is damaged by fire or theft, but not from collision.',
            price: '₹3,500'
        },
        {
            title: 'Personal Injury Protection',
            description: 'Covers medical expenses and lost wages for you and your passengers, regardless of fault.',
            price: '₹6,000'
        },
        {
            title: 'Uninsured Motorist Coverage',
            description: 'Protects you if you’re hit by a driver with no insurance or insufficient coverage.',
            price: '₹4,500'
        },
        {
            title: 'Roadside Assistance',
            description: 'Offers services like towing, flat tire changes, and fuel delivery if you break down.',
            price: '₹1,500'
        }
    ];

    const handleInsureClick = (insurance) => {
        navigate('/payment', { state: { insurance } });
    };

    return (
        <Container>
            <Title>Available Insurance Plans</Title>
            <InsuranceList>
                {insuranceOptions.map((insurance, index) => (
                    <InsuranceCard key={index}>
                        <InsuranceTitle>{insurance.title}</InsuranceTitle>
                        <Description>{insurance.description}</Description>
                        <Price>{insurance.price}</Price>
                        <InsureButton onClick={() => handleInsureClick(insurance)}>Insure</InsureButton>
                    </InsuranceCard>
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
`;

const InsuranceList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`;

const InsuranceCard = styled.div`
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 15px;
    width: 250px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
    position: relative;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 123, 255, 0.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    &:nth-child(odd) {
        background-color: rgba(0, 123, 255, 0.05);
    }

    &:nth-child(even) {
        background-color: rgba(40, 167, 69, 0.05);
    }
`;

const InsuranceTitle = styled.h2`
    font-size: 18px;
    margin-bottom: 10px;
`;

const Description = styled.p`
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
`;

const Price = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
`;

const InsureButton = styled.button`
    padding: 10px 20px;
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
