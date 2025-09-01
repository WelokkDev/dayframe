import { format } from "date-fns";
import { ClockIcon } from "@radix-ui/react-icons";

const CompletedTask = ({ task }) => {
    const completedDate = task.completed_at ? format(new Date(task.completed_at), "MMM d, yyyy 'at' h:mm a") : "Unknown";
    const scheduledDate = task.scheduled_at ? format(new Date(task.scheduled_at), "MMM d") : "No due date";

    return (
        <div className="group bg-[#3B2F2F] border border-[#6B5B5B] rounded-xl p-4 transition-all duration-200">
            <div className="flex items-center space-x-4">
                {/* Completed Checkbox */}
                <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#4ADE80] border-2 border-[#4ADE80] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="flex items-center space-x-1 text-[#9CA3AF]">
                            <ClockIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Due: {scheduledDate}</span>
                        </div>
                        {task.repeat_is_true && (
                            <div className="flex items-center space-x-1">
                                <div className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full"></div>
                                <span className="text-xs text-[#4ADE80] font-medium">Repeats</span>
                            </div>
                        )}
                    </div>
                    
                    <h3 className="text-[#E5E7EB] font-medium text-lg leading-tight line-through">
                        {task.title}
                    </h3>
                    
                    {task.original_instruction && (
                        <p className="text-sm text-[#9CA3AF] mt-1 line-clamp-2">
                            {task.original_instruction}
                        </p>
                    )}

                    <div className="mt-2 text-xs text-[#4ADE80] font-medium">
                        ✓ Completed on {completedDate}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletedTask;
