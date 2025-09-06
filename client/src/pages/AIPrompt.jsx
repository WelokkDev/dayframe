import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Task from "../components/Task";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useTasks } from "../context/TaskProvider";

export default function AIPrompt() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { refreshTasksAfterAI, incompleteTasks } = useTasks();
  const navigate = useNavigate();

  const handleGenerateTasks = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetchWithAuth("http://localhost:3000/ai/generate-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        // Show tasks for confirmation instead of creating immediately
        setGeneratedTasks(data.tasks);
        setShowConfirmation(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error generating tasks:", error);
      alert("Failed to generate tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmTask = async (taskIndex) => {
    try {
      const task = generatedTasks[taskIndex];
      
      // Add confirmation animation to the task element
      const taskElement = document.querySelector(`[data-task-index="${taskIndex}"]`);
      if (taskElement) {
        taskElement.classList.add('animate-taskConfirm');
      }
      
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create the confirmed task using the AI service
      const response = await fetchWithAuth("http://localhost:3000/ai/create-confirmed-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskData: task,
          originalInstruction: task.original_instruction
        }),
      });

      if (response.ok) {
        // Remove the confirmed task from the list
        const updatedTasks = generatedTasks.filter((_, index) => index !== taskIndex);
        setGeneratedTasks(updatedTasks);
        
        // If no more tasks to confirm, hide confirmation and refresh
        if (updatedTasks.length === 0) {
          setShowConfirmation(false);
          setPrompt("");
          setSuccessMessage("Task created successfully! 🎉");
          setTimeout(() => setSuccessMessage(""), 3000); // Hide after 3 seconds
          await refreshTasksAfterAI();
        }
      } else {
        const errorData = await response.json();
        alert(`Error creating task: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleRejectTask = (taskIndex) => {
    // Add rejection animation to the task element
    const taskElement = document.querySelector(`[data-task-index="${taskIndex}"]`);
    if (taskElement) {
      taskElement.style.transform = 'translateX(100%)';
      taskElement.style.opacity = '0';
      taskElement.style.transition = 'all 0.3s ease-out';
    }
    
    // Remove the rejected task after animation
    setTimeout(() => {
      const updatedTasks = generatedTasks.filter((_, index) => index !== taskIndex);
      setGeneratedTasks(updatedTasks);
      
      // If no more tasks to confirm, hide confirmation
      if (updatedTasks.length === 0) {
        setShowConfirmation(false);
      }
    }, 300);
  };

  const handleRetry = () => {
    setGeneratedTasks([]);
    setShowConfirmation(false);
    setPrompt("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateTasks();
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A3C3C] to-[#3B2F2F]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBackToHome}
            className="mb-6 inline-flex items-center space-x-2 text-[#C4A484] hover:text-[#FFD97D] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Home</span>
          </button>
          
          <h1 className="text-4xl font-bold text-[#FDF6EC] mb-4">
            AI Task Generator & Overview
          </h1>
          <p className="text-lg text-[#E8D5C4]">
            Describe what you need to do in natural language
          </p>
        </div>

        {/* AI Prompt Section */}
        <div className="bg-[#4A3C3C] border border-[#8B7355] rounded-2xl shadow-lg p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[#FDF6EC] text-lg font-medium mb-3">
                What do you need to do?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 'Buy groceries tomorrow', 'Go to gym every Monday', 'Submit report by Friday 5pm'"
                className="w-full h-32 p-4 border border-[#8B7355] rounded-xl bg-[#3B2F2F] text-[#FDF6EC] placeholder-[#C4A484] resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD97D] focus:border-transparent transition-all duration-200"
                disabled={isLoading}
              />
            </div>
            
            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-[#2D4A2D] border border-[#4A7C4A] rounded-xl animate-fadeIn">
                <p className="text-[#A8D5A8] text-sm">
                  {successMessage}
                </p>
              </div>
            )}

            <Button
              variant="primary"
              size="xl"
              onClick={handleGenerateTasks}
              disabled={!prompt.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                "Generate Tasks"
              )}
            </Button>
          </div>
        </div>

        {/* Task Confirmation Section */}
        {showConfirmation && (
          <div className="bg-[#4A3C3C] border border-[#8B7355] rounded-2xl shadow-lg p-8 mb-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#FDF6EC]">
                Review Generated Tasks
              </h2>
              <Button onClick={handleRetry} variant="secondary">
                Try Again
              </Button>
            </div>
            
            <div className="space-y-4">
              {generatedTasks.map((task, index) => (
                <div
                  key={index}
                  data-task-index={index}
                  className="bg-[#3B2F2F] border border-[#8B7355] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-[#FDF6EC] mb-2">
                        {task.title}
                      </h3>
                      {task.category && (
                        <p className="text-sm text-[#C4A484] mb-2">
                          Category: {task.category}
                        </p>
                      )}
                      {task.due_at && (
                        <p className="text-sm text-[#C4A484] mb-2">
                          Due: {new Date(task.due_at).toLocaleDateString()}
                        </p>
                      )}
                      {task.recurrence?.frequency && (
                        <p className="text-sm text-[#C4A484] mb-2">
                          Repeats: {task.recurrence.frequency}
                          {task.recurrence.interval_value > 1 && ` every ${task.recurrence.interval_value} ${task.recurrence.frequency}`}
                          {task.recurrence.days_of_week && ` on ${task.recurrence.days_of_week.map(day => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day - 1]).join(', ')}`}
                          {task.recurrence.end_date && (
                            <span className="text-[#FFD97D]"> • Ends {new Date(task.recurrence.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          )}
                        </p>
                      )}
                      {task.original_instruction && (
                        <p className="text-xs text-[#8B7355] mt-2 italic">
                          "{task.original_instruction}"
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleConfirmTask(index)}
                        className="p-2 bg-[#2D4A2D] text-[#A8D5A8] border border-[#4A7C4A] rounded-full hover:bg-[#4A7C4A] hover:text-[#D5F5D5] transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                        title="Confirm this task"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRejectTask(index)}
                        className="p-2 bg-[#4A2D2D] text-[#D5A8A8] border border-[#7C4A4A] rounded-full hover:bg-[#7C4A4A] hover:text-[#F5D5D5] transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                        title="Reject this task"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
