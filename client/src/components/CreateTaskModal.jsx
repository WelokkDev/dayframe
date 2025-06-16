import Modal from './Modal.jsx';
import Button from "./Button.jsx";
import TextField from "./TextField.jsx";
import Select from "./Select.jsx";
import DatePicker from "./DatePicker.jsx"
import ButtonTabs from "./ButtonTabs.jsx";
import RepeatForm from "./RepeatForm.jsx";
import Toggle from "./Toggle.jsx";
import { useState } from "react";


const CreateTaskModal = ( {isOpen, onClose } ) => {
  const [step, setStep] = useState(0)
  const [automate, setAutomate] = useState(false)
  const [quota, setQuota] = useState(false)

  return (
    <Modal isOpen={isOpen} onClose={onClose} >
        <form className="flex flex-col gap-y-4">
          { step === 0 ? (
            <>
              <div className="flex flex-row gap-x-4">
                <TextField>Task Title</TextField>
              </div>
              <TextField>Optional Description</TextField>
              <div className="flex flex-row gap-x-4">
                <DatePicker>Pick Date(s) for Task</DatePicker>
                <RepeatForm />
              </div>
              <Select placeholder="test" options={[
                {label: "Dayframe", value: "dayframe"},
                {label: "Journal Frame", value: "journal"}
              ]}/>
              
              

            </>
          ) : (
            
              <div>THE SUCCESS SCENE OF FORM CREATION</div>
            
          )}
          <div className="flex justify-center gap-2 my-4">
            <Button variant="primary" size="xl" onClick={() => setStep(1)}>Create Task</Button>
          </div>
        </form>
      </Modal>
  )

}
export default CreateTaskModal