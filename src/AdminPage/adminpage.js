import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaTrash, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const AdminPage = () => {
    const [policies, setPolicies] = useState([]);
    const [userPolicies, setUserPolicies] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '', price: '', terms: '' });
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [activePage, setActivePage] = useState('user');
    const [clickedPolicy, setClickedPolicy] = useState(null);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    const fetchPolicies = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/policies');
            const data = await response.json();
            setPolicies(data);
        } catch (error) {
            console.error('Error fetching policies:', error);
        }
    };

    const fetchUserPolicies = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user-policies');
            const data = await response.json();
            setUserPolicies(data);
        } catch (error) {
            console.error('Error fetching user policies:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const UserDetailsSection = ({ userPolicies }) => {
        return (
            <UserPoliciesContainer>
                <h2>User Policies</h2>
                {userPolicies.length > 0 ? (
                    <PoliciesGrid>
                        {userPolicies.map((policy, index) => (
                            <PolicyCard key={index}>
                                <PolicyDetail>
                                    <strong>Policy ID:</strong> {policy?.policyId || 'N/A'}
                                </PolicyDetail>
                                <PolicyDetail>
                                    <strong>Policy Name:</strong> {policy?.policyName || 'N/A'}
                                </PolicyDetail>
                                <PolicyDetail>
                                    <strong>Policy Holder:</strong> {policy?.policyHolder?.name || 'N/A'}
                                </PolicyDetail>
                                <PolicyDetail>
                                    <strong>Email:</strong> {policy?.policyHolder?.email || 'N/A'}
                                </PolicyDetail>
                                <PolicyDetail>
                                    <strong>Contact Number:</strong> {policy?.policyHolder?.contactNumber || 'N/A'}
                                </PolicyDetail>
                                <PolicyDetail>
                                    <strong>Vehicle Type:</strong> {policy?.vehicleDetails?.vehicleType || 'N/A'}
                                </PolicyDetail>
                                <PolicyDetail>
                                    <strong>Vehicle Number:</strong> {policy?.vehicleDetails?.vehicleNumber || 'N/A'}
                                </PolicyDetail>
                                <PolicyDetail>
                                    <strong>Model:</strong> {policy?.vehicleDetails?.model || 'N/A'}
                                </PolicyDetail>
                                <PolicyDetail>
                                    <strong>Policy Status:</strong> {policy?.policyStatus || 'N/A'}
                                </PolicyDetail>
                            </PolicyCard>
                        ))}
                    </PoliciesGrid>
                ) : (
                    <p>No user policies available.</p>
                )}
            </UserPoliciesContainer>
        );
    };

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
                const errorMessage = await response.text();
                console.error('Error adding policy:', errorMessage);
                alert(`Error adding policy: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error adding policy:', error);
            alert(`Error adding policy: ${error.message}`);
        }
    };

    const handleDeletePolicy = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this policy?');
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:5000/api/policies/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
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

    const resetForm = () => {
        setFormData({ title: '', description: '', price: '', terms: '' });
        setModalOpen(false);
        setSelectedPolicy(null);
    };

    const handlePieClick = (policyName) => {
        const policy = userPolicies.find((p) => p.policyName === policyName);
        setSelectedPolicy(policy);
    };

    useEffect(() => {
        if (activePage === 'home') {
            fetchPolicies();
        } else if (activePage === 'user') {
            fetchUserPolicies();
        }
    }, [activePage]);

    const countPolicies = () => {
        const policyCounts = userPolicies.reduce((acc, policy) => {
            acc[policy.policyName] = (acc[policy.policyName] || 0) + 1;
            return acc;
        }, {});
        return policyCounts;
    };

    const renderPieChart = () => {
        if (!userPolicies || userPolicies.length === 0) {
            return <p>No user policies available for chart</p>;
        }

        const policyCounts = countPolicies();
        const data = Object.keys(policyCounts).map((policyName, index) => {
            const policy = policies.find(p => p._id === policyName);
            return {
                name: policy?.Title || `${policyName}`,
                value: policyCounts[policyName],
                color: COLORS[index % COLORS.length],
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
                {activePage === 'home' && <ChartSection>{renderPieChart()}</ChartSection>}

                {activePage === 'policy' && (
                    <>
                        <ButtonWrapper>
                            <ActionButton onClick={() => setModalOpen(true)} className="add-policy">
                                <FaPlus />
                            </ActionButton>
                        </ButtonWrapper>

                        <PolicyList>
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
                                    <ActionButton onClick={handleAddPolicy}>Add Policy</ActionButton>
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

// Styled components CSS

const Container = styled.div`
    display: flex;
    height: 100vh;
    width: 100%;
`;

const Sidebar = styled.div`
    width: 200px;
    background-color: #2c3e50;
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

const SidebarButton = styled.button`
    margin-bottom: 10px;
    padding: 10px;
    background-color: ${({ active }) => (active ? '#16a085' : '#34495e')};
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #16a085;
    }
`;

const Content = styled.div`
    flex: 1;
    padding: 20px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
`;

const ActionButton = styled.button`
    background-color: #16a085;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #1abc9c;
    }
`;

const PolicyList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const PolicyItem = styled.li`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #ecf0f1;
    margin-bottom: 10px;
    border-radius: 5px;
    cursor: pointer;
`;

const PolicyTitle = styled.div`
    font-weight: bold;
`;

const ActionButtons = styled.div`
    display: flex;
`;

const DeleteButton = styled.button`
    background-color: #e74c3c;
    color: #fff;
    padding: 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
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
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
`;

const InputField = styled.input`
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const UserPoliciesContainer = styled.div`
    padding: 20px;
    background-color: #f4f4f4;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const PoliciesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
`;

const PolicyCard = styled.div`
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
    }
`;

const PolicyDetail = styled.div`
    font-size: 14px;
    margin-bottom: 10px;

    & strong {
        color: #333;
        font-weight: 600;
    }
`;

export default AdminPage;
