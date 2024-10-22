import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const AdminPage = () => {
    const [policies, setPolicies] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '', price: '', terms: '' });
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null); // For showing selected policy details
    const [activePage, setActivePage] = useState('home');
    const [clickedPolicy, setClickedPolicy] = useState(null); // Track the clicked policy for pie chart

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

    // Handle input changes for the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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
                setPolicies((prev) => [...prev, addedPolicy]);
                resetForm();
            }
        } catch (error) {
            console.error('Error adding policy:', error);
        }
    };

    // Delete selected policies
    const handleDeletePolicy = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this policy?');
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:5000/api/policies/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setPolicies((prev) => prev.filter((policy) => policy._id !== id));
            } else {
                console.error('Error deleting policy:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting policy:', error);
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
        const policy = policies.find((p) => p.Title === policyName);
        setClickedPolicy(policyName); // Set the clicked policy name
        setSelectedPolicy(policy); // Set the selected policy object for details display
    };

    // Fetch policies when "Home" is clicked
    useEffect(() => {
        if (activePage === 'home') {
            fetchPolicies();
        }
    }, [activePage]);

    // Render PieChart (Doughnut chart now) when on the home page
    const renderPieChart = () => {
        if (!policies || policies.length === 0) {
            return <p>No policies available</p>;
        }

        const data = policies.map((policy, index) => ({
            name: policy.Title,
            value: 100 / policies.length,
            color: COLORS[index % COLORS.length],
        }));

        return (
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={70} // Added to make it a doughnut chart
                    fill="#8884d8"
                    onClick={(data) => handlePieClick(data.name)} // Show details on click
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        );
    };

    return (
        <Container>
            <Sidebar>
                <SidebarButton onClick={() => setActivePage('home')} active={activePage === 'home'}>
                    Home
                </SidebarButton>
                <SidebarButton onClick={() => setActivePage('policy')} active={activePage === 'policy'}>
                    Policies
                </SidebarButton>
                <SidebarButton onClick={() => setActivePage('user')} active={activePage === 'user'}>
                    User Details
                </SidebarButton>
            </Sidebar>

            <Content>
                {activePage === 'home' && (
                    <ChartSection>
                        {renderPieChart()} {/* Render the doughnut chart */}
                        {selectedPolicy && (
                            <PolicyDetails>
                                <h3>{selectedPolicy.Title}</h3>
                                <p><strong>Description:</strong> {selectedPolicy.Description}</p>
                                <p><strong>Price:</strong> {selectedPolicy.Price}</p>
                                <p><strong>Terms:</strong> {selectedPolicy.Terms}</p>
                            </PolicyDetails>
                        )}
                    </ChartSection>
                )}

                {activePage === 'policy' && (
                    <>
                        <ButtonWrapper>
                            <ActionButton onClick={() => setModalOpen(true)} className="add-policy">
                                <FaPlus /> {/* Only icon shown */}
                            </ActionButton>
                        </ButtonWrapper>

                        <PolicyList>
                            <h2>Policies</h2>
                            {policies.map((policy) => (
                                <PolicyItem key={policy._id} onClick={() => handlePieClick(policy.Title)}>
                                    <PolicyTitle>
                                        <strong>{policy.Title}</strong> {/* Display only policy name */}
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
                            <Modal>
                                <ModalContent>
                                    <h2>Add Policy</h2>
                                    <InputField name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} />
                                    <InputField name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
                                    <InputField name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} />
                                    <InputField name="terms" placeholder="Terms" value={formData.terms} onChange={handleInputChange} />
                                    <SubmitButton onClick={handleAddPolicy}>Add Policy</SubmitButton>
                                    <CloseButton onClick={resetForm}>Close</CloseButton>
                                </ModalContent>
                            </Modal>
                        )}
                    </>
                )}

                {activePage === 'user' && <h2>User Details Section</h2>}
            </Content>
        </Container>
    );
};

// Styled components
const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const Sidebar = styled.div`
    background-color: #333;
    padding: 20px;
    width: 250px;
    display: flex;
    flex-direction: column;
`;

const SidebarButton = styled.button`
    background-color: ${({ active }) => (active ? '#4caf50' : 'transparent')};
    color: white;
    border: none;
    padding: 15px 20px;
    margin-bottom: 10px;
    border-radius: 5px;
    cursor: pointer;
    text-align: left;
    &:hover {
        background-color: #4caf50;
    }
`;

const Content = styled.div`
    flex-grow: 1;
    padding: 20px;
    background-color: #f8f8f8;
`;

const ChartSection = styled.div`
    display: flex;
    justify-content: space-between;
`;

const PolicyDetails = styled.div`
    background-color: #fff;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 300px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const ActionButton = styled.button`
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    &:hover {
        background-color: #45a049;
    }
`;

const PolicyList = styled.div`
    margin-top: 20px;
`;

const PolicyItem = styled.div`
    background-color: #fff;
    padding: 15px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
`;

const PolicyTitle = styled.div``;

const ActionButtons = styled.div``;

const DeleteButton = styled.button`
    background-color: red;
    color: white;
    border: none;
    padding: 8px 10px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: darkred;
    }
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 500px;
`;

const InputField = styled.input`
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 5px;
    border: 1px solid #ddd;
`;

const SubmitButton = styled.button`
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
    &:hover {
        background-color: #45a049;
    }
`;

const CloseButton = styled.button`
    background-color: red;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: darkred;
    }
`;

export default AdminPage;
