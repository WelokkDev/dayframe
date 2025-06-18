import { useState } from "react";

export default function Button ({ children, onClick, type="button", variant, size, className=''}) {

    
    const base = "rounded-lg inline-flex self-start"

    const variants = {
        primary: "bg-[#FFD97D] font-semibold text-[#664700] hover:bg-[#FFD061] active:bg-[#FFC94D]",
        form: "bg-[#FFD97D] text-[#664700] hover:bg-[#FFD061] active:bg-[#FFC94D]",
        cancel_red: "bg-red-200  hover:bg-[#FFC2C2] active:bg-[#FFADAD]",
        secondary: "text-[var(--accent)] font-semibold hover:underline hover:decoration-[var(--accent)] transition-all duration-150"
    }

    const sizes = {
        md: "px-4 ",
        xl: "px-4 py-2 text-xl"
    }


    return (
        <button onClick={onClick} type={type} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </button>
    )
}