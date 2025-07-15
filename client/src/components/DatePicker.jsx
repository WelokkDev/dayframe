import React, { useState, useRef, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval } from "date-fns";
import MiniCalendar from "./MiniCalendarSingleSelect";

const DatePicker = ({ children, date, setDate }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef();



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

    const activeClass = "bg-[#FFD97D] font-semibold text-[#664700] hover:bg-[#FFD061] active:bg-[#FFC94D]";
    const inactiveClass = "border border-gray-300 hover:border-[var(--accent)] hover:border-2";

    const handleSelect = (date) => {
        setDate(date);
    }

    return (
        <div className="relative w-full" ref={pickerRef} onClick={(e) => e.stopPropagation()}>
        
        <button type="button" onClick={(e) => handleClick(e)} className={` rounded-md px-2 py-2 focus:outline-none w-full
            ${date === null ? inactiveClass : activeClass}`}>
            {children}
        </button>
        {isOpen && (
            <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-max">
            <MiniCalendar selectedDate={date} onChange={handleSelect} />    
            </div>
        )}
        </div>
    );
};

export default DatePicker;