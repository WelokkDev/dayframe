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
import { useAuth } from "../context/AuthProvider.jsx";


const CreateTaskModal = ( {isOpen, onClose } ) => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [repeat, setRepeat] = useState({
    repeat_is_true: false,
    repeat_interval: null,
    repeat_unit: "",
    repeat_ends_on: null
  });

  const handleSubmit = () => {
    console.log("ALRIGHTY")
    console.log(startDate);
    console.log(endDate);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} >
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
                <RepeatForm />
              </div>
              <Select placeholder="test" options={[
                {label: "Dayframe", value: "dayframe"},
                {label: "Journal Frame", value: "journal"}
              ]}/>
              
              

            </>
          ) : (
            
              <div>THE SUCCESS SCENE OF FORM CREATION{title}</div>
            
          )}
          <div className="flex justify-center gap-2 my-4">
            <Button variant="primary" size="xl" onClick={handleSubmit}>Create Task</Button>
          </div>
        </form>
      </Modal>
  )

}
export default CreateTaskModal