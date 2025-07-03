import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/token/";


const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL, { username, password });

        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        window.dispatchEvent(new Event("authChange")); // 🔥 Dispara evento para atualizar Navbar
        return response.data;
    } catch (error) {
        error.response?.data
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    window.dispatchEvent(new Event("authChange")); // 🔥 Dispara evento para atualizar Navbar
};

const getAuthToken = () => {
    return localStorage.getItem("access");
};

export { login, logout, getAuthToken };
