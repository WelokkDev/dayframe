import { useState, useEffect } from 'react';
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"
import Modal from "../components/Modal";

const Task = ({ task }) => {
    const checkmarkStyles = `fill-[var(--accent)] rounded-xl  border border-[var(--accent)] w-12 hover:bg-[#332929]`;
    const checkmarkStylesTwo = `fill-[var(--accent)] rounded-xl border-5 border border-[var(--accent)] w-12 hover:bg-[var(--accent)] hover:fill-[var(--background)] `;
  
    
    const [isModalOpen, setIsModalOpen] = useState(false);



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


    return (
        <div className="bg-[var(--background)] text-[var(--foreground)] w-full p-4 rounded-xl flex items-center justify-between">
            <div className="flex gap-x-2 items-center">
                <div className="flex flex-col justify-left ml-2">
                    <div className="flex gap-x-2"><QuestionMarkCircledIcon className="hover:bg-stone-600" onClick={() => setIsModalOpen(true)} />
                        <p className="text-xs text-[var(--accent)]" >Why did you fail? </p>
                    </div>
                    <p className="text-md" >{task.title} </p>
                    
                </div>
            </div>

   
                
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className={`space-y-1 `} onClick={(e) => e.stopPropagation()}> 
                    <p className='font-bold'>Failure Reason:</p>
                    <p>{task.failure_reason}</p>
                </div>
            </Modal>
        </div>
// const Modal = ({ children, isOpen, onClose, height, width}
    )
}

export default Task;