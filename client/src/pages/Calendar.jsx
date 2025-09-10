import React, { useState, useEffect, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfDay } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "@radix-ui/react-icons";
import { useTasks } from "../context/TaskProvider";
import TaskList from "../components/TaskList";
import Modal from "../components/Modal";
import { generateAllTaskInstancesForRange } from "../utils/recurrenceUtils";

const Calendar = () => {
  // State management for calendar functionality
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Currently displayed month
  const [selectedDate, setSelectedDate] = useState(new Date()); // Date selected for viewing tasks
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls daily tasks modal visibility
  
  // Task context for data management
  const { tasks, fetchTasks, fetchTasksByDate } = useTasks();

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /**
   * Memoized function to get all tasks (actual + generated) for the current month
   * Combines existing task instances with generated instances for recurring tasks
   * Only includes current and future dates, filtering out past tasks
   * 
   * @returns {Array} Array of all tasks for the current month
   */
  const getAllTasksForMonth = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const today = startOfDay(new Date());
    
    // Filter actual tasks for current month and future dates only
    const actualTasks = tasks.filter(task => {
      if (!task.scheduled_at) return false;
      const taskDate = new Date(task.scheduled_at);
      return taskDate >= monthStart && taskDate <= monthEnd && taskDate >= today;
    });
    
    // Get unique recurring tasks (not instances) that need additional instances generated
    const recurringTasks = tasks
      .filter(task => task.recurrence && task.recurrence.frequency)
      .reduce((unique, task) => {
        // Use task_id as the key to avoid duplicates
        if (!unique.find(t => t.id === task.task_id)) {
          unique.push({
            id: task.task_id, // Use the original task ID
            title: task.title,
            importance: task.importance,
            category_id: task.category_id,
            original_instruction: task.original_instruction,
            recurrence: task.recurrence
          });
        }
        return unique;
      }, []);
    
    // Generate additional instances for recurring tasks that don't have instances in this month
    // Only generate for current and future dates
    const generatedInstances = generateAllTaskInstancesForRange(recurringTasks, today, monthEnd, actualTasks);
    
    // Combine actual task instances and generated instances
    return [...actualTasks, ...generatedInstances];
  }, [tasks, currentMonth]);

  /**
   * Generate calendar days for the current month view
   * Includes days from previous/next month to fill the calendar grid
   * 
   * @returns {Array} Array of Date objects for the calendar grid
   */
  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(currentMonth)),
      end: endOfWeek(endOfMonth(currentMonth)),
    });
  }, [currentMonth]);

  /**
   * Get tasks for a specific date
   * Filters tasks from the current month's task list by matching date
   * 
   * @param {Date} date - The date to get tasks for
   * @returns {Array} Array of tasks scheduled for the given date
   */
  const getTasksForDate = (date) => {
    const targetDate = startOfDay(date);
    
    return getAllTasksForMonth.filter(task => {
      const taskDate = startOfDay(new Date(task.scheduled_at));
      return isSameDay(taskDate, targetDate);
    });
  };

  /**
   * Sort tasks by time preference
   * Tasks with specific times are shown first, then tasks without specific times
   * Within each group, tasks are sorted by time
   * 
   * @param {Array} tasks - Array of tasks to sort
   * @returns {Array} Sorted array of tasks
   */
  const sortTasksByTime = (tasks) => {
    return tasks.sort((a, b) => {
      const aHasSpecificTime = a.recurrence?.preferred_time && a.recurrence.preferred_time !== "11:59";
      const bHasSpecificTime = b.recurrence?.preferred_time && b.recurrence.preferred_time !== "11:59";
      
      if (aHasSpecificTime && !bHasSpecificTime) return -1;
      if (!aHasSpecificTime && bHasSpecificTime) return 1;
      
      if (aHasSpecificTime && bHasSpecificTime) {
        const aTime = new Date(`2000-01-01 ${a.recurrence.preferred_time}:00`);
        const bTime = new Date(`2000-01-01 ${b.recurrence.preferred_time}:00`);
        return aTime - bTime;
      }
      
      return 0;
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const getSelectedDateTasks = () => {
    return sortTasksByTime(getTasksForDate(selectedDate));
  };

  const isPastDate = (date) => {
    const today = startOfDay(new Date());
    return startOfDay(date) < today;
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#4A3C3C] via-[#3B2F2F] to-[#2A1F1F] p-6 relative overflow-hidden flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#FFD97D] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8B7355] rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full h-full relative z-10 flex flex-col">
        {/* Page Header with Title and Month Navigation */}
        <div className="flex items-center justify-between mb-8 animate-in slide-in-from-top-4 duration-700">
          {/* Title Section */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD97D] to-[#FFB84D] rounded-2xl flex items-center justify-center shadow-lg">
              <CalendarIcon className="w-6 h-6 text-[#3B2F2F]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#FDF6EC] bg-gradient-to-r from-[#FDF6EC] to-[#C4A484] bg-clip-text text-transparent">
                Calendar
              </h1>
              <p className="text-[#C4A484]">Plan your days, track your progress</p>
            </div>
          </div>
          
          {/* Month Navigation Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-3 bg-[#3B2F2F] hover:bg-[#4A3C3C] rounded-xl transition-all duration-200 group shadow-lg hover:shadow-xl"
            >
              <ChevronLeftIcon className="w-5 h-5 text-[#C4A484] group-hover:text-[#FFD97D] transition-colors duration-200" />
            </button>
            
            {/* Current Month/Year Display */}
            <h2 className="text-2xl font-bold text-[#FDF6EC] min-w-[200px] text-center bg-gradient-to-r from-[#FDF6EC] to-[#C4A484] bg-clip-text text-transparent">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-3 bg-[#3B2F2F] hover:bg-[#4A3C3C] rounded-xl transition-all duration-200 group shadow-lg hover:shadow-xl"
            >
              <ChevronRightIcon className="w-5 h-5 text-[#C4A484] group-hover:text-[#FFD97D] transition-colors duration-200" />
            </button>
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="bg-[#3B2F2F] rounded-3xl p-6 shadow-2xl border border-[#8B7355] backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-700 flex-1 flex flex-col">
          {/* Day Headers (Sun, Mon, Tue, etc.) */}
          <div className="grid grid-cols-7 gap-3 mb-4 flex-shrink-0">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center">
                <div className="text-sm font-semibold text-[#C4A484] uppercase tracking-wider bg-gradient-to-r from-[#C4A484] to-[#8B7355] bg-clip-text text-transparent">
                  {day}
                </div>
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-3 flex-1">
            {days.map((day) => {
              const taskCount = getTasksForDate(day).length;
              const hasTasks = taskCount > 0;
              const isPast = isPastDate(day);
              const isSelectable = isSameMonth(day, currentMonth) && !isPast;
              
              return (
                <button
                  key={day.toString()}
                  onClick={() => isSelectable && handleDateClick(day)}
                  disabled={!isSelectable}
                  className={`
                    relative rounded-2xl transition-all duration-300 group
                    ${isSelectable
                      ? 'hover:bg-[#4A3C3C] hover:scale-105 cursor-pointer' 
                      : 'opacity-30 cursor-not-allowed'
                    }
                    ${isPast && isSameMonth(day, currentMonth)
                      ? 'opacity-20 bg-gray-600'
                      : ''
                    }
                    ${isSameDay(day, selectedDate) 
                      ? 'bg-[#FFD97D] text-[#3B2F2F] shadow-lg scale-105' 
                      : 'bg-transparent text-[#FDF6EC]'
                    }
                    ${isToday(day) && !isSameDay(day, selectedDate)
                      ? 'ring-2 ring-[#FFD97D] ring-opacity-50'
                      : ''
                    }
                  `}
                >
                  {/* Day Number Display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`
                      text-lg font-semibold transition-all duration-200
                      ${isSameDay(day, selectedDate) ? 'text-[#3B2F2F]' : 'text-[#FDF6EC]'}
                      ${isPast && isSameMonth(day, currentMonth) ? 'text-gray-400' : ''}
                    `}>
                      {format(day, "d")}
                    </span>
                  </div>

                  {/* Task Count Indicator */}
                  {hasTasks && !isPast && (
                    <div className={`
                      absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${isSameDay(day, selectedDate) 
                        ? 'bg-[#3B2F2F] text-[#FFD97D]' 
                        : 'bg-[#FFD97D] text-[#3B2F2F]'
                      }
                      shadow-lg transform transition-transform duration-200 group-hover:scale-110
                    `}>
                      {taskCount > 9 ? '9+' : taskCount}
                    </div>
                  )}

                  {/* Hover Effect */}
                  {isSelectable && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFD97D] to-[#FFB84D] opacity-0 group-hover:opacity-10 transition-all duration-300" />
                  )}
                  
                  {/* Subtle border for current month days */}
                  {isSameMonth(day, currentMonth) && !isSameDay(day, selectedDate) && !isPast && (
                    <div className="absolute inset-0 rounded-2xl border border-[#8B7355] border-opacity-20" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Tasks Modal - Shows tasks for selected date */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FFD97D] to-[#FFB84D] rounded-xl flex items-center justify-center shadow-lg">
                <CalendarIcon className="w-4 h-4 text-[#3B2F2F]" />
              </div>
              <h2 className="text-2xl font-bold text-[#FDF6EC] bg-gradient-to-r from-[#FDF6EC] to-[#C4A484] bg-clip-text text-transparent">
                Tasks for {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </h2>
            </div>
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-3 text-[#8B7355] hover:text-[#FFD97D] hover:bg-[#3B2F2F] rounded-xl transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Task List for Selected Date */}
          <TaskList
            title=""
            tasks={getSelectedDateTasks()}
            emptyMessage="No tasks scheduled for this day"
            emptySubMessage="Use the AI generator to create some tasks!"
            showCount={false}
            maxHeight="max-h-[70vh]"
            taskType="incomplete"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;