import { useParams } from "react-router";
import { useAuth } from "../context/AuthProvider.jsx";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useState, useEffect } from 'react';
import Task from "../components/Task.jsx"

const TasksByCategory = () => {
    const { categoryId } = useParams();
    const [categoryName, setCategoryName] = useState("")
    const [tasks, setTasks] = useState([])
    const [taskChange, setTaskChange] = useState(false);
    
    useEffect(() => {
        
        const fetchCategoryName = async () => {
            try {
                const res = await fetchWithAuth(`http://localhost:3000/categories/${categoryId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setCategoryName(data.name);
                }
                else {
                    console.error("Fetch error:", data.error)
                }
            } catch (err) {
                console.error("Server error:", err)
            }
        }
        const fetchTasks = async () => {
            try {
                const res = await fetchWithAuth(`http://localhost:3000/tasks?categoryId=${categoryId}&status=incomplete`, {
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
            
            setTaskChange(false)
        }
        fetchCategoryName();
        fetchTasks();
    }, [categoryId, taskChange])

    return (
        <div className="h-full w-full p-12 flex justify-center">
            
            {tasks.length === 0 ? (
                <div className="text-[var(--background)] w-full h-full flex flex-col justify-center items-center space-y-4">
                    <h1 className="text-4xl">You have no tasks for this category </h1>
                    <h2 className="text-3xl">Please create a task!</h2>
                </div>
            ) : (
                <div className=" flex flex-col items-center w-full">
                    <h1 className="text-4xl text-left text-[var(--background)]">{categoryName}</h1>
                    <div className="space-y-2 mt-8 w-full max-w-[600px]">
                    {tasks.map((task) => (
                        <Task task={task} setTaskChange={setTaskChange}/>
                        
                    ))}    
                   </div>
                </div>
            )}
        </div>
    )
}

export default TasksByCategory