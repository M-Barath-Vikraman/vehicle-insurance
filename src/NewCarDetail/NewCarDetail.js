import React, { useState } from 'react';
import styled from 'styled-components';
import Logo from '../logo.png'; // Ensure this path is correct

const NewCarDetail = () => {
    const [carBrand, setCarBrand] = useState('');
    const [carName, setCarName] = useState('');
    const [carVariant, setCarVariant] = useState('');
    const [vehicleModelYear, setVehicleModelYear] = useState('');
    const [cc, setCc] = useState('');
    const [chassisNumber, setChassisNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [rtoCode, setRtoCode] = useState('');

    const handleSubmit = () => {
        // Implement form submission logic or navigation
        alert('Form submitted');
    };

    return (
        <Wrapper>
            <FormWrapper>
                <LogoContainer>
                    <LogoImage src={Logo} alt="Logo" />
                </LogoContainer>
                <Title>What Brand Is Your Car?</Title>
                <Form>
                    <FormGroup>
                        <FormField>
                            <FormLabel>Car Brand</FormLabel>
                            <Select value={carBrand} onChange={(e) => setCarBrand(e.target.value)}>
                                <option value="">Select Car Brand</option>
                                <option value="Toyota">Toyota</option>
                                <option value="Honda">Honda</option>
                                <option value="Ford">Ford</option>
                                <option value="BMW">BMW</option>
                                <option value="Audi">Audi</option>
                            </Select>
                        </FormField>
                        <FormField>
                            <FormLabel>Car Name</FormLabel>
                            <Select value={carName} onChange={(e) => setCarName(e.target.value)}>
                                <option value="">Select Car Name</option>
                                <option value="Corolla">Corolla</option>
                                <option value="Civic">Civic</option>
                                <option value="Mustang">Mustang</option>
                                <option value="X5">X5</option>
                                <option value="A4">A4</option>
                            </Select>
                        </FormField>
                    </FormGroup>
                    
                    <FormGroup>
                        <FormField>
                            <FormLabel>Car Variant</FormLabel>
                            <Select value={carVariant} onChange={(e) => setCarVariant(e.target.value)}>
                                <option value="">Select Car Variant</option>
                                <option value="Standard">Standard</option>
                                <option value="Sport">Sport</option>
                                <option value="Luxury">Luxury</option>
                            </Select>
                        </FormField>
                        <FormField>
                            <FormLabel>Vehicle Model Year</FormLabel>
                            <Select value={vehicleModelYear} onChange={(e) => setVehicleModelYear(e.target.value)}>
                                <option value="">Select Model Year</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
                            </Select>
                        </FormField>
                    </FormGroup>
                    
                    <FormGroup>
                        <FormField>
                            <FormLabel>CC of the Vehicle</FormLabel>
                            <Select value={cc} onChange={(e) => setCc(e.target.value)}>
                                <option value="">Select CC</option>
                                <option value="1000">1000 CC</option>
                                <option value="1500">1500 CC</option>
                                <option value="2000">2000 CC</option>
                                <option value="2500">2500 CC</option>
                                <option value="3000">3000 CC</option>
                            </Select>
                        </FormField>
                        <FormField>
                            <FormLabel>Chassis Number</FormLabel>
                            <Input type="text" value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} placeholder="Enter chassis number" />
                        </FormField>
                    </FormGroup>

                    <FormGroup>
                        <FormField>
                            <FormLabel>Phone Number</FormLabel>
                            <Input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter phone number" />
                        </FormField>
                        <FormField>
                            <FormLabel>RTO Code/City</FormLabel>
                            <Select value={rtoCode} onChange={(e) => setRtoCode(e.target.value)}>
                                <option value="">Select RTO Code/City</option>
                                <option value="TN01">TN01 - Chennai</option>
                                <option value="TN02">TN02 - Coimbatore</option>
                                <option value="MH01">MH01 - Mumbai</option>
                                <option value="DL01">DL01 - Delhi</option>
                                <option value="KA01">KA01 - Bangalore</option>
                            </Select>
                        </FormField>
                    </FormGroup>
                    
                    <ContinueButton onClick={handleSubmit}>Continue</ContinueButton>
                </Form>
            </FormWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f4;
`;

const FormWrapper = styled.div`
    position: relative;
    background-color: rgba(255, 255, 255, 0.8); /* Transparent white background */
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    width: 80%;
    max-width: 800px;
`;

const LogoContainer = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
`;

const LogoImage = styled.img`
    width: 80px; /* Increase the size of the logo */
    height: auto;
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 20px;
    color: #333;
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
`;

const FormGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
`;

const FormField = styled.div`
    display: flex;
    flex-direction: column;
    width: 48%; /* Adjust width for two fields per line */
    margin-right: 4%; /* Space between fields */

    &:last-of-type {
        margin-right: 0; /* Remove margin on the last field */
    }
`;

const FormLabel = styled.label`
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
    display: block;
`;

const Input = styled.input`
    padding: 10px;
    font-size: 14px;
    border-radius: 15px; /* Curved edges */
    border: 1px solid #ddd;
    width: 100%; /* Full width of the container */
    box-sizing: border-box;
`;

const Select = styled.select`
    padding: 10px;
    font-size: 14px;
    border-radius: 15px; /* Curved edges */
    border: 1px solid #ddd;
    width: 100%; /* Full width of the container */
    box-sizing: border-box;
`;

const ContinueButton = styled.button`
    padding: 8px 16px; /* Slightly smaller button */
    border: none;
    border-radius: 30px;
    background-color: #005BFF;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    align-self: center;

    &:hover {
        background-color: #0046A6;
    }
`;

export default NewCarDetail;
    