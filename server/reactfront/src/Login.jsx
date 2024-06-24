import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import authAxios, { setAuthToken } from './authAxios';
import {useNavigate} from "react-router-dom";
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Username and password cannot be empty.");
      return;
    }

    try {
      const response = await axios.post('/users/login', { username, password });

      if (response.status === 200) {
        setAuthToken(response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        document.cookie = `accessToken=${response.data.accessToken};path=/;`;
        navigate('/homepage');
      } else {
        throw new Error('Login failed.');
      }
    } catch (error) {
      alert("Login failed. Error: " + error.message);
    }

    //const response1 = await authAxios.get("http://localhost:3000/homepage");

  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Username and password cannot be empty.");
      return;
    }

    try {
      const response = await axios.post('/users/register', { username, password });

      if (response.status === 201) {
        alert("User registered successfully.");
      } else {
        throw new Error('Registration failed.');
      }
    } catch (error) {
      alert("Registration failed. Error: " + error.message);
    }
  };

  return (
    <div className="log-form">
      <h2>Login to your account</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="username">
          <Form.Control
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
        <Button variant="secondary" onClick={handleRegister}>
          New User
        </Button>
      </Form>
    </div>
  );
}

export default Login;
