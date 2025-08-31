import { useState } from 'react';
import { useTasks } from "../context/TaskProvider";
import { format } from "date-fns";
import FailureModal from "./FailureModal";
import RepeatModal from "./RepeatModal";
import { ClockIcon, InfoCircledIcon } from "@radix-ui/react-icons"

const Task = ({ task }) => {
    const { completeTask, failTask } = useTasks();
    const checkmarkStyles = `fill-[var(--accent)] rounded-xl  border border-[var(--accent)] w-12 hover:bg-[#332929]`;
    const checkmarkStylesTwo = `fill-[var(--accent)] rounded-xl border-5 border border-[var(--accent)] w-12 hover:bg-[var(--accent)] hover:fill-[var(--background)] `;
    
    const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
    const [isRepeatModalOpen, setIsRepeatModalOpen] = useState(false);

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

    const formattedDate = task.scheduled_at ? format(new Date(task.scheduled_at), "MMM d") : "No due date";

    const handleComplete = async () => {
        const success = await completeTask(task.id);
        if (success) {
            console.log("Task completed successfully!");
        } else {
            console.error("Failed to complete task");
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
        <div className="bg-[var(--background)] text-[var(--foreground)] w-full p-4 rounded-xl flex items-center justify-between">
            <div className="flex gap-x-2 items-center">
                <div className={iconWrapperStyles} onClick={handleComplete}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={checkStyles} viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                    </svg>
                </div>
                <div className="flex flex-col justify-left ml-4">
                    <div className="flex gap-x-2">
                        <ClockIcon/>
                        <p className="text-xs text-stone-200">{formattedDate}</p>
                    </div>
                    <p className="text-md">{task.title}</p>
                    {task.original_instruction && (
                        <p className="text-xs text-stone-400 mt-1">{task.original_instruction}</p>
                    )}
                </div>
            </div>
            <div className="flex gap-x-2 justify-end">
                {task.repeat_is_true && (
                    <div className="flex items-center">
                        <p className="text-[var(--accent)] text-xs leading-none w-1/2">This task repeats</p>
                        <InfoCircledIcon className="w-6 h-6 hover:bg-stone-600" onClick={() => setIsRepeatModalOpen(true)}/>
                    </div>
                )}

                <div className={iconWrapperStyles} onClick={() => setIsFailureModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={cancelStyles} viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </div>
            </div>
                
            <FailureModal 
                isOpen={isFailureModalOpen} 
                handleFailureSubmit={handleFailureSubmit} 
                onClose={() => setIsFailureModalOpen(false)}
            />
            <RepeatModal 
                isOpen={isRepeatModalOpen} 
                onClose={() => setIsRepeatModalOpen(false)} 
                task={task} 
            /> 
        </div>
    )
}

export default Task;