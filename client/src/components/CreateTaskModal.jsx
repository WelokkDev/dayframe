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
import { fetchWithAuth } from "../utils/fetchWithAuth";


const CreateTaskModal = ( {categories, isOpen, onClose } ) => {
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
    console.log(category)
    e.preventDefault();
    console.log("A")
    if (title !== "" && dueDate !== null && category !== null) {
      setLoading(true);
      try {
        const res = await fetchWithAuth("http://localhost:3000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            title: title,
            description: description,
            category_id: category,
            due_date: dueDate,
            repeat_is_true: repeat.repeat_is_true,
            repeat_interval: repeat.repeat_interval,
            repeat_unit: repeat.repeat_unit,
            repeat_ends_on: repeat.repeat_ends_on,
          })
        });
        const data = await res.json()
        
      console.log(data)
        if (res.ok) {
          console.log("Created task:", data);
          onClose();
          resetForm();

        } else {
          alert(data.error || "Creating task failed.")
        }

      } catch (err) {
        console.error("Creating task error:", err);
        alert("Server error. Try again later.");
      } finally {
        setLoading(false);
      }
    }
    else {
      flagImportant();
    }
  }

  const flagImportant = () => {
    console.log("THERE BE ERRRORS FIX THEM!")
  }



  const handleClose = () => {
    resetForm();
    onClose();
  }

  const test = (e) => {
    console.log(categories)
    setCategory(e.target.value)
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

              <Select value={category} placeholder="Please select a category" onChange={test} options={categories.map((category) => (
                {label: category.name, value: category.id}
              ))}/>

            </>
          ) : (
            
              <div>THE SUCCESS SCENE OF FORM CREATION{title}</div>
            
          )}
          <div className="flex justify-center gap-2 my-4">
            <Button variant="primary" size="xl" onClick={handleCreateTask}>Create Task</Button>
          </div>
        </form>
      </Modal>
  )

}
export default CreateTaskModal