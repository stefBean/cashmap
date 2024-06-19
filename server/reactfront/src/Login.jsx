import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
<<<<<<< HEAD
=======
import authAxios, { setAuthToken } from './authAxios';
import {useNavigate} from "react-router-dom";
>>>>>>> origin/Tobias-react

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
=======
  const navigate = useNavigate();
>>>>>>> origin/Tobias-react

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Username and password cannot be empty.");
      return;
    }

    try {
      const response = await axios.post('/users/login', { username, password });

      if (response.status === 200) {
<<<<<<< HEAD
        localStorage.setItem('accessToken', response.data.accessToken);
        window.location.href = '/homepage';
=======
        setAuthToken(response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate('/homepage');
>>>>>>> origin/Tobias-react
      } else {
        throw new Error('Login failed.');
      }
    } catch (error) {
      alert("Login failed. Error: " + error.message);
    }
<<<<<<< HEAD
=======

    //const response1 = await authAxios.get("http://localhost:3000/homepage");

>>>>>>> origin/Tobias-react
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
<<<<<<< HEAD
          <Form.Control 
            type="text" 
=======
          <Form.Control
            type="text"
>>>>>>> origin/Tobias-react
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
<<<<<<< HEAD
          <Form.Control 
            type="password" 
=======
          <Form.Control
            type="password"
>>>>>>> origin/Tobias-react
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
