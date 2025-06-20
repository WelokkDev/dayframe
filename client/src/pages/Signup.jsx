import TextField from "../components/TextField.jsx";
import Button from "../components/Button.jsx";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Signup() {
  
  const [input, setInput] = useState({
    display_name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (input.display_name != "" && input.email != "" && input.password != "") {
      try {
        const res = await fetch('http://localhost:3000/signup', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        const data = await res.json();
        if (res.ok) {
          console.log("Signed up:", data.user)
          navigate("/login");
        } 
        else {
          alert(data.error || "Signup failed.")
        }

      } catch (err) {
        console.error("Error signing up:", err);
        alert("Server error.")
      }
    } 
    else {
      alert("Please provide valid input");
    }
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev, 
      [name]: value,
    }))
  }
  
  return (
    <div className="w-full h-[100dvh] flex justify-center items-center">
      <div className=" w-1/4 p-12 bg-[var(--foreground)] rounded my-auto mx-auto align-middle text-[var(--text-dark)]">
        <h1 className="text-2xl font-bold ">Sign up</h1>
        <p className="mt-2 text-[var(--text-dark)] mb-2 ">Here’s what’s on your agenda today...</p>
        <form onSubmit={handleSignup}>
          <TextField name="display_name" onChange={handleInput} className="mt-4 w-full">Name</TextField>
          <TextField type="email" name="email" onChange={handleInput} className="mt-4 w-full">Email</TextField>
          <TextField type="password" name="password" onChange={handleInput} className="mt-4 w-full">Password</TextField>
          <Button variant="primary" size="md" type="submit" className="w-full py-3 mt-4 justify-center items-center text-center">Create account</Button>
        </form>
        <p className="flex justify-center mt-2">Already have an account? 
          <a 
            href="/login" 
            className="text-[#3F6C51] pl-1 hover:text-[#2F513D] cursor-pointer transition-colors duration-150"
          >
            Log in
          </a>
        </p>
      </div>

    </div>
  );
}
