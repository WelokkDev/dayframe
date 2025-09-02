import { useState } from "react";
import { useTasks } from "../context/TaskProvider";
import FailureModal from "./FailureModal";
import { FileIcon, ClockIcon } from "@radix-ui/react-icons"
import { formatTaskDateTime } from "../utils/dateTimeUtils";

export default function HomeTask({ task }) {
  const { completeTask, failTask, getCategoryName } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkmarkStyles = `fill-[var(--accent)] rounded-xl  border border-[var(--accent)] w-12 hover:bg-[#332929]`;
  const checkmarkStylesTwo = `fill-[var(--accent)] rounded-xl border-5 border border-[var(--accent)] w-12 hover:bg-[var(--accent)] hover:fill-[var(--background)] `;

  const iconWrapperStyles = `
    w-8 h-8 
    rounded-xl 
    border-3 border-[var(--accent)] 
    bg-transparent 
    hover:bg-[var(--accent)] 
    flex items-center justify-center 
    transition-colors
    `;

  const checkStyles = `
    w-10 h-10 
    fill-[var(--accent)] 
    hover:fill-[var(--background)] 
    transition-colors
    `;
  const cancelStyles = `
    w-4 h-4 
    fill-[var(--accent)] 
    hover:fill-[var(--background)] 
    transition-colors
    `;

  const handleComplete = async () => {
    const success = await completeTask(task.id);
    if (success) {
      console.log("Task completed successfully!");
    } else {
      console.error("Failed to complete task");
    }
  };

  const handleFailureSubmit = async (reason) => {
    const success = await failTask(task.id, reason);
    if (success) {
      console.log("Task marked as failed successfully!");
      setIsModalOpen(false);
    } else {
      console.error("Failed to mark task as failed");
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] w-full p-4 rounded-xl flex items-center justify-between">
      <div className="flex gap-x-2 items-center">
        <div className={iconWrapperStyles} onClick={handleComplete}>
          <svg xmlns="http://www.w3.org/2000/svg" className={checkStyles} viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
          </svg>
        </div>
        <div className="flex flex-col justify-left ml-4">
          <div className="flex gap-x-2 items-center mb-1">
            <FileIcon/>
            <p className="text-xs text-[var(--accent)]">Category: {getCategoryName(task.category_id)}</p>
          </div>
          <p className="text-md">{task.title}</p>
          {task.scheduled_at && (
            <div className="flex items-center space-x-1 text-[var(--accent)] mt-1">
              <ClockIcon className="w-3 h-3" />
              <span className="text-xs font-medium">
                {formatTaskDateTime(task.scheduled_at, task.recurrence?.preferred_time)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={iconWrapperStyles} onClick={() => setIsModalOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" className={cancelStyles} viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
        </svg>
      </div>
        
      <FailureModal 
        isOpen={isModalOpen} 
        handleFailureSubmit={handleFailureSubmit} 
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}