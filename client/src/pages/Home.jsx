import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useState, useEffect } from 'react';
import Task from "../components/Task";

export default function Home() {

  const [tasks, setTasks] = useState([]);
  const [taskChange, setTaskChange] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetchWithAuth(`http://localhost:3000/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        if (res.ok) {
          setTasks(data);
          console.log(data)
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
                    <h1 className="text-4xl">You have no tasks today!</h1>
                </div>
            ) : (
                <div className=" flex flex-col items-center w-1/3">
                    <h1 className="text-4xl text-left text-[var(--background)]">Tasks for Today</h1>
                    <div className="space-y-2 mt-8 w-full">

                      {tasks.map((task) => (
                        <Task task={task} setTaskChange={setTaskChange}/>
                        
                    ))}    
                   </div>
                </div>
            )}
        </div>
  );
}
