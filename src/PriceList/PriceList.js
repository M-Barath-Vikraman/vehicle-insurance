import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PriceList = () => {
    const [selectedInsurance, setSelectedInsurance] = useState(null); // To store the selected insurance for modal
    const [showModal, setShowModal] = useState(false); // To control modal visibility
    const navigate = useNavigate();

    const insuranceOptions = [
        {
            title: 'Basic Coverage',
            description: 'Provides minimal protection, covering the essentials like liability and limited collision.',
            price: '₹2,000',
            terms: '1.This policy provides liability coverage for bodily injury and property damage to third parties, up to the specified limit.\n2.Coverage includes limited collision protection only for accidents where the insured vehicle is at fault.\n3.Damages caused by non-collision incidents, such as theft, fire, or natural disasters, are not covered under this policy.\n4.The insured driver must be at least 18 years old. Drivers under 25 years may be subject to additional premiums.\n5.The insured must hold a valid driver\'s license in the state or country where the vehicle is registered.\n6.This policy is only applicable to vehicles less than 10 years old. Older vehicles are excluded from collision protection.\n7.Coverage is only valid within the territorial limits of the country where the policy is issued. Driving outside this region voids the coverage.\n8.The policyholder is responsible for a deductible of ₹5000 for each claim made under the collision portion of the coverage.\n9.Policyholders who make no claims during the policy term will receive a discount on premium renewal.\n10.The policyholder may cancel the policy at any time. However, a 10% fee will be charged on the remaining premium amount.\n11.All claims must be reported within 48 hours of the accident. Late reporting may result in claim denial.\n12.Any attempt to file a fraudulent claim will result in the termination of the policy and legal action against the policyholder.\n13.Failure to pay premiums on the due date will result in the automatic suspension of the policy until full payment is received.\n14.The policy is valid for 1 year from the date of issuance and must be renewed before expiry for continuous coverage.\n15.This policy does not cover medical expenses or injuries sustained by passengers in the insured vehicle.\n'
        },
        {
            title: 'Standard Coverage',
            description: 'A balanced plan covering liability, collision, and theft protection with higher limits.',
            price: '₹4,500',
            terms: 'Terms and conditions for Standard Coverage...'
        },
        {
            title: 'Comprehensive Coverage',
            description: 'Offers extensive protection, covering non-collision incidents such as natural disasters, vandalism, and theft.',
            price: '₹7,000',
            terms: 'Terms and conditions for Comprehensive Coverage...'
        },
        {
            title: 'Third-Party Liability',
            description: 'Covers damages and injuries you cause to others in an accident.',
            price: '₹3,000',
            terms: 'Terms and conditions for Third-Party Liability...'
        },
        {
            title: 'Collision Coverage',
            description: 'Pays for repairs to your car after an accident, regardless of fault.',
            price: '₹5,500',
            terms: 'Terms and conditions for Collision Coverage...'
        },
        {
            title: 'Theft Protection',
            description: 'Covers your vehicle if it is stolen or damaged in an attempted theft.',
            price: '₹4,000',
            terms: 'Terms and conditions for Theft Protection...'
        },
        {
            title: 'Fire and Theft Coverage',
            description: 'Provides coverage if your car is damaged by fire or theft, but not from collision.',
            price: '₹3,500',
            terms: 'Terms and conditions for Fire and Theft Coverage...'
        },
        {
            title: 'Personal Injury Protection',
            description: 'Covers medical expenses and lost wages for you and your passengers, regardless of fault.',
            price: '₹6,000',
            terms: 'Terms and conditions for Personal Injury Protection...'
        },
        {
            title: 'Uninsured Motorist Coverage',
            description: 'Protects you if you’re hit by a driver with no insurance or insufficient coverage.',
            price: '₹4,500',
            terms: 'Terms and conditions for Uninsured Motorist Coverage...'
        },
        {
            title: 'Roadside Assistance',
            description: 'Offers services like towing, flat tire changes, and fuel delivery if you break down.',
            price: '₹1,500',
            terms: 'Terms and conditions for Roadside Assistance...'
        }
    ];

    const handleInsureClick = (insurance) => {
        setSelectedInsurance(insurance);
        setShowModal(true); // Show modal when user clicks "Insure"
    };

    const handleAgree = () => {
        setShowModal(false);
        navigate('/payment', { state: { insurance: selectedInsurance } });
    };

    const handleClose = () => {
        setShowModal(false);
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

            {showModal && (
                <Modal>
                    <ModalContent>
                        <ModalTitle>Terms and Conditions</ModalTitle>
                        <ModalDescription>{selectedInsurance?.terms}</ModalDescription>
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
