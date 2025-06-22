import { useParams } from "react-router";

const TasksByCategory = () => {
    const { categoryId } = useParams();

    return (
        <div>
            <p className="text-[var(--background)]">Tasks for: {categoryId} </p>
        </div>
    )
}

export default TasksByCategory