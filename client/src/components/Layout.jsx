import '../index.css';
import Navbar from "./Navbar.jsx";
import { Outlet } from "react-router";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen w-full bg-[#3B2F2F] font-sans antialiased">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}