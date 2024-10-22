import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation to get passed state

const UserDashboard = () => {
  const [policies, setPolicies] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const location = useLocation(); // Access the state passed through navigate
  const { user } = location.state || {}; // Extract user details from location state
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && user.email) {
      fetchPolicies(user.email);
    }
  }, [user]);

  const fetchPolicies = async (email) => {
    try {
      const response = await fetch(`/api/user-policies/${email}`); // Replace with your backend API
      const data = await response.json();
  
      // Ensure the response is an array
      if (Array.isArray(data)) {
        setPolicies(data); // Set policies only if the response is an array
      } else {
        console.error('Unexpected data format, expected an array:', data);
        setPolicies([]); // Reset policies to an empty array if data is not valid
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
      setPolicies([]); // Handle error by resetting policies to an empty array
    }
  };
  

  const togglePolicyDetails = (policyId) => {
    setSelectedPolicyId(selectedPolicyId === policyId ? null : policyId);
  };

  const goToPoliciesPage = () => {
    navigate('/price-list', { 
      state: { 
        isLoggin: true,
        name: user?.name,
        email: user?.email,
        phoneNumber: user?.phoneNumber
      } 
    });
  };

  return (
    <DashboardWrapper>
      <DashboardContainer>
        <UserName>Welcome, {user?.name || 'User'}</UserName>
        <PolicyList>
          {policies.map((policy) => (
            <PolicyCard key={policy.policyId}>
              <PolicyHeader onClick={() => togglePolicyDetails(policy.policyId)}>
                {policy.policyId}
              </PolicyHeader>
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
