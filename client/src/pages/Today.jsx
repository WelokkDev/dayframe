import { useTasks } from "../context/TaskProvider";
import Task from "../components/HomeTask";
import { format } from "date-fns";

export default function Today() {
  const { todaysTasks, loading, tasks } = useTasks();

  // Calculate today's date for display
  const today = new Date();
  const todayFormatted = format(today, "EEEE, MMMM d, yyyy");

  // Calculate progress for today's tasks
  const todaysAllTasks = tasks.filter(task => {
    if (!task.scheduled_at) return false;
    const taskDate = new Date(task.scheduled_at);
    return taskDate.toDateString() === today.toDateString();
  });

  const completedTodayTasks = todaysAllTasks.filter(task => task.completed_at);
  const progressPercentage = todaysAllTasks.length > 0 
    ? Math.round((completedTodayTasks.length / todaysAllTasks.length) * 100) 
    : 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4A3C3C] to-[#3B2F2F] py-12">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD97D] mx-auto mb-4"></div>
              <h1 className="text-2xl text-[#FDF6EC]">Loading today's tasks...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A3C3C] to-[#3B2F2F] py-12">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#FDF6EC] mb-2">
            Today's Tasks
          </h1>
          <p className="text-lg text-[#C4A484]">
            {todayFormatted}
          </p>
        </div>

        {/* Tasks Content */}
        {todaysTasks.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            {todaysAllTasks.length > 0 ? (
              /* All tasks completed */
              <>
                <div className="w-24 h-24 bg-gradient-to-br from-[#FFD97D] to-[#FFB84D] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-[#3B2F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-[#FDF6EC] mb-3">
                  🎉 All tasks completed!
                </h2>
                <p className="text-[#C4A484] mb-6 max-w-md mx-auto">
                  Great job! You've completed all {todaysAllTasks.length} task{todaysAllTasks.length !== 1 ? 's' : ''} for today. 
                  Time to relax or tackle tomorrow's tasks!
                </p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href="/ai-prompt" 
                    className="px-6 py-3 bg-[#FFD97D] text-[#3B2F2F] rounded-xl font-medium hover:bg-[#FFD061] transition-colors duration-200"
                  >
                    Create More Tasks
                  </a>
                  <a 
                    href="/calendar" 
                    className="px-6 py-3 bg-[#3B2F2F] text-[#FDF6EC] border border-[#8B7355] rounded-xl font-medium hover:bg-[#4A3C3C] transition-colors duration-200"
                  >
                    View Calendar
                  </a>
                </div>
              </>
            ) : (
              /* No tasks at all */
              <>
                <div className="w-24 h-24 bg-[#3B2F2F] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-[#FDF6EC] mb-3">
                  No tasks for today!
                </h2>
                <p className="text-[#C4A484] mb-6 max-w-md mx-auto">
                  You're all caught up! Enjoy your free time or create some new tasks to stay productive.
                </p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href="/ai-prompt" 
                    className="px-6 py-3 bg-[#FFD97D] text-[#3B2F2F] rounded-xl font-medium hover:bg-[#FFD061] transition-colors duration-200"
                  >
                    Create Tasks
                  </a>
                  <a 
                    href="/calendar" 
                    className="px-6 py-3 bg-[#3B2F2F] text-[#FDF6EC] border border-[#8B7355] rounded-xl font-medium hover:bg-[#4A3C3C] transition-colors duration-200"
                  >
                    View Calendar
                  </a>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Tasks List */
          <div className="space-y-6">
            {/* Task Count and Progress */}
            <div className="bg-[#3B2F2F] rounded-2xl p-6 border border-[#8B7355]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#FDF6EC]">
                  Your Tasks Today
                </h2>
                <span className="text-sm text-[#C4A484]">
                  {todaysTasks.length} remaining • {completedTodayTasks.length} completed
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-[#4A3C3C] rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-[#FFD97D] to-[#FFB84D] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-[#8B7355]">
                  {progressPercentage}% complete
                </p>
                {progressPercentage === 100 && todaysAllTasks.length > 0 && (
                  <span className="text-xs text-[#FFD97D] font-medium">
                    🎉 All done for today!
                  </span>
                )}
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {todaysTasks.map((task) => (
                <Task key={task.id} task={task} />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center space-x-4 pt-6">
              <a 
                href="/ai-prompt" 
                className="px-6 py-3 bg-[#FFD97D] text-[#3B2F2F] rounded-xl font-medium hover:bg-[#FFD061] transition-colors duration-200"
              >
                Add More Tasks
              </a>
              <a 
                href="/calendar" 
                className="px-6 py-3 bg-[#3B2F2F] text-[#FDF6EC] border border-[#8B7355] rounded-xl font-medium hover:bg-[#4A3C3C] transition-colors duration-200"
              >
                View Calendar
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}