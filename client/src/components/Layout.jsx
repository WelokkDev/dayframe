import '../index.css'
import Navbar from "./Navbar.jsx"


export default function Layout({ children }) {
  return (
    <div className="flex h-[100dvh] w-[100dvw]  gap-16 sm:py-12 sm:px-8 bg-background font-sans antialiased">
      <Navbar />
      <div className="bg-foreground h-[100%] w-full rounded-4xl p-4">
        {children}
      </div>
    </div>
  );
}