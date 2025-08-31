import { useState } from "react";
import Button from "./Button";
import Task from "./Task";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useTasks } from "../context/TaskProvider";

export default function AIPromptInterface() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { refreshTasksAfterAI, incompleteTasks } = useTasks();

  const handleGenerateTasks = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
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

      // Refresh the task list to show the new tasks
      await refreshTasksAfterAI();
      // Clear the prompt after successful generation
      setPrompt("");
    } catch (error) {
      console.error('Error generating tasks:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full p-12 flex justify-center">
      <div className="flex flex-col items-center w-full max-w-4xl">
        <h1 className="text-4xl text-left text-[var(--background)] mb-8">
          AI Task Generator & Overview
        </h1>
        
        <div className="w-full space-y-6">
          {/* Prompt Input */}
          <div className="space-y-4">
            <label className="block text-[var(--background)] text-lg font-medium">
              Describe what you need to do:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Plan my study schedule for tomorrow' or 'Remind me to buy groceries on Sunday and finish my essay by Monday'"
              className="w-full h-32 p-4 border border-[var(--accent)] rounded-xl bg-[var(--background)] text-[var(--text)] placeholder-[var(--text-light)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <Button
              variant="primary"
              size="xl"
              onClick={handleGenerateTasks}
              disabled={!prompt.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? "Generating Tasks..." : "Generate Tasks"}
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center space-y-4 py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
              <p className="text-[var(--background)] text-lg">
                AI is analyzing your request...
              </p>
            </div>
          )}

          {/* Upcoming Tasks */}
          <div className="space-y-4">
            <h2 className="text-2xl text-[var(--background)] font-semibold">
              Upcoming Tasks
            </h2>
            {incompleteTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--background)] text-lg">
                  No upcoming tasks. Create some tasks using the AI generator above!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {incompleteTasks.map((task) => (
                  <Task key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
