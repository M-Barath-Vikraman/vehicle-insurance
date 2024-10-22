import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaCreditCard } from 'react-icons/fa';
import { SiPaytm } from 'react-icons/si';
import { FaGooglePay } from 'react-icons/fa';
import jsPDF from 'jspdf';
import axios from 'axios';
import './Payment.css'; // Import the CSS file

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
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({}); // State for error messages

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
        // Reset card fields
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setErrors({});
    };

    const handleUpiSelection = (option) => {
        setUpiOption(option);
        setNewUpiId(''); // Reset UPI ID input when UPI option is selected
    };

    const validateCardDetails = () => {
        const currentYear = new Date().getFullYear() % 100; // Last two digits of current year
        const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed

        let validationErrors = {};

        // Validate card number
        if (!/^\d{16}$/.test(cardNumber)) {
            validationErrors.cardNumber = "Card number must be 16 digits.";
        }

        // Validate expiry date
        const [expMonth, expYear] = expiryDate.split('/').map(Number);
        if (
            !expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/) || 
            (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth))
        ) {
            validationErrors.expiryDate = "Expiry date must be in MM/YY format and greater than the current date.";
        }

        // Validate CVV
        if (!/^\d{3}$/.test(cvv)) {
            validationErrors.cvv = "CVV must be 3 digits.";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0; // Return true if no errors
    };

    const handlePayment = async () => {
        if (!validateCardDetails()) {
            return; // Exit if validation fails
        }

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

    // Calculate total price with tax
    const premiumAmount = parseFloat(insurance?.Price.replace(/[^\d.-]/g, '')) || 5900;
    const tax = premiumAmount * 0.18;
    const totalPrice = premiumAmount + tax;

    return (
        <div className="payment-container">
            <div className="payment-left">
                <h3>Payment for {insurance?.Title}</h3>
                <p>Price: {insurance?.Price}</p>

                <h3>Select payment method</h3>
                <div className="payment-options">
                    {/* Credit/Debit/ATM Card Option */}
                    <div className="payment-option">
                        <div 
                            className="payment-option-header" 
                            onClick={() => handlePaymentSelection('Card')}
                        >
                            <div className="icon"><FaCreditCard /></div>
                            <div className="option-info">
                                <h4>Credit/Debit/ATM Card</h4>
                            </div>
                        </div>
                        {paymentMethod === 'Card' && (
                            <div className="card-details">
                                <h4>Enter Card Details</h4>
                                <input 
                                    type="text" 
                                    placeholder="Card Number" 
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)} 
                                />
                                {errors.cardNumber && <div className="error">{errors.cardNumber}</div>}
                                <div className="card-row">
                                    <input 
                                        type="text" 
                                        placeholder="Expiry (MM/YY)" 
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)} 
                                    />
                                    {errors.expiryDate && <div className="error">{errors.expiryDate}</div>}
                                    <input 
                                        type="text" 
                                        placeholder="CVV" 
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)} 
                                    />
                                    {errors.cvv && <div className="error">{errors.cvv}</div>}
                                </div>
                                <button onClick={handlePayment}>Pay ₹{totalPrice.toFixed(2)}</button>
                            </div>
                        )}
                    </div>

                    {/* UPI Option */}
                    <div className="payment-option">
                        <div 
                            className="payment-option-header" 
                            onClick={() => handlePaymentSelection('UPI')}
                        >
                            <div className="icon"><FaGooglePay /></div>
                            <div className="option-info">
                                <h4>UPI</h4>
                            </div>
                        </div>
                        {paymentMethod === 'UPI' && (
                            <div className="upi-options">
                                <h4>Select UPI option</h4>
                                <div className="upi-option">
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="upi" 
                                            checked={upiOption === 'ExistingUPI'}
                                            onChange={() => handleUpiSelection('ExistingUPI')}
                                        />
                                        Existing UPI ID
                                    </label>
                                    {upiOption === 'ExistingUPI' && (
                                        <input
                                            type="text"
                                            placeholder="Enter UPI ID"
                                            value={newUpiId}
                                            onChange={(e) => setNewUpiId(e.target.value)}
                                        />
                                    )}
                                </div>
                                <div className="upi-option">
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="upi" 
                                            checked={upiOption === 'NewUPI'}
                                            onChange={() => handleUpiSelection('NewUPI')}
                                        />
                                        New UPI ID
                                    </label>
                                    {upiOption === 'NewUPI' && (
                                        <input
                                            type="text"
                                            placeholder="Enter your new UPI ID"
                                            value={newUpiId}
                                            onChange={(e) => setNewUpiId(e.target.value)}
                                        />
                                    )}
                                </div>
                                <button onClick={handlePayment}>Pay ₹{totalPrice.toFixed(2)}</button>
                            </div>
                        )}
                    </div>

                    {/* Net Banking Option */}
                    <div className="payment-option">
                        <div 
                            className="payment-option-header" 
                            onClick={() => handlePaymentSelection('NetBanking')}
                        >
                            <div className="icon"><SiPaytm /></div>
                            <div className="option-info">
                                <h4>Net Banking</h4>
                            </div>
                        </div>
                        {paymentMethod === 'NetBanking' && (
                            <div className="netbanking-options">
                                <h4>Select your bank</h4>
                                <select 
                                    value={netBankingOption} 
                                    onChange={(e) => setNetBankingOption(e.target.value)}
                                >
                                    <option value="">Select Bank</option>
                                    <option value="HDFC">HDFC</option>
                                    <option value="ICICI">ICICI</option>
                                    <option value="SBI">SBI</option>
                                </select>
                                <button onClick={handlePayment}>Pay ₹{totalPrice.toFixed(2)}</button>
                            </div>
                        )}
                    </div>
                </div>
                <button onClick={handleContinue}>Get Bill</button>
            </div>

            {showBill && (
                <div className="payment-right">
                    <h3>Bill Summary</h3>
                    <p>Insurance: {insurance?.Title}</p>
                    <p>Price: {insurance?.Price}</p>
                    <p>Tax: ₹{tax.toFixed(2)}</p>
                    <p>Total Amount: ₹{totalPrice.toFixed(2)}</p>
                    <button onClick={downloadBill}>Download Bill</button>
                </div>
            )}
        </div>
    );
};

export default Payment;
