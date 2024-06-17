// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Groups from './Groups';
import CurrencyConverter from './CurrencyConverter';
import Login from './Login';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/currency" element={<CurrencyConverter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<Home />} /> 
      </Routes>
    </div>
  );
}

export default App;
