import Modal from './Modal.jsx';
import Button from "./Button.jsx";
import TextField from "./TextField.jsx";
import Select from "./Select.jsx";
import DatePicker from "./RangeDatePicker.jsx"
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
  const [category, setCategory] = useState("")
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [repeat, setRepeat] = useState({
    repeat_is_true: false,
    repeat_interval: 1,
    repeat_unit: "day",
    repeat_ends_on: null
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setStartDate(null);
    setEndDate(null);
    setRepeat({
      repeat_is_true: false,
      repeat_interval: 1,
      repeat_unit: "day",
      repeat_ends_on: null
    })
  }
  
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (title !== "" && startDate !== null && category !== "") {
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
            start_date: startDate,
            end_date: startDate,
            repeat_is_true: repeat.repeat_is_true,
            repeat_interval: repeat.repeat_interval,
            repeat_unit: repeat.repeat_unit,
            repeat_ends_on: repeat.repeat_ends_on,
          })
        });
        const data = await res.json()

        if (res.ok) {
          console.log("Created category:", data);
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

  const handleSubmit = () => {
    console.log(title)
    console.log(description)
    console.log("ALRIGHTY")
    console.log(startDate);
    console.log(endDate);
    console.log(category)
    console.log(repeat)
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }
  return (
    <Modal isOpen={isOpen} onClose={handleClose} >
        <form className="flex flex-col gap-y-4">
          { step === 0 ? (
            <>
              <div className="flex flex-col gap-x-4">
                <TextField value={title} onChange={(e) => setTitle(e.target.value)}>Task Title</TextField>
              </div>
              <TextField value={description} onChange={(e) => setDescription(e.target.value)}>Optional Description</TextField>
              <div className="flex flex-row gap-x-4">
                <DatePicker onDatesChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}>
                  { startDate === null ? (
                    <p>Pick Date(s) for Task</p>
                  ) : ( format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd") ? (
                        <div>{format(startDate, "MMM dd")}</div>
                    ) : (
                      <div> {format(startDate, "MMM dd")} - {format(endDate, "MMM dd")}</div>
                    )
                  )

                  }
                </DatePicker>
                <RepeatForm repeat={repeat} setRepeat={setRepeat} />
              </div>

              <Select value={category} placeholder="Please select a category" onChange={(e) => setCategory(e.target.value)} options={categories.map((category) => (
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