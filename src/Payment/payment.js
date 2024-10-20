import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCreditCard } from 'react-icons/fa';
import { SiPaytm } from 'react-icons/si';
import { FaGooglePay } from 'react-icons/fa';

const Payment = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [upiOption, setUpiOption] = useState('');
    const [newUpiId, setNewUpiId] = useState('');
    const [netBankingOption, setNetBankingOption] = useState('');

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

    return (
        <PaymentContainer>
            <PaymentLeft>
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
                                <button>Pay ₹5,900</button>
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
                                        <button>Pay ₹5,900</button>
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
                                        <button>Pay ₹5,900</button>
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
                        <span>Car Insurance</span>
                        <span>₹5,000.00</span>
                    </Item>
                    <Item>
                        <span>Tax (18%)</span>
                        <span>₹900.00</span>
                    </Item>
                    <Total>
                        <span>Total</span>
                        <span>₹5,900.00</span>
                    </Total>
                </Summary>
                <ContinueButton>Continue</ContinueButton>
            </PaymentRight>
        </PaymentContainer>
    );
};

const PaymentContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
    background-color: #f9f9f9;
    gap: 20px;
`;

const PaymentLeft = styled.div`
    flex: 0.6;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PaymentOptions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const PaymentOption = styled.div`
    border: 2px solid #ddd;
    border-radius: 10px;
    transition: 0.3s;
    &:hover {
        border-color: #007bff;
        background-color: #f0f8ff;
    }
`;

const PaymentOptionHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    cursor: pointer;
`;

const Icon = styled.div`
    font-size: 30px;
    margin-right: 20px;
`;

const OptionInfo = styled.div`
    flex-grow: 1;
    h4 {
        margin: 0;
    }
    p {
        color: gray;
        margin: 5px 0 0 0;
    }
`;

const CardDetails = styled.div`
    padding: 15px;
    input {
        margin-top: 10px;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ddd;
        width: 100%;
    }
    button {
        margin-top: 10px;
        padding: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
            background-color: #0056b3;
        }
    }
`;

const CardRow = styled.div`
    display: flex;
    gap: 10px;
    input {
        flex: 1;
    }
`;

const NetBankingDetails = styled.div`
    padding: 15px;
`;

const BankButton = styled.button`
    display: block;
    margin-top: 10px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    width: 100%;
    &:hover {
        background-color: #0056b3;
    }
`;

const UpiOptions = styled.div`
    padding: 15px;
`;

const UpiOption = styled.div`
    margin-bottom: 10px;
    label {
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
    }
    input {
        margin-right: 10px;
    }
`;

const PaymentRight = styled.div`
    flex: 0.4;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Summary = styled.div`
    margin-top: 20px;
`;

const Item = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const Total = styled(Item)`
    font-weight: bold;
    font-size: 18px;
`;

const ContinueButton = styled.button`
    margin-top: 20px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    &:hover {
        background-color: #0056b3;
    }
`;

export default Payment;
