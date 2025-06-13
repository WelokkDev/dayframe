import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    }); 

    useEffect(() => {
        try{
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");

            if (storedUser && storedUser !== "undefined") {
            setUser(JSON.parse(storedUser));
            }

            if (storedToken) {
            setToken(storedToken);
        }
        } catch (err) {
            console.error("Failed to parse user from localStorage", err);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    }, []);

    const login = ({user, token}) => {
        setUser(user);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const value = {
        user,
        token,
        login, 
        logout, 
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value} >{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext)
}