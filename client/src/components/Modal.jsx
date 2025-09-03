import React from 'react';
import ReactDOM from 'react-dom';
import TextField from "./TextField";

const Modal = ({ children, isOpen, onClose, height, width}) => {
  if (!isOpen) return null;
  
  const base = "relative z-10 w-[90vw] max-w-2xl bg-[#3B2F2F] rounded-3xl text-[#FDF6EC] shadow-2xl border border-[#8B7355] backdrop-blur-sm p-8"

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#2A1F1F]/80 backdrop-blur-sm"
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