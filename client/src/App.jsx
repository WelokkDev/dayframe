
import './App.css'
import AuthProvider from "./context/AuthProvider.jsx";
import TaskProvider from "./context/TaskProvider.jsx";
import AppRoutes from "./AppRoutes.jsx";

function App() {
  
  return (
    <AuthProvider>
      <TaskProvider>
        <AppRoutes />
      </TaskProvider>
    </AuthProvider>
  )
}

export default App
