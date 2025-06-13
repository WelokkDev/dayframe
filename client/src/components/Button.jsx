export default function Button ({ children, onClick, type = "button", variant, size, className = ''}) {

    const base = "rounded-lg inline-flex self-start"

    const variants = {
        primary: "bg-[#FFD97D] font-semibold text-[#664700] hover:bg-[#FFD061] active:bg-[#FFC94D]",
        secondary: "text-[var(--accent)] font-semibold hover:underline hover:decoration-[var(--accent)] transition-all duration-150"
    }

    const sizes = {
        md: "px-4 "
    }

    return (
        <button onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </button>
    )
}