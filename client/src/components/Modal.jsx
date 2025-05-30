import React from 'react';
import ReactDOM from 'react-dom';
import TextField from "./TextField";

const Modal = ({ children, isOpen, onClose, height, width}) => {
  if (!isOpen) return null;
  
  const base = "relative z-10 w-[90vw] max-w-2xl bg-[var(--foreground)] rounded-xl text-[var(--text-dark)] shadow-xl p-24"

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 "
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`${base} ${height} ${width}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
export default Modal