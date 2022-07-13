import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


import { app } from "./firebase-config";

import * as auth from "firebase/auth";

import LandingPage from "./LandingPage";
import BusinessLogin from "./BusinessLogin";
import BusinessRegistration from "./BusinessRegistration";
import BusinessOnboarding from "./BusinessOnboarding";
import MigrateBusinessOnboarding from './MigrateBusinessOnboarding';
import BusinessDashboard from './BusinessDashboard';
import MigrateBusinessDashboard from './MigrateBusinessDashboard';
import UIPG from './UIPG';

function App() {
    let navigate = useNavigate();

    useEffect(() => {
        // auth.onAuthStateChanged(auth.getAuth(), (currentUser) => {
        //     if(currentUser){
        //         navigate('/dashboard');
        //     }
        // });
    }, [])

    return (
        <Routes>
            <Route path='/' element={<LandingPage/>}/>                    
            <Route path='/login' element={<BusinessLogin/>}/>
            <Route path='/register' element={<BusinessRegistration/>}/>     
            <Route path='/onboarding' element={<MigrateBusinessOnboarding/>}/>     
            <Route path='/dashboard' element={<MigrateBusinessDashboard/>}/>                                   
        </Routes>
    );
}

export default App;
