import axios from 'axios';

// Create an instance of axios
const authAxios = axios.create({
    baseURL: 'http://localhost:3000',
});

// Function to set the token
export const setAuthToken = (token) => {
    if (token) {
        // Apply authorization token to every request if logged in
        authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Delete auth header
        delete authAxios.defaults.headers.common['Authorization'];
    }
};

export default authAxios;