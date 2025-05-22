import '../index.css'
import Navbar from "./Navbar.jsx"


export default function Layout({ children }) {
  return (
    <div className="flex h-[100dvh] w-[100dvw] p-8 pb-20 gap-16 sm:p-20 bg-background font-sans antialiased">
      <Navbar />
      <div className="bg-foreground h-[90dvh] w-full rounded-4xl p-4">
        {children}
      </div>
    </div>
  );
}