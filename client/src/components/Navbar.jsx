import { Link } from "react-router";
import { useState } from 'react';
import Modal from './Modal.jsx';
import Button from "./Button.jsx";
import CreateTaskModal from './CreateTaskModal.jsx';
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider.jsx";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    console.log("TESTTT")
    logout();
    navigate("/welcome")
    
  }

  return (
    <>
      <nav className="h-full  w-64 bg-[var(--background)] flex flex-col space-y-4  ">

        <div className="flex gap-2 ">
          <p className="text-xl ">{user ? user.display_name : "Loading..."}</p>
          <button><img src="/chevron-down.svg" className="w-4 h-4 invert" /></button>
        </div>
        <div className="mt-12 space-y-4"> 
          <Button variant="primary" size="xl" className="w-full flex justify-center" onClick={() => {setIsModalOpen(true)}}>+ Add Task</Button>
          <ul className="flex flex-col space-y-4 text-xl">
            <li className="flex justify-center">
              <Link to="/" className=" text-[var(--text-light)] hover:text-[var(--accent)] transition px-4">Your Day Frame</Link>
            </li>
            <li>
              <Link to="/calendar" className="text-[var(--text-light)] hover:text-[var(--accent)] transition px-4 py-1">Upcoming</Link>
            </li>
            <li>
              <Link to="/calendar" className="text-[var(--text-light)] hover:text-[var(--accent)] transition px-4">Calendar</Link>
            </li>
            <div className="mt-16 px-4 flex flex-row justify-between">
              <p className="font-semibold  text-[var(--accent)] hover:text-[var(--accent)] transition">Other Frames</p>
              <Button variant="primary" size="md">+</Button>
            </div>
            <hr/>
            <li>
              <Link to="/journals" className="text-[var(--text-light)] hover:text-[var(--accent)] transition px-4">Life</Link>
            </li>
            <li>
              <Link to="/journals" className="text-[var(--text-light)] hover:text-[var(--accent)] transition px-4">Academics</Link>
            </li>
          </ul>

        </div>
          <div className="mt-auto">
            <Button variant="primary" size="xl" onClick={() => handleLogout()} className="w-full flex justify-center">Log out</Button>
          </div>
      </nav>
      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
    </>
    )
}