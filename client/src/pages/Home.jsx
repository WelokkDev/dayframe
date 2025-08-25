import { useTasks } from "../context/TaskProvider";
import { FileIcon } from "@radix-ui/react-icons"
import Task from "../components/HomeTask";

export default function Home() {
  const { todaysTasks, loading } = useTasks();

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
      {todaysTasks.length === 0 ? (
        <div className="text-[var(--background)] w-full h-full flex flex-col justify-center items-center space-y-4">
          <h1 className="text-4xl">You have no tasks today!</h1>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <h1 className="text-4xl text-left text-[var(--background)]">Today's Tasks</h1>
          <div className="space-y-2 mt-8 w-full max-w-[600px]">
            {todaysTasks.map((task) => (
              <Task key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
