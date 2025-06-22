import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval } from "date-fns";
import { useNavigate, useLocation } from "react-router";





const Board = () => {
    const currentPath = location.pathname; 
    const getLinkStyle = (path) => {
        return `block px-4 py-2 rounded-xl transition w-full text-left transition-all duration-200 
    ${currentPath === path ? "bg-[var(--accent)] text-[var(--background)] font-semibold" : "text-[var(--text-light)] hover:bg-[#302727] hover:text-[var(--accent)]"}`
    } 


  return (
    <div className="text-[var(--text-dark)]">
      <h1 className="text-xl font-bold ">Welcome!</h1>
      <p className="mt-2 text-[var(--text-muted)]">This the board!</p>
    </div>
   
  );
};

export default Board;