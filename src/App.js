import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header';
import MainContent from './main';
import Signup from './Signup/Signup';
import Login from './Login/Login'; 
import CarDetail from './CarDetail/CarDetail'; 
import PriceList from './PriceList/PriceList';
import Payment from './Payment/payment';
// import AdminLogin from './Admin/AdminLogin'; // Correct the import here
import Dashboard from "./UserDashboard/Dashboard"
import AdminPage from "./AdminPage/adminpage"

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
                    <Route path="/price-list" element={<PriceList />} />
                    <Route path="/payment" element={<Payment />} />
                    {/* <Route path="/admin-login" element={<AdminLogin />} /> Update the route here */}
                    <Route path="/Dashboard" element={<Dashboard />}/>
                    <Route path="/adminpage" element={<AdminPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
