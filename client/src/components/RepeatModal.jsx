import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal.jsx';
import TextField from "./TextField.jsx";
import { useState } from 'react';
import { format } from "date-fns"
import Button from "./Button.jsx";

const RepeatModal = ({ isOpen, onClose, task }) => {
  if (!isOpen) return null;

  
  const base = "relative z-10 w-[90vw] max-w-2xl bg-[var(--foreground)] rounded-xl text-[var(--text-dark)] shadow-xl p-16"

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose()
  }
  
  const handleCancel = () => {
    onClose();
  }

  const interval = task.repeat_interval > 1 ? task.repeat_unit + "s" : task.repeat_unit;
  const repeatEnding = task.repeat_ends_on === null
    ? "This will keep repeating until you disable repeating"
    : "This will stop repeating on " + format(new Date(task.repeat_ends_on), "MMM d, yyyy");

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 "
        
      />

      {/* Modal Content */}
      <div
        className={`${base} space-y-4 `}
        onClick={(e) => e.stopPropagation()}
      >
        <p>Repeating every {task.repeat_interval} {interval}</p>
        <p>{repeatEnding}</p>
        
        <div className='flex justify-between'>
          <Button variant="primary" size="xl" onClick={handleCancel}>Close</Button>
          <Button variant="cancel_red" size="xl"  onClick={handleSubmit}>Disable Repeating</Button>
        </div>
        
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
export default RepeatModal;