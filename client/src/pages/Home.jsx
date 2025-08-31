import { Link } from "react-router";
import TaskList from "../components/TaskList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A3C3C] to-[#3B2F2F]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#FDF6EC] mb-4">
            Your Tasks
          </h1>
          <p className="text-lg text-[#E8D5C4] mb-6">
            Manage your tasks and stay organized
          </p>
          <Link 
            to="/ai-prompt"
            className="inline-flex items-center space-x-2 bg-[#FFD97D] text-[#3B2F2F] px-6 py-3 rounded-xl font-medium hover:bg-[#FFD061] transition-colors shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Tasks with AI</span>
          </Link>
        </div>

        {/* Task List */}
        <TaskList 
          title="Upcoming Tasks"
          emptyMessage="No tasks yet"
          emptySubMessage="Create your first task using the AI generator above!"
        />
      </div>
    </div>
  );
}
