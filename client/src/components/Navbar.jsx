import { Link } from "react-router";
import { useState, useEffect } from 'react';
import Modal from './Modal.jsx';
import Button from "./Button.jsx";
import CreateTaskModal from './CreateTaskModal.jsx';
import CreateFrameModal from './CreateFrameModal.jsx';
import { useLocation } from "react-router";
import { useAuth } from "../context/AuthProvider.jsx";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { TrashIcon } from "@radix-ui/react-icons"

export default function Navbar() {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreateFrameOpen, setIsCreateFrameOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const currentPath = location.pathname; 

  const handleLogout = () => {
    console.log("TESTTT")
    logout();
    
    
  }

  const getLinkStyle = (path) => {
    return `block px-4 py-2 rounded-xl transition w-full text-left transition-all duration-200 
  ${currentPath === path ? "bg-[var(--accent)] text-[var(--background)] font-semibold" : "text-[var(--text-light)] hover:bg-[#302727] hover:text-[var(--accent)]"}`
  } 

  const getCategLinkStyle = (path) => {
    return `block  rounded-xl transition w-full text-left transition-all duration-200 flex items-center justify-between
  ${currentPath === path ? "bg-[var(--accent)] text-[var(--background)] font-semibold" : "text-[var(--text-light)] hover:bg-[#302727] hover:text-[var(--accent)]"}`
  } 

  useEffect(() => {
    
    const fetchCategories = async () => {
      try {
        const res = await fetchWithAuth("http://localhost:3000/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        const data = await res.json()
        if (res.ok) {
          setCategories(data);
          console.log(data)
        } else {
          console.error("Fetch error:", data.error)
        }
      } catch (err) {
        console.error("Server error:", err)
      } finally {
        setLoading(false);
      }
    }
  
    fetchCategories();
  }, [categories]);

const handleDeleteCateg = async (publicId) => {

  try {
    const res = await fetchWithAuth(`http://localhost:3000/categories/${publicId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      // Remove from local state
      setCategories(prev => prev.filter(c => c.public_id !== publicId));
    } else {
      alert(data.error || "Failed to delete category.");
    }
  } catch (err) {
    console.error("Error deleting category:", err);
    alert("Server error. Try again later.");
  }
};

  

  return (
    <>
      <nav className="h-full w-64 bg-[var(--background)] flex flex-col space-y-4  ">

        <div className="flex gap-2 ">
          <p className="text-xl ">{user ? user.display_name : "Loading..."}</p>
          <button><img src="/chevron-down.svg" className="w-4 h-4 invert" /></button>
        </div>
        <div className="mt-12 space-y-2"> 
          <Button variant="secondary" size="md" className="w-full" onClick={() => {setIsCreateTaskOpen(true)}}>+ Add Task</Button>
          <ul className="flex flex-col space-y-2 text-md">
            <li className="">
              <Link to="/" className={getLinkStyle("/")}>
                Today
              </Link>
            </li>
            <li>
              <Link to="/board" className={getLinkStyle("/board")}>Board</Link>
            </li>

            <li>
              <Link to="/completed" className={getLinkStyle("/completed")}>Completed</Link>
            </li>
            <li>
              <Link to="/failed" className={getLinkStyle("/failed")}>Failed</Link>
            </li>
            
            <div className="mt-16 px-4 mb-4 flex flex-row justify-between">
              <p className="font-semibold  text-[var(--accent)] hover:text-[var(--accent)] transition">Other Frames</p>
              <Button variant="primary" size="md" onClick={() => {setIsCreateFrameOpen(true)}}>+</Button>
            </div>
            
            {categories.map((category) => (
              <li className="" key={category.public_id}>
                <Link to={`/frame/${category.public_id}`} className={getCategLinkStyle(`/frame/${category.public_id}`)}>
                <div className="px-4 py-2">{category.name}</div>
                  <TrashIcon onClick={() => handleDeleteCateg(category.public_id)} className="w-6 h-6 hover:bg-[#FFEEC7] active:bg-[#FFC94D] rounded-md mr-2"/>
                </Link>
              </li>
            ))}
          </ul>

        </div>
          <div className="mt-auto">
            <Button variant="primary" size="xl" onClick={() => handleLogout()} className="w-full flex justify-center">Log out</Button>
          </div>
      </nav>
      <CreateTaskModal categories={categories} isOpen={isCreateTaskOpen} onClose={() => setIsCreateTaskOpen(false)}/>
      <CreateFrameModal isOpen={isCreateFrameOpen} onClose={() => setIsCreateFrameOpen(false)}/>
    </>
    )
}