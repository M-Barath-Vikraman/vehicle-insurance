import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header';
import MainContent from './main';
import Signup from './Signup/Signup';
import Login from './Login/Login'; 
import CarDetail from './CarDetail/CarDetail'; 
import NewCarDetail from './NewCarDetail/NewCarDetail'; 
import PriceList from './PriceList/PriceList';
import Payment from './Payment/payment';
// import AdminLogin from './Admin/AdminLogin'; // Correct the import here

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<MainContent />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/car-detail" element={<CarDetail />} />
                    <Route path="/new-car-detail" element={<NewCarDetail />} />
                    <Route path="/price-list" element={<PriceList />} />
                    <Route path="/payment" element={<Payment />} />
                    {/* <Route path="/admin-login" element={<AdminLogin />} /> Update the route here */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
