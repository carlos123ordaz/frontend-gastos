import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Configurar token en axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Obtener datos del usuario
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/auth/me`);
            setUser(response.data.user);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};