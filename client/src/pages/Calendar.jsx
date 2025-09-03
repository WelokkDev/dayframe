import React, { useState, useEffect, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfDay } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "@radix-ui/react-icons";
import { useTasks } from "../context/TaskProvider";
import TaskList from "../components/TaskList";
import Modal from "../components/Modal";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dailyTasks, setDailyTasks] = useState({});
  const { tasks, fetchTasks, fetchTasksByDate } = useTasks();

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Generate calendar days
  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(currentMonth)),
      end: endOfWeek(endOfMonth(currentMonth)),
    });
  }, [currentMonth]);

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    
    // Return cached tasks if available
    if (dailyTasks[dateKey]) {
      return dailyTasks[dateKey];
    }
    
    // Fallback to filtering from all tasks
    if (!tasks || tasks.length === 0) return [];
    
    const targetDate = startOfDay(date);
    return tasks.filter(task => {
      if (!task.scheduled_at) return false;
      const taskDate = startOfDay(new Date(task.scheduled_at));
      return isSameDay(taskDate, targetDate);
    });
  };

  // Sort tasks by time (specific times first, then no-time tasks)
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

  const handleDateClick = async (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
    
    // Fetch tasks for this specific date
    const dateKey = format(date, 'yyyy-MM-dd');
    if (!dailyTasks[dateKey]) {
      const tasksForDate = await fetchTasksByDate(date);
      setDailyTasks(prev => ({
        ...prev,
        [dateKey]: tasksForDate
      }));
    }
  };

  const getTasksCountForDate = (date) => {
    return getTasksForDate(date).length;
  };

  const getSelectedDateTasks = () => {
    return sortTasksByTime(getTasksForDate(selectedDate));
  };

  const formatMonthYear = (date) => {
    return format(date, "MMMM yyyy");
  };

  const formatDayNumber = (date) => {
    return format(date, "d");
  };

  const isCurrentMonth = (date) => {
    return isSameMonth(date, currentMonth);
  };

  const isSelected = (date) => {
    return isSameDay(date, selectedDate);
  };

  const isCurrentDay = (date) => {
    return isToday(date);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#4A3C3C] via-[#3B2F2F] to-[#2A1F1F] p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#FFD97D] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8B7355] rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto h-full relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-in slide-in-from-top-4 duration-700">
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
          
          {/* Month Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-3 bg-[#3B2F2F] hover:bg-[#4A3C3C] rounded-xl transition-all duration-200 group shadow-lg hover:shadow-xl"
            >
              <ChevronLeftIcon className="w-5 h-5 text-[#C4A484] group-hover:text-[#FFD97D] transition-colors duration-200" />
            </button>
            
            <h2 className="text-2xl font-bold text-[#FDF6EC] min-w-[200px] text-center bg-gradient-to-r from-[#FDF6EC] to-[#C4A484] bg-clip-text text-transparent">
              {formatMonthYear(currentMonth)}
            </h2>
            
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-3 bg-[#3B2F2F] hover:bg-[#4A3C3C] rounded-xl transition-all duration-200 group shadow-lg hover:shadow-xl"
            >
              <ChevronRightIcon className="w-5 h-5 text-[#C4A484] group-hover:text-[#FFD97D] transition-colors duration-200" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-[#3B2F2F] rounded-3xl p-8 shadow-2xl border border-[#8B7355] backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-700">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-4 mb-8">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center">
                <div className="text-sm font-semibold text-[#C4A484] uppercase tracking-wider bg-gradient-to-r from-[#C4A484] to-[#8B7355] bg-clip-text text-transparent">
                  {day}
                </div>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-4">
            {days.map((day) => {
              const taskCount = getTasksCountForDate(day);
              const hasTasks = taskCount > 0;
              
              return (
                <button
                  key={day.toString()}
                  onClick={() => handleDateClick(day)}
                  disabled={!isCurrentMonth(day)}
                  className={`
                    relative aspect-square rounded-2xl transition-all duration-300 group
                    ${isCurrentMonth(day) 
                      ? 'hover:bg-[#4A3C3C] hover:scale-105 cursor-pointer' 
                      : 'opacity-30 cursor-not-allowed'
                    }
                    ${isSelected(day) 
                      ? 'bg-[#FFD97D] text-[#3B2F2F] shadow-lg scale-105' 
                      : 'bg-transparent text-[#FDF6EC]'
                    }
                    ${isCurrentDay(day) && !isSelected(day)
                      ? 'ring-2 ring-[#FFD97D] ring-opacity-50'
                      : ''
                    }
                  `}
                >
                  {/* Day Number */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`
                      text-lg font-semibold transition-all duration-200
                      ${isSelected(day) ? 'text-[#3B2F2F]' : 'text-[#FDF6EC]'}
                    `}>
                      {formatDayNumber(day)}
                    </span>
                  </div>

                  {/* Task Indicator */}
                  {hasTasks && (
                    <div className={`
                      absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${isSelected(day) 
                        ? 'bg-[#3B2F2F] text-[#FFD97D]' 
                        : 'bg-[#FFD97D] text-[#3B2F2F]'
                      }
                      shadow-lg transform transition-transform duration-200 group-hover:scale-110
                    `}>
                      {taskCount > 9 ? '9+' : taskCount}
                    </div>
                  )}

                  {/* Hover Effect */}
                  {isCurrentMonth(day) && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFD97D] to-[#FFB84D] opacity-0 group-hover:opacity-10 transition-all duration-300" />
                  )}
                  
                  {/* Subtle border for current month days */}
                  {isCurrentMonth(day) && !isSelected(day) && (
                    <div className="absolute inset-0 rounded-2xl border border-[#8B7355] border-opacity-20" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Tasks Modal */}
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
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-3 text-[#8B7355] hover:text-[#FFD97D] hover:bg-[#3B2F2F] rounded-xl transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
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