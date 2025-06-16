import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval } from "date-fns";

const MiniCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  return (
    <div className="w-full h-full ">
      <div className="w-full mx-auto p-4 rounded-lg h-full">
        <div className="flex justify-between items-center h=[10%]">
          <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 bg-gray-200 rounded">◀</button>
          <h2 className="text-lg font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
          <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 bg-gray-200 rounded">▶</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[var(--text-dark)] h-[90%]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-bold text-[var(--text-dark)]">{day}</div>
          ))}
          {days.map((day) => (
            <button
              type="button"
              key={day}
              onClick={() => setSelectedDate(day)}
              className={`p-2 rounded-full ${format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") ? "bg-[var(--accent)] text-[var(--text-dark)]" : "hover:bg-gray-300"}`}
            >
              {format(day, "d")}
            </button>
          ))}
        </div>
      </div>
    </div>
   
  );
};

export default MiniCalendar;