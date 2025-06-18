import React, { useState, useRef, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval } from "date-fns";
import MiniCalendar from "./MiniCalendar";

const DatePicker = ({ children, onDatesChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);

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

  useEffect(() => {
    if (selectedDates.length === 0) {
      onDatesChange(null, null)
    } else {
      const times = selectedDates.map(d => d.getTime());
      const start = new Date(Math.min(...times));
      const end = new Date(Math.max(...times));
      onDatesChange(start, end);
    }
  }, [selectedDates])

  const activeClass = "bg-[#FFD97D] font-semibold text-[#664700] hover:bg-[#FFD061] active:bg-[#FFC94D]";
  const inactiveClass = "border border-gray-300 hover:border-[var(--accent)] hover:border-2";

  return (
    <div className="relative w-full" ref={pickerRef} onClick={(e) => e.stopPropagation()}>
      
      <button type="button" onClick={(e) => handleClick(e)} className={`rounded-md px-2 py-2  w-full
      ${selectedDates.length != 0 ? activeClass : inactiveClass}`}>
        {children}
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-max">
          <MiniCalendar currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} selectedDates={selectedDates} setSelectedDates={setSelectedDates} />    
        </div>
      )}
    </div>
    
   
  );
};

export default DatePicker;