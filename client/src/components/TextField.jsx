
const TextField = ({ onChange, children, className = 'w-full', name="", type = "text"}) => {
    const base = "border border-gray-300 rounded-md px-2 py-2 focus:border-[#FFD97D] focus:border-2 focus:outline-none"

    return (
        <input name={name} type={type} onChange={onChange} placeholder={children} className={`${base} ${className}`} ></input>
    )
}

export default TextField;