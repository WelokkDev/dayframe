import { Link } from "react-router";

export default function Navbar() {
    return (
      <nav className="h-full w-64 bg-[var(--background)] flex flex-col ">
        <div className="text-2xl font-bold text-[var(--accent)] mb-8">
          My Journal
        </div>
        <ul className="flex flex-col space-y-4">
          <li>
            <Link to="/" className="text-[var(--text)] hover:text-[var(--accent)] transition">Home</Link>
          </li>
          <li>
            <Link to="/calendar" className="text-[var(--text)] hover:text-[var(--accent)] transition">Calendar</Link>
          </li>
          <li>
            <Link to="/journals" className="text-[var(--text)] hover:text-[var(--accent)] transition">Journals</Link>
          </li>
          <li>
            <Link to="/settings" className="text-[var(--text)] hover:text-[var(--accent)] transition">Settings</Link>
          </li>
        </ul>
      </nav>
      
    )
}