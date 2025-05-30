
const TextField = ( {children} ) => {
    return (
        <input type="text" placeholder={children} className="border border-gray-300 rounded-md px-2 py-2 focus:border-[#FFD97D] focus:border-2 focus:outline-none w-full" ></input>
    )
}

export default TextField;