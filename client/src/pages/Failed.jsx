import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useState, useEffect } from 'react';

export default function Failed() {

  const [tasks, setTasks] = useState([]);

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
    <div className="text-[var(--text-dark)]">
      <h1 className="text-xl font-bold ">Welcome to faileed</h1>
      <p className="mt-2 text-[var(--text-muted)]">Here’s what’s on your agenda today...</p>
    </div>
  );
}

