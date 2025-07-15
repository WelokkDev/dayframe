import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal.jsx';
import TextField from "./TextField.jsx";
import { useState } from 'react';
import Button from "./Button.jsx";

const FailureModal = ({ isOpen, onClose, handleFailureSubmit }) => {
  if (!isOpen) return null;

  const [failureReason, setFailureReason] = useState("")
  
  const base = "relative z-10 w-[90vw] max-w-2xl bg-[var(--foreground)] rounded-xl text-[var(--text-dark)] shadow-xl p-16"

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFailureSubmit(failureReason);
    onClose()
  }
  
  const handleCancel = () => {
    setFailureReason("")
    onClose();
  }


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
        <TextField value={failureReason} onChange={(e) => setFailureReason(e.target.value)}>Why did you fail?</TextField>
        <p>*This is required to remove a task</p>
        <div className='flex justify-between'>
          <Button variant="cancel_red" size="xl" onClick={handleCancel}>Cancel</Button>
          <Button variant="primary" size="xl"  onClick={handleSubmit}>Submit</Button>
        </div>
        
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
export default FailureModal;