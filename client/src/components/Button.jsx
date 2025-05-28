export default function Button ({ children, onClick, variant, size, className = ''}) {

    const base = "rounded-lg inline-flex self-start"

    const variants = {
        primary: "bg-[#5C4A25] text-[var(--accent)] hover:bg-[#52401F] ",
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