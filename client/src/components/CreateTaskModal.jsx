import Modal from './Modal.jsx';
import Button from "./Button.jsx";
import TextField from "./TextField.jsx";
import Select from "./Select.jsx";
import DatePicker from "./DatePicker.jsx"

const CreateTaskModal = ( {isOpen, onClose } ) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} height="h-[50%]" width="w-[50%]">
        <form className="flex flex-col gap-y-4">
          <div className="flex flex-row gap-x-4">
            <TextField>Task Title</TextField>
            <Select
              options={[ 
                { label: 'Task', value: "task" },
                { label: 'Quota', value: "quota"}
              ]}
            />
          </div>
          <TextField>Optional Description</TextField>
          <DatePicker />
        </form>
      </Modal>
  )

}
export default CreateTaskModal