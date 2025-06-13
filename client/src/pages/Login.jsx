import TextField from "../components/TextField.jsx";
import Button from "../components/Button.jsx";
import { useState } from 'react'
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider.jsx";

export default function Login() {

  const [input, setInput] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const  { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (input.email !== "" && input.password !== "") {
      console.log(input.email);
      console.log(input.password);
      console.log("nice!!");
      try {
        const res = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await res.json();

        if (res.ok) {
          login(data);
          navigate("/")
        }
        else {
          alert(data.error || "Login failed.")
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Server error. Try again later.");
      }
    }
    else {
      alert("Please provide a valid input")
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full h-[100dvh] flex justify-center items-center">
      <div className=" w-1/4 p-12 bg-[var(--foreground)] rounded my-auto mx-auto align-middle text-[var(--text-dark)]">
        <h1 className="text-2xl font-bold ">Log in</h1>
        <p className="mt-2 text-[var(--text-dark)]">Here’s what’s on your agenda today...</p>
        <form onSubmit={handleLogin}>
          <TextField name="email" onChange={handleInput} className="mt-4">Email</TextField>
          <TextField name="password" onChange={handleInput} className="mt-4">Password</TextField>
          <Button variant="primary" size="md" type="submit" className="w-full py-3 mt-4 justify-center items-center text-center">Log in</Button>
        </form>
        <p className="flex justify-center mt-2">Don't have an account? 
          <a 
            href="/signup" 
            className="text-[#3F6C51] pl-1 hover:text-[#2F513D] cursor-pointer transition-colors duration-150"
          >
            Sign Up
          </a>
        </p>
      </div>

    </div>
  );
}
