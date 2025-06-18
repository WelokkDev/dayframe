import React, { useState, useRef, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval } from "date-fns";
import MiniCalendar from "./MiniCalendar";
import TextField from "./TextField";
import Select from "./Select.jsx";
import Toggle from "./Toggle.jsx"
import DatePicker from "./DatePicker.jsx";
import Button from './Button.jsx';

const RepeatForm = ({ repeat, setRepeat }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [repeatEndDate, setRepeatEndDate] = useState(repeat.repeat_ends_on);
  const [repeatInterval, setRepeatInterval] = useState(repeat.repeat_interval);
  const [repeatUnit, setRepeatUnit] = useState(repeat.repeat_unit);

  const [isOpen, setIsOpen] = useState(false)
  const [isActive, setIsActive] = useState(false);
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

  const handleApply = () => {
    setRepeat({
      repeat_is_true: true,
      repeat_interval: repeatInterval,
      repeat_unit: repeatUnit,
      repeat_ends_on: repeatEndDate,
    });
    
    setIsOpen(false);
    setIsActive(true);
  }

  useEffect(() => {
    if (!isOpen) {
      setRepeatEndDate(repeat.repeat_ends_on);
      setRepeatInterval(repeat.repeat_interval);
      setRepeatUnit(repeat.repeat_unit);
    }
  }, [isOpen]); // Only runs when isOpen changes

  const handleCancel = () => {
    setIsOpen(false);
  }

  return (
    <div className="relative w-full" ref={pickerRef} onClick={(e) => e.stopPropagation()}>
      
      <button type="button" onClick={(e) => handleClick(e)}className={`border  rounded-md px-2 py-2 focus:border-[#FFD97D] focus:border-2 focus:outline-none w-full
      ${isActive ? "bg-[#FFD97D] border-[var(--accent)] text-[#664700] hover:bg-[#FFD061] active:bg-[#FFC94D]" : "border-gray-300"}`}>
        Repeat
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-[var(--foreground)] rounded-lg shadow-lg p-8 border border-gray-200 w-max">
          <p className="font-semibold ">Repeat</p>
          <div className="flex items-center gap-x-2 pb-4">
            <span>Every</span>
            <TextField type="number" className="w-1/4" value={repeatInterval} onChange={(e) => setRepeatInterval(e.target.value)}>1</TextField>
            <Select   
              value={repeatUnit}
              onChange={(e) => setRepeatUnit(e.target.value)}
              options={[ 
                { label: 'Days', value: "day" },
                { label: 'Weeks', value: "week"},
                { label: 'Months', value: "month"}
              ]}
            />
          </div>
          <p className="font-semibold ">Ends</p>
          <div className="flex items-center gap-x-2 pb-4">
            <Toggle value={repeatEndDate} onChange={setRepeatEndDate}>Never</Toggle>
            <DatePicker repeatEndDate={repeatEndDate} setRepeatEndDate={setRepeatEndDate}>Pick Date</DatePicker>
          </div>
          <div className="flex justify-between">
            <Button size="xl" variant="cancel_red" onClick={handleCancel}>Cancel</Button>
            <Button size="xl" variant="form" onClick={handleApply}>Apply</Button>
          </div>
          

        </div>
      )}
    </div>
    
   
  );
};

export default RepeatForm;