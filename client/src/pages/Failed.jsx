import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useState, useEffect } from 'react';
import Task from "../components/FailedTask";


export default function Failed() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetchWithAuth(`http://localhost:3000/tasks?status=failed`, {
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
                    <h1 className="text-4xl">You currently have no failed tasks </h1>
                    <h2 className="text-3xl">Good job!</h2>
                </div>
            ) : (
                <div className=" flex flex-col items-center w-full">
                    <h1 className="text-4xl text-left text-[var(--background)]">Failed Tasks</h1>
                    <div className="space-y-2 mt-8 w-full max-w-[600px]">
                      {tasks.map((task) => (
                          <Task task={task} />       
                        ))}   
                   </div>
                </div>
            )}
        </div>
  
  );
}

