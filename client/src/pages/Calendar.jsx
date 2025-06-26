import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider.jsx";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval } from "date-fns";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const fetchTasks = async () => {
        try {
          const res = await fetchWithAuth(`http://localhost:3000/tasks`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          });
          const data = await res.json();
          if (res.ok) {
            setTasks(data);
            console.log(data)
          }
          else {
            console.log("Fetch error:", data.error)
          }
        } catch (err) {
          console.error("Server error:", err)
        }
      }
      fetchTasks();
  }, [])

  const taskMap = {};
  tasks.forEach(task => {
    const key = format(new Date(task.start_date), "yyyy-MM-dd");
    if (task.cancelled) taskMap[key] = "failed";
    else {
      taskMap[key] = "completed";
    }
  })

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });


  return (
    <div className="w-full h-full">
      <div className="w-full mx-auto p-4 rounded-lg h-full">
        <div className="flex justify-between items-center h=[10%]">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 bg-gray-200 rounded">◀</button>
          <h2 className="text-lg font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 bg-gray-200 rounded">▶</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[var(--text-dark)] h-[90%]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-bold text-[var(--text-dark)]">{day}</div>
          ))}
          {days.map((day) => {

            let bgColor = "hover:bg-gray-300";
            if (format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
              bgColor = "bg-[var(--accent)] text-[var(--text-dark)]";
            }
            else if (taskMap[format(day, "yyyy-MM-dd")] == "failed") {
               bgColor = "bg-red-300 text-[var(--text-dark)]";
            }

            return(
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`p-2 rounded-full ${bgColor}`}
              >
                {format(day, "d")}
              </button>
            )
        })}
        </div>
      </div>
    </div>
   
  );
};

export default Calendar;