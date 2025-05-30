import { useState, useRef, useEffect } from 'react';

const Select = ( { options }) => {
    const base = "mt-8 border border-gray-300 p-2 rounded-md focus:border-[#FFD97D] focus:border-2 focus:outline-none"

    return (
        <select className={`${base}`}>
            {options.map(option => (
                <option value={option.value}>{option.label}</option>
            ))}
        </select>
    )
}

export default Select