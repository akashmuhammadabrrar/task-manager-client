// import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { format } from "date-fns";
// import useAxios from "../hooks/useAxios";

// const TaskBoard = () => {
//   const axios = useAxios();

//   const [task, setTask] = useState({
//     title: "",
//     description: "",
//     category: "To-Do",
//     dueDate: new Date(), // Default to current date
//   });

//   const handleChange = (e) => {
//     setTask({ ...task, [e.target.name]: e.target.value });
//   };

//   const handleDateChange = (date) => {
//     setTask({ ...task, dueDate: date });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Task Data:", {
//       ...task,
//       dueDate: format(task.dueDate, "yyyy-MM-dd HH:mm"), // Format timestamp
//     });
//   };

//   return (
//     <div>
//       <div className="p-4 w-[75%] mx-auto">
//         <h2 className="text-xl font-bold mb-4 text-center">Add Task</h2>
//         <form onSubmit={handleSubmit} className="space-y-2">
//           <input
//             type="text"
//             name="title"
//             placeholder="Task Title"
//             value={task.title}
//             onChange={handleChange}
//             required
//             className="border p-2 w-full"
//           />
//           <textarea
//             name="description"
//             placeholder="Task Description"
//             value={task.description}
//             onChange={handleChange}
//             className="border p-2 w-full"
//           />
//           <select
//             name="category"
//             value={task.category}
//             onChange={handleChange}
//             className="border p-2 w-full">
//             <option value="To-Do">To-Do</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Done">Done</option>
//           </select>

//           {/* React DatePicker for Due Date */}
//           <DatePicker
//             selected={task.dueDate}
//             onChange={handleDateChange}
//             showTimeSelect
//             dateFormat="Pp"
//             className="border p-2 w-full"
//           />

//           <button
//             type="submit"
//             className="cursor-pointer bg-neutral text-white p-2 w-full">
//             Add Task
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TaskBoard;

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import useAxios from "../hooks/useAxios";

const TaskBoard = () => {
  const axios = useAxios();

  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "To-Do",
    dueDate: new Date(), // Default to current date
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setTask({ ...task, dueDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formattedTask = {
        ...task,
        dueDate: format(task.dueDate, "yyyy-MM-dd HH:mm"), // Format timestamp
      };

      const response = await axios.post("/tasks", formattedTask);
      console.log("Task added successfully:", response.data);
      alert("Task added successfully!");

      // Clear form after submission
      setTask({
        title: "",
        description: "",
        category: "To-Do",
        dueDate: new Date(),
      });
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-4 w-[75%] mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Add Task</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={task.title}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
          <textarea
            name="description"
            placeholder="Task Description"
            value={task.description}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <select
            name="category"
            value={task.category}
            onChange={handleChange}
            className="border p-2 w-full">
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          {/* React DatePicker for Due Date */}
          <DatePicker
            selected={task.dueDate}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="Pp"
            className="border p-2 w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-neutral text-white p-2 w-full">
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskBoard;
