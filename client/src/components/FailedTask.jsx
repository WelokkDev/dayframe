import { format } from "date-fns";
import { ClockIcon } from "@radix-ui/react-icons";
import { formatTaskDateTime } from "../utils/dateTimeUtils";

const FailedTask = ({ task }) => {
    const failedDate = task.cancelled ? format(new Date(task.instance_created_at || task.created_at), "MMM d, yyyy") : "Unknown";
    const scheduledDateTime = formatTaskDateTime(task.scheduled_at, task.recurrence?.preferred_time);

    return (
        <div className="group bg-[#2A1F1F] rounded-xl p-4 transition-all duration-200 border border-[#3A2F2F] shadow-sm">
            <div className="flex items-center space-x-4">
                {/* Failed Icon */}
                <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#EF4444] border-2 border-[#EF4444] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="flex items-center space-x-1 text-[#6B5B5B]">
                            <ClockIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Due: {scheduledDateTime}</span>
                        </div>
                        {task.repeat_is_true && (
                            <div className="flex items-center space-x-1">
                                <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                <span className="text-xs text-[#EF4444] font-medium">Repeats</span>
                            </div>
                        )}
                    </div>
                    
                    <h3 className="text-[#E5E7EB] font-medium text-lg leading-tight">
                        {task.title}
                    </h3>
                    
                    {task.original_instruction && (
                        <p className="text-sm text-[#9CA3AF] mt-1 line-clamp-2">
                            {task.original_instruction}
                        </p>
                    )}

                    <div className="mt-2 text-xs text-[#EF4444] font-medium">
                        ✗ Failed on {failedDate}
                    </div>

                    {task.failure_reason && (
                        <div className="mt-2 text-xs text-[#FCA5A5] bg-[#4A2D2D] px-2 py-1 rounded">
                            Reason: {task.failure_reason}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FailedTask;