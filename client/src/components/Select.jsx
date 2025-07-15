import { useState, useRef, useEffect } from 'react';

const Select = ( { options, value, onChange, placeholder="" }) => {
    const base = "border border-gray-300 p-2 rounded-md focus:border-[#FFD97D] focus:border-2 focus:outline-none"
    
    return (
        <select className={`${base}`} onChange={onChange} value={value}>
            { placeholder !== "" && (
                <option value="" disabled hidden>{placeholder}</option>
            )}
            {options.map(option => (
                <option value={option.value}>{option.label}</option>
            ))}
        </select>
    )
}

export default Select