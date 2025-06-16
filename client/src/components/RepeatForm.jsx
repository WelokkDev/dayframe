import React, { useState, useRef, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval } from "date-fns";
import MiniCalendar from "./MiniCalendar";
import TextField from "./TextField";
import Select from "./Select.jsx";
import Toggle from "./Toggle.jsx"
import DatePicker from "./DatePicker.jsx";

const RepeatForm = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

    const [repeatEnd, setRepeatEnd] = useState(true)

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
        Repeat
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-[var(--foreground)] rounded-lg shadow-lg p-8 border border-gray-200 w-max">
            <p className="font-semibold ">Repeat</p>
            <div className="flex items-center gap-x-2 pb-4">
                <span>Every</span>
                <TextField type="number" className="w-1/4">1</TextField>
                <Select
                    options={[ 
                        { label: 'Days', value: "day" },
                        { label: 'Weeks', value: "week"},
                        { label: 'Months', value: "month"}
                    ]}
                />
            </div>

            <p className="font-semibold ">Ends</p>
            <div className="flex items-center gap-x-2 pb-4">
                <Toggle value={repeatEnd} onChange={setRepeatEnd}>Never</Toggle>
                <DatePicker>Pick Date</DatePicker>
            </div>
        </div>
      )}
    </div>
    
   
  );
};

export default RepeatForm;