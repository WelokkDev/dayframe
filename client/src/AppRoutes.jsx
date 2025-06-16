import { useAuth } from "./context/AuthProvider.jsx";
import { Routes, Route } from 'react-router';
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Calendar from "./pages/Calendar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Journals from "./pages/Journals.jsx";
import Settings from "./pages/Settings.jsx";
import Welcome from "./pages/Welcome.jsx";
import './App.css'


export default function AppRoutes() {

    const { isAuthenticated } = useAuth();
    
    return !isAuthenticated ? (
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

      ) : (
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/journals" element={<Journals />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      
    )
}
  