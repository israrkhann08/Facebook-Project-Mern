import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import OtpVerifyxyz from './components/OtpVerify';
import Login from './components/Login';
import Profile from './components/Profile';
import Timeline from './components/Timeline';
import PasswordForget from './components/PasswordForget';
import AgainVerifyNewPassword from './components/AgainVerifyNewPassword';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/otp-verify" element={<OtpVerifyxyz />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/password-forget" element={<PasswordForget />} />
                <Route path="/newPassowrdSet" element={<AgainVerifyNewPassword />} />
                <Route path="/createPost" element={<CreatePost />} />
                <Route path="/updatePost" element={<EditPost />} />
               
            </Routes>
        </Router>
    );
}

export default App;
