import { Link } from "react-router";
import { useState } from 'react';
import Modal from './Modal.jsx';
import Button from "./Button.jsx";
import TextField from "./TextField.jsx";
import Select from "./Select.jsx";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="h-full  w-64 bg-[var(--background)] flex flex-col space-y-4  ">

        <div className="flex gap-2 ">
          <p className="text-xl ">Daniel Vargas</p>
          <button><img src="/chevron-down.svg" className="w-4 h-4 invert" /></button>
        </div>
        <div className="mt-12 space-y-4"> 
          <Button variant="secondary" size="md" onClick={() => setIsModalOpen(true)}>+ Add Task</Button>
          <ul className="flex flex-col space-y-4 ">
            <li>
              <Link to="/" className="text-[var(--text-light)] hover:text-[var(--accent)] transition px-4">Your Day Frame </Link>
            </li>
            <li>
              <Link to="/calendar" className="text-[var(--text-light)] hover:text-[var(--accent)] transition px-4 py-1">Upcoming</Link>
            </li>
            <li>
              <Link to="/journals" className="text-[var(--text-light)] hover:text-[var(--accent)] transition px-4">Calendar</Link>
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
          <div className="mt-auto">
            <Link to="/settings" className="text-[var(--text-light)] hover:text-[var(--accent)] transition px-4">Settings</Link>
          </div>
        </div>
      </nav>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} height="h-[50%]" width="w-[50%]">
        <form>
          <TextField>Task</TextField>
          <Select
            options={[ 
              { label: 'Task', value: "task" },
              { label: 'Quota', value: "quota"}
            ]}
          />
        </form>
      </Modal>
    </>
    )
}