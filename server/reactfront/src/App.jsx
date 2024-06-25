// App.jsx
import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import Navigation from './Navbar';
import Home from './Home';
import Group from './Groups';
import CurrencyConverter from './CurrencyConverter';
import Login from './Login';
import {setAuthToken} from './authAxios';
import Weather from "./Weather";


function App() {

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAuthToken(token);
        }
    }, []);

    return (
        <div>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/group" element={<Groups/>}/>
                <Route path="/currency" element={<CurrencyConverter/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/homepage" element={<Home/>}/>
                <Route path="/weather" element={<Weather/>}/>
            </Routes>
        </div>
    );

}

export default App;