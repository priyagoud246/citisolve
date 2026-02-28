import { createContext, useContext, useState } from "react";
import "../styles/AdminDashboard.css";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize from localStorage so state doesn't reset to empty on refresh
    const [user, setUser] = useState(localStorage.getItem('userName') || '');
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');

    const login = (name, role) => {
        setUser(name);
        setUserRole(role);
        // Sync with localStorage
        localStorage.setItem('userName', name);
        localStorage.setItem('userRole', role);
    };

    const logout = () => {
        setUser('');
        setUserRole('');
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);