import { useState } from 'react';
import { useTasks } from "../context/TaskProvider";
import { formatTaskDateTime } from "../utils/dateTimeUtils";
import FailureModal from "./FailureModal";
import TaskInfo from "./TaskInfo";
import { ClockIcon, InfoCircledIcon } from "@radix-ui/react-icons"

const Task = ({ task }) => {
    const { completeTask, failTask } = useTasks();
    const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
    const [isTaskInfoOpen, setIsTaskInfoOpen] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const formattedDateTime = formatTaskDateTime(
        task.scheduled_at, 
        task.recurrence?.preferred_time
    );

    const handleComplete = async () => {
        if (isCompleting) return;
        setIsCompleting(true);
        
        try {
            const success = await completeTask(task.id);
            if (success) {
                console.log("Task completed successfully!");
            } else {
                console.error("Failed to complete task");
            }
        } finally {
            setIsCompleting(false);
        }
    }

    const handleFailureSubmit = async (reason) => {
        const success = await failTask(task.id, reason);
        if (success) {
            console.log("Task marked as failed successfully!");
            setIsFailureModalOpen(false);
        } else {
            console.error("Failed to mark task as failed");
        }
    }

    return (
        <div className="group bg-[#4A3C3C] border border-[#8B7355] rounded-xl p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-4">
                {/* Checkbox */}
                <button
                    onClick={handleComplete}
                    disabled={isCompleting}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                        isCompleting 
                            ? 'border-[#FFD97D] bg-[#FFD97D]' 
                            : 'border-[#8B7355] hover:border-[#FFD97D] hover:bg-[#3B2F2F]'
                    }`}
                >
                    {isCompleting && (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-3 h-3 border-2 border-[#3B2F2F] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="flex items-center space-x-1 text-[#C4A484]">
                            <ClockIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{formattedDateTime}</span>
                        </div>
                        {task.repeat_is_true && (
                            <div className="flex items-center space-x-1">
                                <div className="w-1.5 h-1.5 bg-[#FFD97D] rounded-full"></div>
                                <span className="text-xs text-[#FFD97D] font-medium">Repeats</span>
                            </div>
                        )}
                    </div>
                    
                    <h3 className="text-[#FDF6EC] font-medium text-lg leading-tight">
                        {task.title}
                    </h3>
                    
                    {task.original_instruction && (
                        <p className="text-sm text-[#C4A484] mt-1 line-clamp-2">
                            {task.original_instruction}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {task.repeat_is_true && (
                        <button
                            onClick={() => setIsTaskInfoOpen(true)}
                            className="p-2 text-[#8B7355] hover:text-[#FFD97D] hover:bg-[#3B2F2F] rounded-lg transition-colors duration-200"
                            title="View task information"
                        >
                            <InfoCircledIcon className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        onClick={() => setIsFailureModalOpen(true)}
                        className="p-2 text-[#8B7355] hover:text-[#D5A8A8] hover:bg-[#4A2D2D] rounded-lg transition-colors duration-200"
                        title="Mark as failed"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
                
            <FailureModal 
                isOpen={isFailureModalOpen} 
                handleFailureSubmit={handleFailureSubmit} 
                onClose={() => setIsFailureModalOpen(false)}
            />
            <TaskInfo 
                isOpen={isTaskInfoOpen} 
                onClose={() => setIsTaskInfoOpen(false)} 
                task={task} 
            /> 
        </div>
    )
}

export default Task;