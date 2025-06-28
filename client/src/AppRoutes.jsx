import { useAuth } from "./context/AuthProvider.jsx";
import { Routes, Route } from 'react-router';
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Calendar from "./pages/Calendar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import TasksByCategory from "./pages/TasksByCategory.jsx"
import Settings from "./pages/Settings.jsx";
import Welcome from "./pages/Welcome.jsx";
import Board from "./pages/Board.jsx";
import Completed from "./pages/Completed.jsx"
import Failed from "./pages/Failed.jsx"
import './App.css'


export default function AppRoutes() {
    return  (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<Board />} />
        <Route path="/failed" element={<Failed />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/frame/:categoryId" element={<TasksByCategory />} />
      </Route>

      {/* Fallback for any unknown route */}
      <Route path="*" element={<Home />} />
    </Routes> 
  )
}
  