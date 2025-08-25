import Modal from './Modal.jsx';
import Button from "./Button.jsx";
import TextField from "./TextField.jsx";
import Select from "./Select.jsx";
import DatePicker from "./DatePicker.jsx"
import ButtonTabs from "./ButtonTabs.jsx";
import RepeatForm from "./RepeatForm.jsx";
import Toggle from "./Toggle.jsx";
import { format } from 'date-fns'
import { useState } from "react";
import { useTasks } from "../context/TaskProvider";

const CreateTaskModal = ( {categories, isOpen, onClose } ) => {
  const { createTask } = useTasks();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null)
  const [dueDate, setDueDate] = useState(null);
  const [repeat, setRepeat] = useState({
    repeat_is_true: false,
    repeat_interval: 1,
    repeat_unit: "day",
    repeat_ends_on: null
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(null);
    setDueDate(null);
    setRepeat({
      repeat_is_true: false,
      repeat_interval: 1,
      repeat_unit: "day",
      repeat_ends_on: null
    })
  }
  
  const handleCreateTask = async (e) => {
    e.preventDefault();
    


    if (!title.trim() || !dueDate || !category) {
      console.log("Required fields are missing");
      return;
    }

    setLoading(true);
    
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        category_id: category, // Keep as string since it's a UUID
        due_date: format(dueDate, 'yyyy-MM-dd'),
        start_date: format(dueDate, 'yyyy-MM-dd'), // Add start_date if your API needs it
        repeat_is_true: repeat.repeat_is_true,
        repeat_interval: repeat.repeat_interval,
        repeat_unit: repeat.repeat_unit,
        repeat_ends_on: repeat.repeat_ends_on ? format(repeat.repeat_ends_on, 'yyyy-MM-dd') : null,
      };

      console.log("Creating task with data:", taskData);
      console.log("Category ID being sent:", taskData.category_id);
      console.log("Category ID type:", typeof taskData.category_id);
      
      const result = await createTask(taskData);
      
      if (result.success) {
        console.log("Created task:", result.task);
        onClose();
        resetForm();
      } else {
        console.error("Failed to create task:", result.error);
        alert(result.error || "Creating task failed.");
      }

    } catch (err) {
      console.error("Creating task error:", err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleCategoryChange = (e) => {
    console.log("Selected category value:", e.target.value);
    console.log("Selected category type:", typeof e.target.value);
    console.log("Available categories:", categories);
    setCategory(e.target.value);
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} >
        <form className="flex flex-col gap-y-4">
          { step === 0 ? (
            <>
              <div className="flex flex-col gap-x-4">
                <TextField value={title} onChange={(e) => setTitle(e.target.value)}>Task Title</TextField>
              </div>
              <div className="flex flex-row gap-x-4">
                <DatePicker date={dueDate} setDate={setDueDate}>
                  { dueDate === null ? (
                    <p>Pick Due Date for Task</p>
                  ) : ( 
                        <div>{format(dueDate, "MMM dd")}</div>
                    ) 
                  }
                </DatePicker>
                <RepeatForm repeat={repeat} setRepeat={setRepeat} />
              </div>

              <Select 
                value={category} 
                placeholder="Please select a category" 
                onChange={handleCategoryChange} 
                options={categories.map((category) => ({
                  label: category.name, 
                  value: category.id
                }))}
              />

            </>
          ) : (
            <div>THE SUCCESS SCENE OF FORM CREATION{title}</div>
          )}
          <div className="flex justify-center gap-2 my-4">
            <Button 
              variant="primary" 
              size="xl" 
              onClick={handleCreateTask}
              
            >
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </Modal>
  )
}

export default CreateTaskModal