import { useParams } from "react-router";
import { useAuth } from "../context/AuthProvider.jsx";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useState, useEffect } from 'react';

const TasksByCategory = () => {
    const { categoryId } = useParams();
    const [tasks, setTasks] = useState([])
    
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetchWithAuth(`http://localhost:3000/tasks?categoryId=${categoryId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setTasks(data);
                    console.log(tasks)
                }
                else {
                    console.log("Fetch error:", data.error)
                }
            } catch (err) {
                console.error("Server error:", err)
            }
        }
        fetchTasks();
    }, [categoryId])

    return (
        <div>
            <p className="text-[var(--background)]">Tasks for: {categoryId} </p>
            {tasks.length === 0 ? (
                <div className="text-[var(--background)]">You have no tasks for this category </div>
            ) : (
                <div className="text-[var(--background)]">You have tasks</div>
            )}
        </div>
    )
}

export default TasksByCategory