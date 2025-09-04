import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from "./Button.jsx";
import TextField from "./TextField.jsx";

const DeadlineModal = ({ isOpen, onClose, task, onComplete, onFail }) => {
  const [failureReason, setFailureReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFail = async () => {
    if (!failureReason.trim()) {
      alert("Please provide a reason for the failure");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onFail(failureReason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFailureReason("");
      onClose();
    }
  };

  const base = "relative z-10 w-[90vw] max-w-2xl bg-[#4A3C3C] border border-[#8B7355] rounded-xl shadow-xl p-8";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal Content */}
      <div
        className={`${base} space-y-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-[#8B7355] pb-4">
          <h2 className="text-2xl font-semibold text-[#FDF6EC]">
            Task Deadline Missed
          </h2>
          <p className="text-[#C4A484] mt-2">
            The deadline for "{task.title}" has passed. What happened?
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#3B2F2F] p-4 rounded-lg border border-[#8B7355]">
            <h3 className="text-[#FDF6EC] font-medium mb-2">Task Details</h3>
            <p className="text-[#C4A484] text-sm">
              <strong>Title:</strong> {task.title}
            </p>
            {task.original_instruction && (
              <p className="text-[#C4A484] text-sm mt-1">
                <strong>Original:</strong> {task.original_instruction}
              </p>
            )}
            <p className="text-[#C4A484] text-sm mt-1">
              <strong>Importance:</strong> {task.importance ? "High Priority" : "Low Priority"}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              size="xl"
              onClick={handleComplete}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Marking Complete..." : "✅ I Completed This Task"}
            </Button>

            <div className="text-center text-[#C4A484] text-sm">
              OR
            </div>

            <div className="space-y-3">
              <TextField
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                placeholder="Why couldn't you complete this task?"
                disabled={isSubmitting}
              >
                Reason for Failure
              </TextField>
              
              <Button
                variant="cancel_red"
                size="xl"
                onClick={handleFail}
                disabled={isSubmitting || !failureReason.trim()}
                className="w-full"
              >
                {isSubmitting ? "Marking Failed..." : "❌ I Failed This Task"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#8B7355]">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Close
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default DeadlineModal;

