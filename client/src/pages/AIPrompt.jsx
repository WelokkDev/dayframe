import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useTasks } from "../context/TaskProvider";

export default function AIPrompt() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState(null);
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const { refreshTasksAfterAI } = useTasks();
  const navigate = useNavigate();

  const handleGenerateTasks = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setAiMessage(null);
    setGeneratedTasks([]);
    
    try {
      const response = await fetchWithAuth('http://localhost:3000/ai/generate-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: prompt })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate tasks');
      }

      // Show success message and generated tasks
      setAiMessage({
        type: 'success',
        text: data.interpretation || 'Tasks created successfully!'
      });
      
      setGeneratedTasks(data.tasks || []);
      
      // Refresh the task list to show the new tasks
      await refreshTasksAfterAI();
      
      // Clear the prompt after successful generation
      setPrompt("");
      
      // Clear success message and tasks after 5 seconds
      setTimeout(() => {
        setAiMessage(null);
        setGeneratedTasks([]);
      }, 5000);
    } catch (error) {
      console.error('Error generating tasks:', error);
      setAiMessage({
        type: 'error',
        text: error.message
      });
    } finally {
      setIsLoading(false);
    }
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
      <div className="max-w-3xl mx-auto px-6 py-8">
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
            AI Task Generator
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
                placeholder="e.g., 'Plan my study schedule for tomorrow' or 'Remind me to buy groceries on Sunday and finish my essay by Monday'"
                className="w-full h-32 p-4 border border-[#8B7355] rounded-xl bg-[#3B2F2F] text-[#FDF6EC] placeholder-[#C4A484] resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD97D] focus:border-transparent transition-all duration-200"
              />
            </div>
            
            {/* AI Message */}
            {aiMessage && (
              <div className={`p-4 rounded-xl transition-all duration-300 ${
                aiMessage.type === 'success' 
                  ? 'bg-[#2D4A2D] border border-[#4A7C4A]' 
                  : 'bg-[#4A2D2D] border border-[#7C4A4A]'
              }`}>
                <p className={`text-sm ${
                  aiMessage.type === 'success' 
                    ? 'text-[#A8D5A8]' 
                    : 'text-[#D5A8A8]'
                }`}>
                  {aiMessage.text}
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
                  <span>Creating tasks...</span>
                </div>
              ) : (
                "Generate Tasks"
              )}
            </Button>
          </div>
        </div>

        {/* Generated Tasks Preview */}
        {generatedTasks.length > 0 && (
          <div className="bg-[#4A3C3C] border border-[#8B7355] rounded-2xl shadow-lg p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#FDF6EC]">
                Generated Tasks
              </h2>
              <span className="text-sm text-[#C4A484]">
                {generatedTasks.length} {generatedTasks.length === 1 ? 'task' : 'tasks'} created
              </span>
            </div>
            
            <div className="space-y-3">
              {generatedTasks.map((task, index) => (
                <div 
                  key={index}
                  className="bg-[#3B2F2F] border border-[#8B7355] rounded-xl p-4 flex items-center space-x-3"
                >
                  <div className="w-2 h-2 bg-[#FFD97D] rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="text-[#FDF6EC] font-medium">
                      {task.title}
                    </h3>
                    {task.original_instruction && (
                      <p className="text-sm text-[#C4A484] mt-1">
                        {task.original_instruction}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-[#C4A484] text-sm">
                Tasks have been added to your main task list
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
