import { useParams } from "react-router";
import { useAuth } from "../context/AuthProvider.jsx";
import { useTasks } from "../context/TaskProvider.jsx";
import { useMemo } from 'react';
import Task from "../components/Task.jsx"

const TasksByCategory = () => {
    const { categoryId } = useParams();
    const { incompleteTasks, getCategoryName, loading } = useTasks(); 
    
    // Filter incomplete tasks for this specific category
    const categoryTasks = useMemo(() => {
        console.log("All incomplete tasks:", incompleteTasks);
        console.log("Looking for category ID:", categoryId);
        console.log("Category ID type:", typeof categoryId);
        
        const filtered = incompleteTasks.filter(task => {
            console.log("Task category_id:", task.category_id, "Type:", typeof task.category_id);
            return task.category_id === categoryId;
        });
        
        console.log("Filtered tasks for this category:", filtered);
        return filtered;
    }, [incompleteTasks, categoryId]);

    const categoryName = getCategoryName(categoryId);

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
            {categoryTasks.length === 0 ? (
                <div className="text-[var(--background)] w-full h-full flex flex-col justify-center items-center space-y-4">
                    <h1 className="text-4xl">You have no incomplete tasks for this category</h1>
                    <h2 className="text-3xl">Please create a task!</h2>
                </div>
            ) : (
                <div className="flex flex-col items-center w-full">
                    <h1 className="text-4xl text-left text-[var(--background)]">{categoryName}</h1>
                    <div className="space-y-2 mt-8 w-full max-w-[600px]">
                        {categoryTasks.map((task) => (
                            <Task key={task.id} task={task} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TasksByCategory