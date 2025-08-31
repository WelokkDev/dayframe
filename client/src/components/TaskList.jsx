import { useTasks } from "../context/TaskProvider";
import Task from "./Task";

const TaskList = ({ 
  title = "Your Tasks", 
  tasks = null, 
  emptyMessage = "No tasks yet",
  emptySubMessage = "Use the AI generator to create your first task!",
  showCount = true,
  maxHeight = "max-h-96"
}) => {
  const { incompleteTasks, completedTasks, failedTasks } = useTasks();
  
  // Use provided tasks or default to incomplete tasks
  const displayTasks = tasks || incompleteTasks;
  
  return (
    <div className="bg-[#4A3C3C] border border-[#8B7355] rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#FDF6EC]">
          {title}
        </h2>
        {showCount && (
          <span className="text-sm text-[#C4A484]">
            {displayTasks.length} {displayTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        )}
      </div>
      
      {displayTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#3B2F2F] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-[#E8D5C4] text-lg mb-2">
            {emptyMessage}
          </p>
          <p className="text-[#C4A484]">
            {emptySubMessage}
          </p>
        </div>
      ) : (
        <div className={`space-y-3 ${maxHeight} overflow-y-auto`}>
          {displayTasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
