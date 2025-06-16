import { useState } from 'react';


const Toggle = ({ children, className="", value, onChange,
    activeClass="bg-[#FFD97D] text-[#664700] hover:bg-[#FFD061]", 
    inactiveClass="bg-[#FDF6EC] text-[#3B2F2F] border border-gray-300 "},) => {
    //const [toggled, setToggled] = useState(value);


    const base = "px-4 py-2 w-full flex justify-center rounded-lg inline-flex self-start  "

    const handleClick = (e) => {
        const newValue = !value;
        onChange(newValue);

    }

    return (
        <button onClick={handleClick} type="button" className={`${base} ${className}
        ${value ? activeClass : inactiveClass}`}>
            {children}
        </button>
    )
}

export default Toggle;