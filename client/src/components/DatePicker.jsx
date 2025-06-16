import React, { useState, useRef, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval } from "date-fns";
import MiniCalendar from "./MiniCalendar";

const DatePicker = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef();

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const handleClick = (e) => {
    e.stopPropagation(); // Prevents modal from closing
    if (isOpen == true) {
      setIsOpen(false)
    }
    else {
      setIsOpen(true)
    }
  }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    };
  }, []);

  return (
    <div className="relative w-full" ref={pickerRef} onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={(e) => handleClick(e)}className="border border-gray-300 rounded-md px-2 py-2 focus:border-[#FFD97D] focus:border-2 focus:outline-none w-full">
        Due Date
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-max">
          <MiniCalendar />    
        </div>
      )}
    </div>
    
   
  );
};

export default DatePicker;