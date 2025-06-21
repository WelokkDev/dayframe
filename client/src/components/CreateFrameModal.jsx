import Modal from './Modal.jsx';
import Button from "./Button.jsx";
import TextField from "./TextField.jsx";
import Select from "./Select.jsx";
import DatePicker from "./DatePicker.jsx"
import ButtonTabs from "./ButtonTabs.jsx";
import RepeatForm from "./RepeatForm.jsx";
import Toggle from "./Toggle.jsx";
import { useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const CreateCategoryModal = ( {isOpen, onClose } ) => {
 
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false);

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    
    if (title !== "") {
      setLoading(true);
      try {
        const res = await fetchWithAuth("http://localhost:3000/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: title })
        })

        const data = await res.json();
        if (res.ok) {
          console.log("Created category:", data);
          setTitle("")
          onClose();
        }
        else {
          alert(data.error || "Login failed.")
        }

      } catch (err) {
        console.error("Login error:", err);
        alert("Server error. Try again later.");

      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <form className="flex flex-col gap-y-4" onSubmit={handleCreateCategory} >
          <TextField value={title} onChange={(e) => setTitle(e.target.value)}>Frame Title</TextField>
          <Button variant="primary" size="xl" type="submit">
            {loading ? "Creating..." : "Create Frame"}
          </Button>
      </form>
    </Modal>
  )

}
export default CreateCategoryModal