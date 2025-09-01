import React, { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export default function Failed() {
  const [failedTasks, setFailedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFailedTasks = async () => {
      try {
        setLoading(true);
        const res = await fetchWithAuth("http://localhost:3000/tasks?status=failed");
        if (res.ok) {
          const data = await res.json();
          setFailedTasks(data);
        } else {
          console.error("Failed to fetch failed tasks");
        }
      } catch (error) {
        console.error("Error fetching failed tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFailedTasks();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full p-12 flex justify-center">
        <div className="text-[var(--background)] w-full h-full flex flex-col justify-center items-center space-y-4">
          <h1 className="text-4xl">Loading tasks...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-12 flex justify-center">
      <div className="w-full max-w-4xl">
        <TaskList
          title="Failed Tasks"
          tasks={failedTasks}
          emptyMessage="You currently have no failed tasks"
          emptySubMessage="Good job!"
          showCount={true}
          maxHeight="max-h-[calc(100vh-200px)]"
          taskType="failed"
        />
      </div>
    </div>
  );
}

