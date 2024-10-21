import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const UserDashboard = () => {
  const navigate = useNavigate(); // Initialize the navigate hook

  // Simulated user data and policy list
  const [userName] = useState('John Doe');
  const [policies] = useState([
    {
      policyId: 'POLICY12345',
      policyHolder: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        contactNumber: '123-456-7890',
      },
      vehicleDetails: {
        type: 'Car',
        number: 'ABC-1234',
        model: 'Tesla Model 3',
      },
      coverageAmount: '$100,000',
      premiumAmount: '$1,200',
      startDate: '2023-01-01',
      endDate: '2024-01-01',
      policyStatus: 'Active',
    },
    {
      policyId: 'POLICY67890',
      policyHolder: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        contactNumber: '123-456-7890',
      },
      vehicleDetails: {
        type: 'Motorcycle',
        number: 'XYZ-5678',
        model: 'Harley Davidson',
      },
      coverageAmount: '$50,000',
      premiumAmount: '$800',
      startDate: '2022-05-15',
      endDate: '2023-05-15',
      policyStatus: 'Expired',
    },
  ]);

  // State to track which policy's details are visible
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);

  // Toggle the selected policy
  const togglePolicyDetails = (policyId) => {
    setSelectedPolicyId(selectedPolicyId === policyId ? null : policyId);
  };

  // Handle navigation to PriceList.js
  const goToPoliciesPage = () => {
    navigate('/price-list'); // Navigate to the correct path for PriceList.js
  };

  return (
    <DashboardWrapper>
      <DashboardContainer>
        <UserName>Welcome, {userName}</UserName>
        <PolicyList>
          {policies.map((policy) => (
            <PolicyCard key={policy.policyId}>
              <PolicyHeader onClick={() => togglePolicyDetails(policy.policyId)}>
                {policy.policyId}
              </PolicyHeader>
              {/* Only show details if this policy is selected */}
              {selectedPolicyId === policy.policyId && (
                <>
                  <PolicyDetail>
                    <strong>Policy Holder:</strong> {policy.policyHolder.name} <br />
                    <strong>Email:</strong> {policy.policyHolder.email} <br />
                    <strong>Contact:</strong> {policy.policyHolder.contactNumber}
                  </PolicyDetail>
                  <PolicyDetail>
                    <strong>Vehicle Type:</strong> {policy.vehicleDetails.type} <br />
                    <strong>Number:</strong> {policy.vehicleDetails.number} <br />
                    <strong>Model:</strong> {policy.vehicleDetails.model}
                  </PolicyDetail>
                  <PolicyDetail>
                    <strong>Coverage Amount:</strong> {policy.coverageAmount} <br />
                    <strong>Premium Amount:</strong> {policy.premiumAmount}
                  </PolicyDetail>
                  <PolicyDetail>
                    <strong>Start Date:</strong> {policy.startDate} <br />
                    <strong>End Date:</strong> {policy.endDate} <br />
                    <strong>Status:</strong> {policy.policyStatus}
                  </PolicyDetail>
                </>
              )}
            </PolicyCard>
          ))}
        </PolicyList>
        <PoliciesButton onClick={goToPoliciesPage}>Add Policy</PoliciesButton>
      </DashboardContainer>
    </DashboardWrapper>
  );
};

// Styled components for CSS
const DashboardWrapper = styled.div`
  background-color: #f4f4f9;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const DashboardContainer = styled.div`
  background-color: #ffffff;
  width: 80%;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserName = styled.h2`
  text-align: center;
  color: #4b0082;
  font-size: 2rem;
  margin-bottom: 30px;
`;

const PoliciesButton = styled.button`
  background-color: #4b0082;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
  display: block;

  &:hover {
    background-color: #6a0dad;
  }
`;

const PolicyList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  width: 100%; /* Ensure it spans the width of the container */
`;

const PolicyCard = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const PolicyHeader = styled.h3`
  color: #333;
  font-size: 1.25rem;
  margin-bottom: 10px;
  text-transform: uppercase;
  &:hover {
    color: #4b0082;
  }
`;

const PolicyDetail = styled.p`
  margin: 5px 0;
  color: #555;
  line-height: 1.5;
`;

export default UserDashboard;
