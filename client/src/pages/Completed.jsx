import React, { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const Completed = () => {
    // State management for completed tasks and loading status
    const [completedTasks, setCompletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetch completed tasks from the server
     * Called when component mounts to load user's completed tasks
     */
    useEffect(() => {
        const fetchCompletedTasks = async () => {
            try {
                setLoading(true);
                // Fetch tasks with 'completed' status from server
                const res = await fetchWithAuth("http://localhost:3000/tasks?status=completed");
                if (res.ok) {
                    const data = await res.json();
                    setCompletedTasks(data);
                } else {
                    console.error("Failed to fetch completed tasks");
                }
            } catch (error) {
                console.error("Error fetching completed tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedTasks();
    }, []);

    // Loading state - show loading message while fetching data
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
                {/* Completed Tasks List */}
                <TaskList
                    title="Completed Tasks"
                    tasks={completedTasks}
                    emptyMessage="You have yet to complete any tasks!"
                    emptySubMessage="Complete some tasks to see them here"
                    showCount={true}
                    maxHeight="max-h-[calc(100vh-200px)]"
                    taskType="completed"
                />
            </div>
        </div>
    );
};

export default Completed;