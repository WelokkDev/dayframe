import { Routes, Route } from 'react-router';
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Today from "./pages/Today.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import TasksByCategory from "./pages/TasksByCategory.jsx"
import Welcome from "./pages/Welcome.jsx";
import Completed from "./pages/Completed.jsx"
import Failed from "./pages/Failed.jsx"
import Calendar from "./pages/Calendar.jsx";
import AIPrompt from "./pages/AIPrompt.jsx";
import './App.css'


export default function AppRoutes() {
    return  (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/ai-prompt" element={<AIPrompt />} />
        <Route path="/today" element={<Today />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/failed" element={<Failed />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/frame/:categoryId" element={<TasksByCategory />} />
      </Route>

      {/* Fallback for any unknown route */}
      <Route path="*" element={<Home />} />
    </Routes> 
  )
}
  