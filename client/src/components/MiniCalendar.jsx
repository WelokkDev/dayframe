import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval, addDays } from "date-fns";
import Button from "./Button.jsx";

const MiniCalendar = ({ currentMonth, setCurrentMonth, selectedDates, setSelectedDates }) => {

  
  
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const isSameDay = (d1, d2) => format(d1, "yyyy-MM-dd") === format(d2, "yyyy-MM-dd");

  const handleDateClick = (date) => {
    const exists = selectedDates.some(d => isSameDay(d, date));
    
    const dayAfter = addDays(date, 1);
    const dayBefore = addDays(date, -1)

    const isAdjacent = selectedDates.some(d => isSameDay(d, dayBefore) || isSameDay(d, dayAfter));

    if (exists) {
      if (selectedDates.length === 1) {
        setSelectedDates(prev => prev.filter(d => !isSameDay(d, date)));
      }
      else {
        const times = selectedDates.map(d => d.getTime());
        const start = new Date(Math.min(...times));
        const end = new Date(Math.max(...times));
        if (isSameDay(date, start)) {
          setSelectedDates(prev => prev.filter(d => !isSameDay(d, start)));
        } else if (isSameDay(date, end)) {
          setSelectedDates(prev => prev.filter(d => !isSameDay(d, end)));
        }
      }
    }
    else if (selectedDates.length === 0 || isAdjacent) {
      setSelectedDates(prev => [...prev, date]);
    }
    else {
      alert("Error!")
    }

  }

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
          {days.map((day) => 
          {
            const isSelected = selectedDates.some(d => isSameDay(d, day));
            

            return (
              <button
                type="button"
                key={day}
                onClick={() => handleDateClick(day)}
                className={`p-2 rounded-full ${isSelected ? "bg-[var(--accent)] text-[var(--text-dark)]" : "hover:bg-gray-300"}`}
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

export default MiniCalendar;