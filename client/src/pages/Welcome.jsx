import Button from "../components/Button";
import { useNavigate } from "react-router";

export default function Welcome() {
    const navigate = useNavigate();

    return (
    <div className="w-full h-[100dvh] flex justify-center items-center">
      <div className=" w-1/4 p-12 bg-[var(--foreground)] rounded my-auto mx-auto align-middle text-[var(--text-dark)]">
        <h1 className="text-2xl font-bold ">Welcome back!</h1>
        <p className="mt-2 text-[var(--text-dark)]">You need to be logged in to use dayframe</p>
        <Button variant="primary" size="md" onClick={() => {navigate("/login")}} className="w-full py-3 mt-4 justify-center items-center text-center">Log in</Button>
        <div className="flex items-center gap-4 my-4">
            <div className="h-px flex-1 bg-gray-400"></div>
            <span className="text-sm text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-400"></div>
        </div>  
        <Button variant="primary" size="md" onClick={() => {navigate("/signup")}} className="w-full py-3 justify-center items-center text-center">Sign up</Button>
      </div>

    </div>
  );
}