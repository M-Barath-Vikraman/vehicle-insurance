import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaCreditCard } from 'react-icons/fa';
import { SiPaytm } from 'react-icons/si';
import { FaGooglePay } from 'react-icons/fa';
import jsPDF from 'jspdf';
import axios from 'axios';


const Payment = () => {
    const location = useLocation();
    const { 
        insurance, 
        name, 
        email, 
        phoneNumber, 
        carNumber,
        carModel, 
        brandName 
    } = location.state || {}; // Retrieve selected policy

    const [paymentMethod, setPaymentMethod] = useState('');
    const [upiOption, setUpiOption] = useState('');
    const [newUpiId, setNewUpiId] = useState('');
    const [netBankingOption, setNetBankingOption] = useState('');
    const [showBill, setShowBill] = useState(false); // State to show bill

    const calculateEndDate = () => {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1); // Add 1 year for policy end date
        return currentDate.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
    };

    useEffect(() => {
        if (insurance) {
            const policyEndDate = calculateEndDate();
            console.log('Selected Insurance:', insurance);
            console.log('Policy End Date:', policyEndDate);
        }
    }, [insurance]);

    const handlePaymentSelection = (method) => {
        setPaymentMethod(method);
        setUpiOption('');
        setNewUpiId('');
        setNetBankingOption('');
    };

    const handleUpiSelection = (option) => {
        setUpiOption(option);
        setNewUpiId(''); // Reset UPI ID input when UPI option is selected
    };

    const handlePayment = async () => {
        try {
            const premiumAmount = parseFloat(insurance?.Price.replace(/[^\d.-]/g, '')) || 5900;
            console.log('Name:', name);
            console.log('Phone Number:', phoneNumber);
            console.log('Email:', email);

            // Prepare the policy data
            const policyData = {
                policyName: insurance.Title,
                policyHolder: {
                    name: name,
                    email: email,
                    contactNumber: phoneNumber,
                },
                vehicleDetails: {
                    vehicleType: brandName,
                    vehicleNumber: carNumber,
                    model: carModel,
                },
                premiumAmount
            };

            // Make API request to save the policy
            const response = await axios.post('http://localhost:5000/create-policy', policyData);

            if (response.status === 201) {
                console.log('Policy created successfully', response.data.policy);
                alert('Payment successful! Policy created.');
            } else {
                console.log('Failed to create policy');
            }
        } catch (error) {
            console.error('Error during payment', error);
            alert('Payment failed. Please try again.');
        }
    };

    const handleContinue = () => {
        // Show the bill when "Continue" is clicked
        setShowBill(true);
    };

    const downloadBill = () => {
        const doc = new jsPDF();

        // Add content to the PDF
        doc.setFontSize(16);
        doc.text(`Bill for Insurance: ${insurance?.Title}`, 10, 10);
        doc.text(`Price: ${insurance?.Price}`, 10, 20);
        doc.text(`Tax: ₹${(parseFloat(insurance.Price.replace(/[^\d.-]/g, '')) * 0.18).toFixed(2)}`, 10, 30);
        doc.text(`Total: ₹${(parseFloat(insurance.Price.replace(/[^\d.-]/g, '')) * 1.18).toFixed(2)}`, 10, 40);
        
        // Save the PDF
        doc.save('insurance_bill.pdf');
    };

    return (
        <PaymentContainer>
            <PaymentLeft>
                <h3>Payment for {insurance?.Title}</h3>
                <p>Price: {insurance?.Price}</p>

                <h3>Select payment method</h3>
                <PaymentOptions>
                    {/* Credit/Debit/ATM Card Option */}
                    <PaymentOption>
                        <PaymentOptionHeader onClick={() => handlePaymentSelection('Card')}>
                            <Icon><FaCreditCard /></Icon>
                            <OptionInfo>
                                <h4>Credit/Debit/ATM Card</h4>
                            </OptionInfo>
                        </PaymentOptionHeader>
                        {paymentMethod === 'Card' && (
                            <CardDetails>
                                <h4>Enter Card Details</h4>
                                <input type="text" placeholder="Card Number" />
                                <CardRow>
                                    <input type="text" placeholder="Expiry (MM/YY)" />
                                    <input type="text" placeholder="CVV" />
                                </CardRow>
                                <button onClick={handlePayment}>Pay {insurance?.Price || 5900}</button>
                            </CardDetails>
                        )}
                    </PaymentOption>

                    {/* UPI Option */}
                    <PaymentOption>
                        <PaymentOptionHeader onClick={() => handlePaymentSelection('UPI')}>
                            <Icon><FaGooglePay /></Icon>
                            <OptionInfo>
                                <h4>UPI</h4>
                                <p>Google Pay, Paytm, or Add UPI ID</p>
                            </OptionInfo>
                        </PaymentOptionHeader>
                        {paymentMethod === 'UPI' && (
                            <UpiOptions>
                                <h4>Select UPI Option</h4>
                                <UpiOption>
                                    <label>
                                        <input
                                            type="radio"
                                            name="upi"
                                            value="GooglePay"
                                            checked={upiOption === 'GooglePay'}
                                            onChange={() => handleUpiSelection('GooglePay')}
                                        />
                                        Google Pay
                                    </label>
                                </UpiOption>
                                <UpiOption>
                                    <label>
                                        <input
                                            type="radio"
                                            name="upi"
                                            value="Paytm"
                                            checked={upiOption === 'Paytm'}
                                            onChange={() => handleUpiSelection('Paytm')}
                                        />
                                        Paytm
                                    </label>
                                </UpiOption>
                                <UpiOption>
                                    <label>
                                        <input
                                            type="radio"
                                            name="upi"
                                            value="AddUPI"
                                            checked={upiOption === 'AddUPI'}
                                            onChange={() => handleUpiSelection('AddUPI')}
                                        />
                                        Add New UPI ID
                                    </label>
                                </UpiOption>

                                {(upiOption === 'GooglePay' || upiOption === 'Paytm' || upiOption === 'AddUPI') && (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Enter UPI ID"
                                            value={newUpiId}
                                            onChange={(e) => setNewUpiId(e.target.value)}
                                        />
                                        <button onClick={handlePayment}>Pay {insurance?.Price || 5900}</button>
                                    </div>
                                )}
                            </UpiOptions>
                        )}
                    </PaymentOption>
                </PaymentOptions>
            </PaymentLeft>


            <PaymentRight>
                <h3>Payment Summary</h3>
                <Summary>
                    <Item>
                        <span>Insurance</span>
                        <span>{insurance?.Price}</span>
                    </Item>
                    <Item>
                        <span>Tax (18%)</span>
                        <span>
                            ₹{insurance?.Price 
                                ? (parseFloat(insurance.Price.replace(/[^\d.-]/g, '')) * 0.18).toFixed(2) 
                                : '900.00'}
                        </span>
                    </Item>
                    <Total>
                        <span>Total</span>
                        <span>
                            ₹{insurance?.Price 
                                ? (parseFloat(insurance.Price.replace(/[^\d.-]/g, '')) * 1.18).toFixed(2) 
                                : '900.00'}
                        </span>
                    </Total>
                </Summary>
                <ContinueButton onClick={handleContinue}>Continue</ContinueButton>

                {showBill && (
                    <BillContainer>
                        <h3>Bill</h3>
                        <p>Insurance Type: {insurance?.Title}</p>
                        <p>Price: {insurance?.Price}</p>
                        <p>Tax: ₹{insurance?.Price 
                            ? (parseFloat(insurance.Price.replace(/[^\d.-]/g, '')) * 0.18).toFixed(2) 
                            : '900.00'}
                        </p>
                        <p>Total: ₹{insurance?.Price 
                            ? (parseFloat(insurance.Price.replace(/[^\d.-]/g, '')) * 1.18).toFixed(2) 
                            : '900.00'}
                        </p>
                        <DownloadButton onClick={downloadBill}>Download Bill</DownloadButton>
                    </BillContainer>
                )}
            </PaymentRight>
        </PaymentContainer>
    );
};
// Styled Components
const PaymentContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
`;

const PaymentLeft = styled.div`
    flex: 2;
    padding-right: 20px;
`;

const PaymentRight = styled.div`
    flex: 1;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 5px;
`;

const PaymentOptions = styled.div`
    margin-top: 20px;
`;

const PaymentOption = styled.div`
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
`;

const PaymentOptionHeader = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`;

const Icon = styled.div`
    margin-right: 10px;
    font-size: 20px;
`;

const OptionInfo = styled.div``;

const CardDetails = styled.div``;

const CardRow = styled.div`
    display: flex;
    justify-content: space-between;
`;

const NetBankingDetails = styled.div``;

const UpiOptions = styled.div``;

const UpiOption = styled.div`
    margin: 5px 0;
`;

const BankButton = styled.button`
    margin: 5px 0;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #45a049;
    }
`;

const Summary = styled.div`
    margin-top: 20px;
`;

const Item = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
`;

const Total = styled.div`
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    padding: 10px 0;
`;

const ContinueButton = styled.button`
    margin-top: 10px;
    padding: 10px;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #1976d2;
    }
`;

const BillContainer = styled.div`
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
`;

const DownloadButton = styled.button`
    margin-top: 10px;
    padding: 10px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #e53935;
    }
`;


export default Payment;

