import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { format } from "date-fns";
import DeadlineModal from "../components/DeadlineModal";

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  // Deadline modal state
  const [deadlineModal, setDeadlineModal] = useState({
    isOpen: false,
    task: null
  });

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const res = await fetchWithAuth("http://localhost:3000/categories");
      const data = await res.json();
      if (res.ok) {
        const categoriesMap = {};
        data.forEach(category => {
          categoriesMap[category.id] = category;
        });
        setCategories(categoriesMap);
      } else {
        console.error("Categories fetch error:", data.error);
      }
    } catch (err) {
      console.error("Categories server error:", err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Fetch tasks with filters
  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      let url = "http://localhost:3000/tasks";
      
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.dueToday) params.append("dueToday", "true");
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.date) params.append("date", filters.date);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetchWithAuth(url);
      const data = await res.json();
      if (res.ok) {
        setTasks(data);
      } else {
        console.error("Tasks fetch error:", data.error);
      }
    } catch (err) {
      console.error("Tasks server error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tasks for a specific date
  const fetchTasksByDate = useCallback(async (date) => {
    try {
      setLoading(true);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const url = `http://localhost:3000/tasks?date=${formattedDate}`;

      const res = await fetchWithAuth(url);
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        console.error("Tasks fetch error:", data.error);
        return [];
      }
    } catch (err) {
      console.error("Tasks server error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Complete a task
  const completeTask = useCallback(async (taskId) => {
    try {
      const now = new Date();
      const formattedDate = format(now, 'yyyy-MM-dd HH:mm:ss');
      
      const res = await fetchWithAuth(`http://localhost:3000/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          completed_at: formattedDate, 
          cancelled: false, 
          failure_reason: "" 
        })
      });

      if (res.ok) {
        // Update local state immediately for better UX
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, completed_at: formattedDate, cancelled: false, failure_reason: "" }
              : task
          )
        );
        return true;
      } else {
        const error = await res.json();
        console.error("Task completion failed:", error);
        return false;
      }
    } catch (err) {
      console.error("Task completion server error:", err);
      return false;
    }
  }, []);

  // Fail a task
  const failTask = useCallback(async (taskId, reason) => {
    try {
      const res = await fetchWithAuth(`http://localhost:3000/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          completed_at: null, 
          cancelled: true, 
          failure_reason: reason 
        })
      });

      if (res.ok) {
        // Update local state immediately for better UX
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, completed_at: null, cancelled: true, failure_reason: reason }
              : task
          )
        );
        return true;
      } else {
        const error = await res.json();
        console.error("Task failure failed:", error);
        return false;
      }
    } catch (err) {
      console.error("Task failure server error:", err);
      return false;
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData) => {
    try {
      const res = await fetchWithAuth("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
      });

      const data = await res.json();
      if (res.ok) {
        // Add new task to local state
        setTasks(prevTasks => [...prevTasks, data]);
        return { success: true, task: data };
      } else {
        console.error("Task creation failed:", data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("Task creation server error:", err);
      return { success: false, error: err.message };
    }
  }, []);

  // Update a task
  const updateTask = useCallback(async (taskId, updates) => {
    try {
      const res = await fetchWithAuth(`http://localhost:3000/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
      });

      const data = await res.json();
      if (res.ok) {
        // Update local state immediately for better UX
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, ...updates }
              : task
          )
        );
        return { success: true, task: data };
      } else {
        console.error("Task update failed:", data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("Task update server error:", err);
      return { success: false, error: err.message };
    }
  }, []);

  // Memoized filtered tasks
  const incompleteTasks = useMemo(() => 
    tasks.filter(task => !task.completed_at && !task.cancelled), 
    [tasks]
  );

  const completedTasks = useMemo(() => 
    tasks.filter(task => task.completed_at && !task.cancelled), 
    [tasks]
  );

  const failedTasks = useMemo(() => 
    tasks.filter(task => task.cancelled), 
    [tasks]
  );

  const todaysTasks = useMemo(() => 
    incompleteTasks.filter(task => {
      if (!task.scheduled_at) return false;
      const today = new Date();
      const taskDate = new Date(task.scheduled_at);
      return taskDate.toDateString() === today.toDateString();
    }), 
    [incompleteTasks]
  );

  // Get category name by ID
  const getCategoryName = useCallback((categoryId) => {
    return categories[categoryId]?.name || "Unknown Category";
  }, [categories]);

  // Initialize data
  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, [fetchCategories, fetchTasks]);

  // Function to refresh tasks after AI generation
  const refreshTasksAfterAI = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  // Check for missed deadlines and show modal if needed
  const checkMissedDeadlines = useCallback(() => {
    const now = new Date();
    const missedTasks = incompleteTasks.filter(task => {
      if (!task.scheduled_at) return false;
      const deadline = new Date(task.scheduled_at);
      return deadline < now && !task.completed_at && !task.cancelled;
    });

    if (missedTasks.length > 0) {
      // Find the most recently missed task
      const mostRecentMissed = missedTasks.sort((a, b) => 
        new Date(b.scheduled_at) - new Date(a.scheduled_at)
      )[0];

      // Only show modal for important tasks or if no modal is currently open
      if (mostRecentMissed.importance && !deadlineModal.isOpen) {
        setDeadlineModal({
          isOpen: true,
          task: mostRecentMissed
        });
      }
    }
  }, [incompleteTasks, deadlineModal.isOpen]);

  // Handle deadline modal actions
  const handleDeadlineComplete = useCallback(async () => {
    if (!deadlineModal.task) return;
    
    const success = await completeTask(deadlineModal.task.id);
    if (success) {
      // Check for more missed deadlines
      setTimeout(checkMissedDeadlines, 1000);
    }
  }, [deadlineModal.task, completeTask, checkMissedDeadlines]);

  const handleDeadlineFail = useCallback(async (reason) => {
    if (!deadlineModal.task) return;
    
    const success = await failTask(deadlineModal.task.id, reason);
    if (success) {
      // Check for more missed deadlines
      setTimeout(checkMissedDeadlines, 1000);
    }
  }, [deadlineModal.task, failTask, checkMissedDeadlines]);

  const closeDeadlineModal = useCallback(() => {
    setDeadlineModal({ isOpen: false, task: null });
  }, []);

  // Check for missed deadlines periodically
  useEffect(() => {
    const interval = setInterval(checkMissedDeadlines, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [checkMissedDeadlines]);

  // Check for missed deadlines when tasks change
  useEffect(() => {
    checkMissedDeadlines();
  }, [tasks, checkMissedDeadlines]);

  const value = {
    // State
    tasks,
    categories,
    loading,
    categoriesLoading,
    
    // Filtered tasks
    incompleteTasks,
    completedTasks,
    failedTasks,
    todaysTasks,
    
    // Actions
    fetchTasks,
    fetchTasksByDate,
    fetchCategories,
    completeTask,
    failTask,
    createTask,
    updateTask,
    getCategoryName,
    refreshTasksAfterAI
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
      
      {/* Deadline Modal */}
      <DeadlineModal
        isOpen={deadlineModal.isOpen}
        onClose={closeDeadlineModal}
        task={deadlineModal.task}
        onComplete={handleDeadlineComplete}
        onFail={handleDeadlineFail}
      />
    </TaskContext.Provider>
  );
};

export default TaskProvider;