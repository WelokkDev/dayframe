import { Link } from "react-router";
import TaskList from "../components/TaskList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A3C3C] to-[#3B2F2F] py-12">
      <div className="max-w-4xl mx-auto px-6 py-8">


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
