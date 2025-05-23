import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router';
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx"
import Calendar from "./pages/Calendar.jsx"
import Journals from "./pages/Journals.jsx"
import Settings from "./pages/Settings.jsx"

function App() {
  const [count, setCount] = useState(0)

  return (
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

export default App
