import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { ClockIcon } from "@radix-ui/react-icons"
import { format } from "date-fns";

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
        <div className="h-full w-full p-12 flex justify-center">
            
            {tasks.length === 0 ? (
                <div className="text-[var(--background)] w-full h-full flex flex-col justify-center items-center space-y-4">
                    <h1 className="text-4xl">You have yet to complete any tasks! </h1>
                </div>
            ) : (
                <div className=" flex flex-col items-center w-full">
                    <h1 className="text-4xl text-left text-[var(--background)]">Failed Tasks</h1>
                    <div className="space-y-2 mt-8 w-full max-w-[600px]">
                    {tasks.map((task) => (
                        <div className="bg-[var(--background)] text-[var(--foreground)] p-4 rounded-xl flex items-center justify-between w-full">
                            <div className="flex gap-x-2 items-center w-full">
                                <div className="flex flex-col justify-left ml-2 ">
                                    <div className="flex gap-x-2"><ClockIcon/><p className="text-xs text-[var(--accent)]" >Completed at {format(new Date(task.completed_at), "MMM d")} </p></div>
                                    <p className="text-md" >{task.title} </p>
                                </div>
                            </div>
                        </div>
                    ))}
                   </div>
                </div>
            )}
        </div>

   
    );
};

export default Completed;