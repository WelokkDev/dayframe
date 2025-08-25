import { useTasks } from "../context/TaskProvider";
import Task from "../components/FailedTask";

export default function Failed() {
  const { failedTasks, loading } = useTasks();

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
      {failedTasks.length === 0 ? (
        <div className="text-[var(--background)] w-full h-full flex flex-col justify-center items-center space-y-4">
          <h1 className="text-4xl">You currently have no failed tasks</h1>
          <h2 className="text-3xl">Good job!</h2>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <h1 className="text-4xl text-left text-[var(--background)]">Failed Tasks</h1>
          <div className="space-y-2 mt-8 w-full max-w-[600px]">
            {failedTasks.map((task) => (
              <Task key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

