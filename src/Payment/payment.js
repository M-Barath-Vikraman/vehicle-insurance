import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaCreditCard } from 'react-icons/fa';
import { SiPaytm } from 'react-icons/si';
import { FaGooglePay } from 'react-icons/fa';
import jsPDF from 'jspdf';

const Payment = () => {
    const location = useLocation();
    const selectedInsurance = location.state?.insurance; // Retrieve selected policy

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
        if (selectedInsurance) {
            const policyEndDate = calculateEndDate();
            console.log('Selected Insurance:', selectedInsurance);
            console.log('Policy End Date:', policyEndDate);
        }
    }, [selectedInsurance]);

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

    const handleContinue = () => {
        // Show the bill when "Continue" is clicked
        setShowBill(true);
    };

    const downloadBill = () => {
        const doc = new jsPDF();

        // Add content to the PDF
        doc.setFontSize(16);
        doc.text(`Bill for Insurance: ${selectedInsurance?.Title}`, 10, 10);
        doc.text(`Price: ${selectedInsurance?.Price}`, 10, 20);
        doc.text(`Tax: ₹${(parseFloat(selectedInsurance.Price.replace(/[^\d.-]/g, '')) * 0.18).toFixed(2)}`, 10, 30);
        doc.text(`Total: ₹${(parseFloat(selectedInsurance.Price.replace(/[^\d.-]/g, '')) * 1.18).toFixed(2)}`, 10, 40);
        
        // Save the PDF
        doc.save('insurance_bill.pdf');
    };

    return (
        <PaymentContainer>
            <PaymentLeft>
                <h3>Payment for {selectedInsurance?.Title}</h3>
                <p>Price: {selectedInsurance?.Price}</p>

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
                                <button>Pay {selectedInsurance?.Price || 5900}</button>
                            </CardDetails>
                        )}
                    </PaymentOption>

                    {/* Net Banking Option */}
                    <PaymentOption>
                        <PaymentOptionHeader onClick={() => handlePaymentSelection('NetBanking')}>
                            <Icon><SiPaytm /></Icon>
                            <OptionInfo>
                                <h4>Net Banking</h4>
                            </OptionInfo>
                        </PaymentOptionHeader>
                        {paymentMethod === 'NetBanking' && (
                            <NetBankingDetails>
                                <h4>Select Your Bank</h4>
                                <BankButton onClick={() => setNetBankingOption('HDFC')}>HDFC Bank</BankButton>
                                <BankButton onClick={() => setNetBankingOption('ICICI')}>ICICI Bank</BankButton>
                                <BankButton onClick={() => setNetBankingOption('SBI')}>State Bank of India</BankButton>
                                <BankButton onClick={() => setNetBankingOption('Axis')}>Axis Bank</BankButton>
                                <BankButton onClick={() => setNetBankingOption('Kotak')}>Kotak Mahindra Bank</BankButton>
                                <BankButton onClick={() => setNetBankingOption('PNB')}>Punjab National Bank</BankButton>

                                {netBankingOption && (
                                    <div>
                                        <p>Selected Bank: {netBankingOption}</p>
                                        <button>Pay {selectedInsurance?.Price || 5900}</button>
                                    </div>
                                )}
                            </NetBankingDetails>
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
                                        <button>Pay {selectedInsurance?.Price || 5900}</button>
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
                        <span>{selectedInsurance?.Price}</span>
                    </Item>
                    <Item>
                        <span>Tax (18%)</span>
                        <span>
                            ₹{selectedInsurance?.Price 
                                ? (parseFloat(selectedInsurance.Price.replace(/[^\d.-]/g, '')) * 0.18).toFixed(2) 
                                : '900.00'}
                        </span>
                    </Item>
                    <Total>
                        <span>Total</span>
                        <span>
                            ₹{selectedInsurance?.Price 
                                ? (parseFloat(selectedInsurance.Price.replace(/[^\d.-]/g, '')) * 1.18).toFixed(2) 
                                : '900.00'}
                        </span>
                    </Total>
                </Summary>
                <ContinueButton onClick={handleContinue}>Continue</ContinueButton>

                {showBill && (
                    <BillContainer>
                        <h3>Bill</h3>
                        <p>Insurance Type: {selectedInsurance?.Title}</p>
                        <p>Price: {selectedInsurance?.Price}</p>
                        <p>Tax: ₹{selectedInsurance?.Price 
                            ? (parseFloat(selectedInsurance.Price.replace(/[^\d.-]/g, '')) * 0.18).toFixed(2) 
                            : '900.00'}
                        </p>
                        <p>Total: ₹{selectedInsurance?.Price 
                            ? (parseFloat(selectedInsurance.Price.replace(/[^\d.-]/g, '')) * 1.18).toFixed(2) 
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

