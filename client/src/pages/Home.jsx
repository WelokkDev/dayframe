import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useState, useEffect } from 'react';
import { FileIcon } from "@radix-ui/react-icons"
import Task from "../components/HomeTask";

export default function Home() {

  const [tasks, setTasks] = useState([]);
  const [taskChange, setTaskChange] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetchWithAuth(`http://localhost:3000/tasks?status=incomplete&dueToday=true`, {
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
       setTaskChange(false)

    }
    fetchTasks();

  
  }, [taskChange])

  return (
        <div className="h-full w-full p-12 flex justify-center">
            
            {tasks.length === 0 ? (
                <div className="text-[var(--background)] w-full h-full flex flex-col justify-center items-center space-y-4">
                    <h1 className="text-4xl">You have no tasks today! </h1>
                </div>
            ) : (
                <div className=" flex flex-col items-center w-full">
                    <h1 className="text-4xl text-left text-[var(--background)]">Today's Tasks</h1>
                    <div className="space-y-2 mt-8 w-full max-w-[600px]">
                      {tasks.map((task) => (
                        <Task task={task} setTaskChange={setTaskChange}/>
                        
                    ))}    
                   </div>
                </div>
            )}
        </div>
  );
}
