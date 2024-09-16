// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header';
import MainContent from './main';
import Signup from './Signup/Signup';
import Login from './Login/Login'; // Import your Login component
import CarDetail from './CarDetail/CarDetail'; // Import your CarDetail component
import NewCarDetail from './NewCarDetail/NewCarDetail'; // Import the NewCarDetail component
import PriceList from './PriceList/PriceList';
import Payment from './Payment/payment';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<MainContent />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/car-detail" element={<CarDetail />} /> {/* Add the CarDetail route */}
                    <Route path="/new-car-detail" element={<NewCarDetail />} /> {/* Add the NewCarDetail route */}
                    <Route path="/price-list" element={<PriceList/>}/>
                    <Route path="/payment" element={<Payment/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
