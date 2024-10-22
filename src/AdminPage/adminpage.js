import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const AdminPage = () => {
    const [policies, setPolicies] = useState([]);
    const [userPolicies, setUserPolicies] = useState([]); // State to store user policies
    const [formData, setFormData] = useState({ title: '', description: '', price: '', terms: '' });
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [activePage, setActivePage] = useState('home');
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
                                
                                {/* Policy Holder Details */}
                                <strong>Policy Holder:</strong> {policy?.policyHolder?.name || 'N/A'} <br />
                                <strong>Email:</strong> {policy?.policyHolder?.email || 'N/A'} <br />
                                <strong>Contact Number:</strong> {policy?.policyHolder?.contactNumber || 'N/A'} <br />
                                
                                {/* Vehicle Details */}
                                <strong>Vehicle Type:</strong> {policy?.vehicleDetails?.vehicleType || 'N/A'} <br />
                                <strong>Vehicle Number:</strong> {policy?.vehicleDetails?.vehicleNumber || 'N/A'} <br />
                                <strong>Model:</strong> {policy?.vehicleDetails?.model || 'N/A'} <br />
                                <strong>Coverage Amount:</strong> {policy?.vehicleDetails?.coverageAmount || 'N/A'} <br />
                                <strong>Premium Amount:</strong> {policy?.vehicleDetails?.premiumAmount || 'N/A'} <br />
                                <strong>Start Date:</strong> {policy?.vehicleDetails?.startDate ? new Date(policy.vehicleDetails.startDate).toLocaleDateString() : 'N/A'} <br />
                                <strong>End Date:</strong> {policy?.vehicleDetails?.endDate ? new Date(policy.vehicleDetails.endDate).toLocaleDateString() : 'N/A'} <br />
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
            } else {
                console.error('Error adding policy:', response.statusText);
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
        setClickedPolicy(policyName);
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
                    innerRadius={70}
                    fill="#8884d8"
                    onClick={(data) => handlePieClick(data.name)}
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
                        {renderPieChart()}
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
                            <Modal>
                                <ModalContent>
                                    <h2>Add Policy</h2>
                                    <InputField name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} />
                                    <InputField name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
                                    <InputField name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} />
                                    <InputField name="terms" placeholder="Terms" value={formData.terms} onChange={handleInputChange} />
                                    <ActionButton onClick={handleAddPolicy}>Add</ActionButton>
                                    <ActionButton onClick={resetForm}>Cancel</ActionButton>
                                </ModalContent>
                            </Modal>
                        )}
                    </>
                )}

                {activePage === 'user' && <UserDetailsSection userPolicies={userPolicies} />}
            </Content>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
`;

const Sidebar = styled.div`
    width: 200px;
    background-color: #f0f0f0;
    padding: 20px;
`;

const SidebarButton = styled.button`
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    background-color: ${(props) => (props.active ? '#d0d0d0' : 'transparent')};
    border: none;
    cursor: pointer;
`;

const Content = styled.div`
    flex: 1;
    padding: 20px;
`;

const ChartSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PolicyDetails = styled.div`
    margin-top: 20px;
`;

const PolicyList = styled.div`
    margin-top: 20px;
`;

const PolicyItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border: 1px solid #ccc;
    margin: 5px 0;
    cursor: pointer;
`;

const PolicyTitle = styled.div`
    flex: 1;
`;

const ActionButtons = styled.div`
    display: flex;
    align-items: center;
`;

const DeleteButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    color: red;
`;

const ActionButton = styled.button`
    margin: 5px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const InputField = styled.input`
    width: 100%;
    padding: 10px;
    margin: 5px 0;
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 5px;
`;

export default AdminPage;
