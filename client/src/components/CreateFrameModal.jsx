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
 
  return (
    <Modal isOpen={isOpen} onClose={onClose} >
        <form className="flex flex-col gap-y-4">
            <TextField>Frame Title</TextField>
            <Button variant="primary" size="xl">Create Frame</Button>
        </form>
      </Modal>
  )

}
export default CreateTaskModal