import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaTrash, FaPlus } from 'react-icons/fa';

// AdminPage Component
const AdminPage = () => {
    const [policies, setPolicies] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '', price: '', terms: '' });
    const [isModalOpen, setModalOpen] = useState(false); // For modal visibility
    const [selectedPolicy, setSelectedPolicy] = useState(null); // For showing selected policy details

    // Fetch policies from the server
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/policies');
                const data = await response.json();
                setPolicies(data);
            } catch (error) {
                console.error('Error fetching policies:', error);
            }
        };

        fetchPolicies();
    }, []);

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
        if (!confirmed) return; // Exit if the user cancels

        try {
            const response = await fetch(`http://localhost:5000/api/policies/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setPolicies((prev) => prev.filter((policy) => policy._id !== id));
            } else {
                console.error('Error deleting policy:', response.statusText); // Error handling
            }
        } catch (error) {
            console.error('Error deleting policy:', error);
        }
    };

    // Reset form data and close modal
    const resetForm = () => {
        setFormData({ title: '', description: '', price: '', terms: '' });
        setModalOpen(false); // Close modal after adding
        setSelectedPolicy(null); // Reset selected policy
    };

    // Handle policy selection to view details
    const handlePolicyClick = (policy) => {
        setSelectedPolicy(policy);
    };

    return (
        <AdminWrapper>
            <ButtonWrapper>
                <ActionButton onClick={() => { setModalOpen(true); }} className="add-policy">
                    <FaPlus /> {/* Only icon shown */}
                </ActionButton>
            </ButtonWrapper>

            <PolicyList>
                <h2>Policies</h2>
                {policies.map((policy) => (
                    <PolicyItem key={policy._id} onClick={() => handlePolicyClick(policy)}>
                        <PolicyTitle>
                            <strong>{policy.Title}</strong> {/* Display only policy name */}
                        </PolicyTitle>
                        <ActionButtons>
                            <DeleteButton onClick={(e) => { e.stopPropagation(); handleDeletePolicy(policy._id); }}>
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
                        <SubmitButton onClick={handleAddPolicy}>
                            Add Policy
                        </SubmitButton>
                        <CloseButton onClick={resetForm}>Close</CloseButton>
                    </ModalContent>
                </Modal>
            )}

            {/* Display selected policy details */}
            {selectedPolicy && (
                <DetailsModal>
                    <DetailsContent>
                        <h3>{selectedPolicy.Title}</h3>
                        <p><strong>Description:</strong> {selectedPolicy.Description}</p>
                        <p><strong>Price:</strong> {selectedPolicy.Price}</p>
                        <p><strong>Terms:</strong> {selectedPolicy.Terms}</p>
                        <CloseButton onClick={() => setSelectedPolicy(null)}>Close</CloseButton>
                    </DetailsContent>
                </DetailsModal>
            )}
        </AdminWrapper>
    );
};

// Styled components for CSS
const AdminWrapper = styled.div`
    padding: 20px;
    background-color: #f8f8f8;
    min-height: 100vh;
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
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
        background: #f1f1f1;
    }
`;

const PolicyTitle = styled.div`
    font-weight: bold;
`;

const ActionButtons = styled.div`
    display: flex;
    align-items: center;
`;

const DeleteButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
`;

const InputField = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const SubmitButton = styled.button`
    background: #4caf50;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    &:hover {
        background: #45a049;
    }
`;

const CloseButton = styled.button`
    background: #f44336;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
    &:hover {
        background: #e53935;
    }
`;

const DetailsModal = styled(Modal)``;

const DetailsContent = styled(ModalContent)`
    width: 400px;
`;

export default AdminPage;
