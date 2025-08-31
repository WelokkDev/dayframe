import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal.jsx';
import Button from "./Button.jsx";
import { format } from "date-fns";
import { getNextScheduledDate, getRecurrenceDescription, formatTime } from "../utils/recurrenceUtils";

const TaskInfo = ({ isOpen, onClose, task }) => {
  const [nextScheduledDate, setNextScheduledDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && task?.recurrence) {
      calculateNextScheduledDate();
    }
  }, [isOpen, task]);

  const calculateNextScheduledDate = () => {
    if (!task?.recurrence) return;
    
    setIsLoading(true);
    try {
      const nextDate = getNextScheduledDate(task.recurrence);
      setNextScheduledDate(nextDate);
    } catch (error) {
      console.error('Error calculating next scheduled date:', error);
      setNextScheduledDate(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const recurrenceDescription = getRecurrenceDescription(task?.recurrence);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative z-10 w-[90vw] max-w-2xl bg-[#4A3C3C] border border-[#8B7355] rounded-xl shadow-xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-[#8B7355] pb-4">
            <h2 className="text-2xl font-semibold text-[#FDF6EC]">Task Information</h2>
            <p className="text-lg text-[#C4A484] mt-1">{task?.title}</p>
          </div>

          {/* Recurrence Information */}
          {task?.recurrence && (
            <div className="space-y-4">
                             <div>
                 <h3 className="text-lg font-medium text-[#FDF6EC] mb-2">Recurrence Pattern</h3>
                 <p className="text-[#C4A484] bg-[#3B2F2F] border border-[#8B7355] p-3 rounded-lg">
                   {recurrenceDescription}
                 </p>
               </div>

              {/* Next Scheduled Date */}
              <div>
                <h3 className="text-lg font-medium text-[#FDF6EC] mb-2">Next Scheduled</h3>
                {isLoading ? (
                  <div className="text-[#C4A484]">Calculating...</div>
                ) : nextScheduledDate ? (
                  <p className="text-[#FFD97D] font-medium">
                    {format(nextScheduledDate, 'EEEE, MMMM d, yyyy')}
                    {nextScheduledDate.getHours() !== 0 && (
                      <span className="text-[#C4A484] ml-2">
                        at {format(nextScheduledDate, 'h:mm a')}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-[#D5A8A8]">No future occurrences scheduled</p>
                )}
              </div>

              {/* Recurrence Details */}
              <div>
                <h3 className="text-lg font-medium text-[#FDF6EC] mb-2">Details</h3>
                <div className="bg-[#3B2F2F] border border-[#8B7355] p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#C4A484]">Frequency:</span>
                    <span className="text-[#FDF6EC] capitalize">{task.recurrence.frequency}</span>
                  </div>
                  {task.recurrence.interval_value > 1 && (
                    <div className="flex justify-between">
                      <span className="text-[#C4A484]">Interval:</span>
                      <span className="text-[#FDF6EC]">Every {task.recurrence.interval_value} {task.recurrence.frequency}s</span>
                    </div>
                  )}
                  {task.recurrence.occurrences_per_period && (
                    <div className="flex justify-between">
                      <span className="text-[#C4A484]">Occurrences per period:</span>
                      <span className="text-[#FDF6EC]">{task.recurrence.occurrences_per_period}</span>
                    </div>
                  )}
                  {task.recurrence.days_of_week && task.recurrence.days_of_week.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#C4A484]">Days of week:</span>
                      <span className="text-[#FDF6EC]">
                        {task.recurrence.days_of_week.map(day => {
                          const dayMap = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 7: 'Sun' };
                          return dayMap[day];
                        }).join(', ')}
                      </span>
                    </div>
                  )}
                  {task.recurrence.day_of_month && (
                    <div className="flex justify-between">
                      <span className="text-[#C4A484]">Day of month:</span>
                      <span className="text-[#FDF6EC]">{task.recurrence.day_of_month}</span>
                    </div>
                  )}
                                     {task.recurrence.preferred_time && (
                     <div className="flex justify-between">
                       <span className="text-[#C4A484]">Preferred time:</span>
                       <span className="text-[#FDF6EC]">
                         {formatTime(task.recurrence.preferred_time)}
                       </span>
                     </div>
                   )}
                  {task.recurrence.end_date && (
                    <div className="flex justify-between">
                      <span className="text-[#C4A484]">Ends on:</span>
                      <span className="text-[#FDF6EC]">{format(new Date(task.recurrence.end_date), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  {task.recurrence.end_after_occurrences && (
                    <div className="flex justify-between">
                      <span className="text-[#C4A484]">Ends after:</span>
                      <span className="text-[#FDF6EC]">{task.recurrence.end_after_occurrences} occurrences</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Original Instruction */}
          {task?.original_instruction && (
            <div>
              <h3 className="text-lg font-medium text-[#FDF6EC] mb-2">Original Instruction</h3>
              <p className="text-[#C4A484] bg-[#3B2F2F] border border-[#8B7355] p-3 rounded-lg">
                {task.original_instruction}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t border-[#8B7355]">
            <Button variant="primary" size="xl" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default TaskInfo;
