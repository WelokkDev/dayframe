
const TextField = ({ onChange, children, className = 'w-full', name="", type = "text", value}) => {
    const base = "border border-[#8B7355] bg-[#3B2F2F] text-[#FDF6EC] rounded-md px-3 py-2 focus:border-[#FFD97D] focus:border-2 focus:outline-none placeholder-[#C4A484]"

    return (
        <input value={value} name={name} type={type} onChange={onChange} placeholder={children} className={`${base} ${className}`} ></input>
    )
}

export default TextField;