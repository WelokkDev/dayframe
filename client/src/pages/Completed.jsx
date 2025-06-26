import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const Completed = () => {
    const currentPath = location.pathname; 
    const getLinkStyle = (path) => {
        return `block px-4 py-2 rounded-xl transition w-full text-left transition-all duration-200 
    ${currentPath === path ? "bg-[var(--accent)] text-[var(--background)] font-semibold" : "text-[var(--text-light)] hover:bg-[#302727] hover:text-[var(--accent)]"}`
    } 
    const [tasks, setTasks] = useState([]);
    
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetchWithAuth(`http://localhost:3000/tasks?status=completed`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setTasks(data);
                }
                else {
                    console.log("Fetch error:", data.error)
                }
            } catch (err) {
                console.error("Server error:", err)
            }
            
        }
        fetchTasks();
    }, [])


  return (
    <div className="text-[var(--text-dark)]">
        <h1 className="text-xl font-bold ">Welcome to completed!</h1>
        <div className="text-[var(--text-dark)]">
            {tasks.map((task) => (
                <p className="text-[var(--text-dark)]">{task.title}</p>
            ))}
        </div>
    </div>
   
  );
};

export default Completed;