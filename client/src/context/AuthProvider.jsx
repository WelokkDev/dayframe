import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
    const location = useLocation();

    // Check login status when app loads
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:3000/me", {
                    credentials: "include"
                });
                if (res.ok) {
                    const data= await res.json();
                    setUser(data.user);
                } else if (res.status === 401) {
                    // Try refreshing token if unauthorized
                    await tryRefresh();
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }};
            fetchUser();
    }, []);
    
    const tryRefresh = async () => {
        try {
            const res = await fetch("http://localhost:3000/refresh", { method: "POST", credentials: "include" });
            
            if (res.ok) {
                const userRes = await fetch("http://localhost:3000/me", { credentials: "include" });

                if (userRes.ok) {
                    const data = await userRes.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Refresh failed:", err);
            setUser(null);
        }
    }

    const login = (user) => {
        setUser(user);
        navigate("/")
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:3000/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
        console.error("Logout request failed:", err);
        }
        setUser(null);
        navigate("/welcome");
    };

    // Redirect unauthenticated users away from protected routes
    useEffect(() => {
        const publicRoutes = ["/login", "/signup", "/welcome"];
        if (!loading && !user && !publicRoutes.includes(location.pathname)) {
        navigate("/welcome");
        }
    }, [loading, user, location.pathname]);

    const value = {
        user,
        login, 
        logout, 
        isAuthenticated: !!user,
        loading
    };

    return <AuthContext.Provider value={value} >{ !loading && children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext)
}