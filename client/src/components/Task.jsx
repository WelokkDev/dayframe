import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useState, useEffect } from 'react';
import { format } from "date-fns";
import FailureModal from "./FailureModal";
import RepeatModal from "./RepeatModal";
import { ClockIcon, InfoCircledIcon } from "@radix-ui/react-icons"

const Task = ({ task, setTaskChange }) => {
    const checkmarkStyles = `fill-[var(--accent)] rounded-xl  border border-[var(--accent)] w-12 hover:bg-[#332929]`;
    const checkmarkStylesTwo = `fill-[var(--accent)] rounded-xl border-5 border border-[var(--accent)] w-12 hover:bg-[var(--accent)] hover:fill-[var(--background)] `;
    
    const [completed, setCompleted] = useState(false);
    const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
    const [isRepeatModalOpen, setIsRepeatModalOpen] = useState(false);

    useEffect(() => {
        setTaskChange(true)
    }, [completed, isFailureModalOpen])


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

    const formattedDate = format(new Date(task.due_date), "MMM d");

    const handleComplete = async () => {
        console.log("THIS BE WORKING?")
        const now = new Date()
        const formattedDate = format(now, 'yyyy-MM-dd HH:mm:ss');
        try {
            console.log("ANDD THISSSS")
            const res = await fetchWithAuth(`http://localhost:3000/tasks/${task.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ completed_at: formattedDate, cancelled: false, failure_reason: "" })
            })
            console.log("ALRIGHT THENEN")
            if (!res.ok) {
                const error = await res.json();
                console.error("Completion failed:", error);
                console.log("NAN")
            }
            else {
                setCompleted(true);
                console.log("YAY")
            }

        } catch (err) {
            console.error("Server error:", err)
        }

    }

    const handleFailureSubmit = async (reason) => {
            try {
                const res = await fetchWithAuth(`http://localhost:3000/tasks/${task.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ completed_at: null, cancelled: true, failure_reason: reason })
                })

                if (!res.ok) {
                    const error = await res.json();
                    console.error("Completion failed:", error);
                }
                else {
                    setCompleted(true);
                }

            } catch (err) {
                console.error("Server error:", err)
            }
    }
    return (
        <div className="bg-[var(--background)] text-[var(--foreground)] w-full p-4 rounded-xl flex items-center justify-between">
            <div className="flex gap-x-2 items-center">
                <div className={iconWrapperStyles} onClick={handleComplete}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={checkStyles}   viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                    </svg>
                </div>
                <div className="flex flex-col justify-left ml-4">
                    <div className="flex gap-x-2"><ClockIcon/><p className="text-xs text-stone-200" >{formattedDate} </p></div>
                    <p className="text-md" >{task.title} </p>
                    
                </div>
            </div>
            <div className="flex gap-x-2 justify-end">
                { task.repeat_is_true && (
                    <div className="flex items-center">
                        <p className="text-[var(--accent)] text-xs leading-none w-1/2">This task repeats</p>
                        <InfoCircledIcon className="w-6 h-6 hover:bg-stone-600" onClick={() => setIsRepeatModalOpen(true)}/>
                    </div>
                )}

                <div className={iconWrapperStyles} onClick={() => setIsFailureModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={cancelStyles}  viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </div>
            </div>
                
            <FailureModal isOpen={isFailureModalOpen} handleFailureSubmit={handleFailureSubmit} onClose={() => setIsFailureModalOpen(false)}/>
            <RepeatModal isOpen={isRepeatModalOpen} onClose={() => setIsRepeatModalOpen(false)} task={task} /> 
        </div>

    )
}

export default Task;