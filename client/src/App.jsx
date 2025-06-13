
import './App.css'
import AuthProvider from "./context/AuthProvider.jsx";
import AppRoutes from "./AppRoutes.jsx";

function App() {
  
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
