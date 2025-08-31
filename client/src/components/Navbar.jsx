import { Link, useNavigate } from "react-router";
import { useState, useEffect } from 'react';
import Modal from './Modal.jsx';
import Button from "./Button.jsx";
import CreateTaskModal from './CreateTaskModal.jsx';
import CreateFrameModal from './CreateFrameModal.jsx';
import { useLocation } from "react-router";
import { useAuth } from "../context/AuthProvider.jsx";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { TrashIcon, ChevronDownIcon } from "@radix-ui/react-icons"

export default function Navbar() {
  const [isCreateFrameOpen, setIsCreateFrameOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const location = useLocation();
  const currentPath = location.pathname; 

  const handleLogout = () => {
    logout();
  }

  const getLinkStyle = (path) => {
    return `block px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium
  ${currentPath === path 
    ? "bg-[#FFD97D] text-[#3B2F2F] shadow-sm" 
    : "text-[#C4A484] hover:bg-[#4A3C3C] hover:text-[#FFD97D]"
  }`
  } 

  const getCategLinkStyle = (path) => {
    return `block rounded-xl transition-all duration-200 w-full text-left font-medium flex items-center justify-between
  ${currentPath === path 
    ? "bg-[#FFD97D] text-[#3B2F2F] shadow-sm" 
    : "text-[#C4A484] hover:bg-[#4A3C3C] hover:text-[#FFD97D]"
  }`
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
  }, [isCreateFrameOpen]);

  const handleDeleteCateg = async (id) => {
    try {
      const res = await fetchWithAuth(`http://localhost:3000/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        // Remove from local state
        setCategories(prev => prev.filter(c => c.id !== id));

        // Redirect to today page, if user is currently viewing deleted category page
        if (location.pathname === `/categories/${id}`) {
          navigate("/");
        }

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
      <nav className="h-full w-64 bg-[#4A3C3C] border-r border-[#8B7355] flex flex-col p-6">
        {/* User Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#FFD97D] rounded-full flex items-center justify-center">
              <span className="text-[#3B2F2F] font-semibold text-sm">
                {user?.display_name?.charAt(0) || "U"}
              </span>
            </div>
            <span className="font-semibold text-[#FDF6EC]">
              {user ? user.display_name : "Loading..."}
            </span>
          </div>
          <button className="p-1 text-[#8B7355] hover:text-[#FFD97D] rounded-lg hover:bg-[#3B2F2F] transition-colors">
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Create Tasks with AI Button */}
        <div className="mb-8">
          <Link 
            to="/ai-prompt"
            className="block w-full bg-[#FFD97D] text-[#3B2F2F] px-4 py-3 rounded-xl font-medium hover:bg-[#FFD061] transition-colors text-center shadow-sm hover:shadow-md"
          >
            + Create Tasks with AI
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 space-y-2">
          <h3 className="text-xs font-semibold text-[#8B7355] uppercase tracking-wider mb-4 px-4">
            Navigation
          </h3>
          
          <ul className="space-y-1">
            <li>
              <Link to="/" className={getLinkStyle("/")}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/today" className={getLinkStyle("/today")}>
                Today
              </Link>
            </li>
            <li>
              <Link to="/calendar" className={getLinkStyle("/calendar")}>
                Calendar
              </Link>
            </li>
            <li>
              <Link to="/completed" className={getLinkStyle("/completed")}>
                Completed
              </Link>
            </li>
            <li>
              <Link to="/failed" className={getLinkStyle("/failed")}>
                Failed
              </Link>
            </li>
          </ul>

          {/* Categories Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4 px-4">
              <h3 className="text-xs font-semibold text-[#8B7355] uppercase tracking-wider">
                Categories
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsCreateFrameOpen(true)}
                className="p-1 h-6 w-6"
              >
                +
              </Button>
            </div>
            
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={`/frame/${category.id}`} className={getCategLinkStyle(`/frame/${category.id}`)}>
                    <div className="px-4 py-3">{category.name}</div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteCateg(category.id);
                      }}
                      className="p-1 mr-2 text-[#8B7355] hover:text-[#D5A8A8] hover:bg-[#4A2D2D] rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-auto pt-6 border-t border-[#8B7355]">
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={handleLogout} 
            className="w-full"
          >
            Log out
          </Button>
        </div>
      </nav>
      
      <CreateFrameModal isOpen={isCreateFrameOpen} onClose={() => setIsCreateFrameOpen(false)}/>
    </>
  )
}