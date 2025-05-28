import { Link } from "react-router";
import Button from "./Button.jsx";

export default function Navbar() {
    return (
      <nav className="h-full  w-64 bg-[var(--background)] flex flex-col space-y-4  ">
        <div className="flex gap-2 ">
          <p className="text-xl ">Daniel Vargas</p>
          <button><img src="/chevron-down.svg" className="w-4 h-4 invert" /></button>
        </div>
        <div className="mt-12 space-y-4">

        
          <Button variant="secondary" size="md">+ Add Task</Button>
          <ul className="flex flex-col space-y-4 ">
            <li>
              <Link to="/" className="text-[var(--text-light)] hover:text-[var(--accent)] transition px-4">Your Frame </Link>
            </li>
            <li>
              <Link to="/calendar" className="text-[var(--text-light)] hover:text-[var(--accent)] transition px-4 py-1">Upcoming</Link>
            </li>
            <li>
              <Link to="/journals" className="text-[var(--text-light)] hover:text-[var(--accent)] transition px-4">Calendar</Link>
            </li>
            <p className="font-semibold mt-16 text-[var(--accent)] hover:text-[var(--accent)] transition px-4">Other Frames</p>
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
      
    )
}