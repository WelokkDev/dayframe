import { useState } from "react";

export default function Button ({ children, onClick, type="button", variant, size, className='', disabled=false }) {
    
    const base = "rounded-xl inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

    const variants = {
        primary: "bg-[#FFD97D] text-[#3B2F2F] hover:bg-[#FFD061] active:bg-[#FFC94D] focus:ring-[#FFD97D] shadow-sm hover:shadow-md",
        secondary: "bg-[#4A3C3C] text-[#FDF6EC] hover:bg-[#5A4C4C] focus:ring-[#8B7355] border border-[#8B7355]",
        danger: "bg-[#8B4A4A] text-[#FDF6EC] hover:bg-[#9B5A5A] active:bg-[#7B3A3A] focus:ring-[#8B4A4A] shadow-sm hover:shadow-md",
        ghost: "text-[#C4A484] hover:text-[#FFD97D] hover:bg-[#3B2F2F] focus:ring-[#8B7355]"
    }

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
        xl: "px-8 py-4 text-lg"
    }

    return (
        <button 
            onClick={onClick} 
            type={type} 
            disabled={disabled}
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    )
}