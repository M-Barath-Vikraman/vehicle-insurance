import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaTrash, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const AdminPage = () => {
    const [policies, setPolicies] = useState([]);
    const [userPolicies, setUserPolicies] = useState([]); // State to store user policies
    const [formData, setFormData] = useState({ title: '', description: '', price: '', terms: '' });
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [activePage, setActivePage] = useState('user');
    const [clickedPolicy, setClickedPolicy] = useState(null);
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    // Fetch policies from the server
    const fetchPolicies = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/policies');
            const data = await response.json();
            setPolicies(data);
        } catch (error) {
            console.error('Error fetching policies:', error);
        }
    };

    // Fetch user policies from the server
    const fetchUserPolicies = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user-policies');
            const data = await response.json();
            console.log(data);
            setUserPolicies(data); // Store the fetched user policies
        } catch (error) {
            console.error('Error fetching user policies:', error);
        }
    };

    // Handle input changes for the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Define the UserDetailsSection component
    const UserDetailsSection = ({ userPolicies }) => {
        return (
            <div>
                <h2>User Policies</h2>
                {userPolicies.length > 0 ? (
                    <ul>
                        {userPolicies.map((policy, index) => (
                            <li key={index}>
                                <strong>Policy ID:</strong> {policy?.policyId || 'N/A'} <br />
                                <strong>Policy Name:</strong> {policy?.policyName || 'N/A'} <br />
                                <strong>Policy Holder:</strong> {policy?.policyHolder?.name || 'N/A'} <br />
                                <strong>Email:</strong> {policy?.policyHolder?.email || 'N/A'} <br />
                                <strong>Contact Number:</strong> {policy?.policyHolder?.contactNumber || 'N/A'} <br />
                                <strong>Vehicle Type:</strong> {policy?.vehicleDetails?.vehicleType || 'N/A'} <br />
                                <strong>Vehicle Number:</strong> {policy?.vehicleDetails?.vehicleNumber || 'N/A'} <br />
                                <strong>Model:</strong> {policy?.vehicleDetails?.model || 'N/A'} <br />
                                <strong>Policy Status:</strong> {policy?.policyStatus || 'N/A'}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No user policies available.</p>
                )}
            </div>
        );
    };

    // Add new policy
    // Add new policy
    const handleAddPolicy = async () => {
        const newPolicy = { ...formData };

        try {
            const response = await fetch('http://localhost:5000/api/policies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPolicy),
            });

            if (response.ok) {
                const addedPolicy = await response.json();
                // Add the new policy to the list
                setPolicies((prev) => [...prev, addedPolicy]);
                // Reset the form after successful addition
                resetForm();
            } else {
                const errorMessage = await response.text(); // Get error message from response
                console.error('Error adding policy:', errorMessage);
                alert(`Error adding policy: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error adding policy:', error);
            alert(`Error adding policy: ${error.message}`);
        }
    };


    // Delete selected policies
    // Delete selected policy
    const handleDeletePolicy = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this policy?');
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:5000/api/policies/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove the deleted policy from the list
                setPolicies((prev) => prev.filter((policy) => policy._id !== id));
                alert('Policy deleted successfully');
            } else {
                const errorMessage = await response.text();
                console.error('Error deleting policy:', errorMessage);
                alert(`Error deleting policy: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error deleting policy:', error);
            alert(`Error deleting policy: ${error.message}`);
        }
    };


    // Reset form data and close modal
    const resetForm = () => {
        setFormData({ title: '', description: '', price: '', terms: '' });
        setModalOpen(false);
        setSelectedPolicy(null);
    };

    // Handle pie chart click to show details of the clicked policy
    const handlePieClick = (policyName) => {
        const policy = userPolicies.find((p) => p.policyName === policyName);
        setSelectedPolicy(policy);
    };

    // Fetch policies or user policies based on activePage
    useEffect(() => {
        if (activePage === 'home') {
            fetchPolicies();
        } else if (activePage === 'user') {
            fetchUserPolicies(); // Fetch user policies when "User Details" is clicked
        }
    }, [activePage]);

    // Render PieChart (Doughnut chart now) when on the home page
    const countPolicies = () => {
        const policyCounts = userPolicies.reduce((acc, policy) => {
            acc[policy.policyName] = (acc[policy.policyName] || 0) + 1;
            return acc;
        }, {});
        return policyCounts;
    };

    // Render PieChart with the count of user policies
    const renderPieChart = () => {
        if (!userPolicies || userPolicies.length === 0) {
            return <p>No user policies available for chart</p>;
        }

        const policyCounts = countPolicies();
        const data = Object.keys(policyCounts).map((policyName, index) => {
            const policy = policies.find(p => p._id === policyName);
            return {
                name: policy?.Title || `${policyName}`, // Use policy name if available
                value: policyCounts[policyName], // Number of users with this policy
                color: COLORS[index % COLORS.length], // Cycle through colors
            };
        });

        return (
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={70}
                    fill="#8884d8"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        );
    };
    const ChartSection = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 400px;
    `;
    return (
        <Container>
            <Sidebar>
                <SidebarButton onClick={() => setActivePage('user')} active={activePage === 'user'}>
                    User Details
                </SidebarButton>
                <SidebarButton onClick={() => setActivePage('home')} active={activePage === 'home'}>
                    User's Choices
                </SidebarButton>
                <SidebarButton onClick={() => setActivePage('policy')} active={activePage === 'policy'}>
                    Policies
                </SidebarButton>
            </Sidebar>

            <Content>
                {activePage === 'home' && (
                    <ChartSection>
                        {renderPieChart()}
                    </ChartSection>
                )}

                {activePage === 'policy' && (
                    <>
                        <ButtonWrapper>
                            <ActionButton onClick={() => setModalOpen(true)} className="add-policy">
                                <FaPlus />
                            </ActionButton>
                        </ButtonWrapper>

                        <PolicyList>
                            <h2>Policies</h2>
                            {policies.map((policy) => (
                                <PolicyItem key={policy._id} onClick={() => handlePieClick(policy.Title)}>
                                    <PolicyTitle>
                                        <strong>{policy.Title}</strong>
                                    </PolicyTitle>
                                    <ActionButtons>
                                        <DeleteButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePolicy(policy._id);
                                            }}
                                        >
                                            <FaTrash />
                                        </DeleteButton>
                                    </ActionButtons>
                                </PolicyItem>
                            ))}
                        </PolicyList>

                        {isModalOpen && (
                            <ModalOverlay>
                                <ModalContent>
                                    <h2>Add Policy</h2>
                                    <InputField
                                        name="title"
                                        placeholder="Title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                    <InputField
                                        name="description"
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                    <InputField
                                        name="price"
                                        placeholder="Price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                    <InputField
                                        name="terms"
                                        placeholder="Terms"
                                        value={formData.terms}
                                        onChange={handleInputChange}
                                    />
                                    <ActionButton onClick={handleAddPolicy}>Add</ActionButton>
                                    <ActionButton onClick={resetForm}>Cancel</ActionButton>
                                </ModalContent>
                            </ModalOverlay>
                        )}
                    </>
                )}

                {activePage === 'user' && <UserDetailsSection userPolicies={userPolicies} />}
            </Content>
        </Container>
    );
};

// Styled components for AdminPage
const Container = styled.div`
    display: flex;
    height: 100vh;
`;

const Sidebar = styled.div`
    width: 200px;
    background-color: #f0f0f0;
    padding: 20px;
`;

const SidebarButton = styled.button`
    display: block;
    width: 100%;
    padding: 10px;
    background-color: ${(props) => (props.active ? '#0088FE' : 'transparent')};
    color: ${(props) => (props.active ? '#fff' : '#000')};
    border: none;
    margin-bottom: 10px;
    cursor: pointer;
    &:hover {
        background-color: #0088FE;
        color: white;
    }
`;

const Content = styled.div`
    flex: 1;
    padding: 20px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
`;

const ActionButton = styled.button`
    background-color: #0088fe;
    border: none;
    color: white;
    padding: 10px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background-color: #005f9e;
    }
`;

const DeleteButton = styled.button`
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    margin-left: 10px;
`;

const PolicyList = styled.div`
    display: flex;
    flex-direction: column;
`;

const PolicyItem = styled.div`
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
`;

const PolicyTitle = styled.div`
    flex: 1;
`;

const ActionButtons = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 4px;
`;

const InputField = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

export default AdminPage;
