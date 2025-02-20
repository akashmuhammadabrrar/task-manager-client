// import React, { useState, useEffect } from "react";
// import useAxios from "../hooks/useAxios";
// import { format } from "date-fns";

// const Tasks = () => {
//   const axios = useAxios();
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     axios
//       .get("/tasks")
//       .then((res) => setTasks(res.data))
//       .catch((err) => console.error("Error fetching tasks:", err));
//   }, [axios]);

//   return (
//     <div className="container mx-auto mt-10">
//       <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center font-semibold">
//         All Tasks I Added
//       </h2>
//       <div className="mt-4">
//         {/* Render task list */}
//         {tasks.length > 0 ? (
//           tasks.map((task) => (
//             <div
//               key={task._id}
//               className="border w-[40%] mx-auto p-4 my-2 bg-gray-100 rounded-lg shadow-md">
//               <h3 className="font-bold text-lg">{task.title}</h3>
//               <p className="text-gray-700">{task.description}</p>

//               {/* Display formatted due date */}
//               <p className="text-sm text-gray-500 mt-2">
//                 <strong>Due Date:</strong>{" "}
//                 {task.dueDate
//                   ? format(new Date(task.dueDate), "EEEE, MMMM d, yyyy hh:mm a")
//                   : "No Due Date"}
//               </p>

//               <p className="text-sm text-gray-900 font-bold bg-blue-100 inline-block px-2 py-1 mt-2 rounded">
//                 {task.category}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No tasks found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Tasks;

import React, { useState, useEffect } from "react";
import useAxios from "../hooks/useAxios";
import { format } from "date-fns";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import Swal from "sweetalert2";

const Tasks = () => {
  const axios = useAxios();
  const [tasks, setTasks] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = tasks.findIndex((task) => task._id === active.id);
    const newIndex = tasks.findIndex((task) => task._id === over.id);

    if (oldIndex !== newIndex) {
      const reorderedTasks = [...tasks];
      const [movedTask] = reorderedTasks.splice(oldIndex, 1);
      reorderedTasks.splice(newIndex, 0, movedTask);
      setTasks(reorderedTasks);
    }

    setActiveId(null);
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await axios.delete(`/tasks/${taskId}`);
      if (response.data.deletedCount === 1) {
        // Remove the deleted task from the state
        setTasks(tasks.filter((task) => task._id !== taskId));
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Task Deleted Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.error("Task not found or already deleted");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleEdit = (taskId) => {
    // Add your edit logic here
    console.log("Edit task with ID:", taskId);
    // Example: Open a modal or navigate to an edit page
  };

  const DraggableTask = ({ task }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: task._id,
    });

    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="border w-full mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="font-bold text-lg">{task.title}</h3>
        <p className="text-gray-700">{task.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          <strong>Due Date:</strong>{" "}
          {task.dueDate
            ? format(new Date(task.dueDate), "EEEE, MMMM d, yyyy hh:mm a")
            : "No Due Date"}
        </p>
        <p className="text-sm text-gray-900 font-bold bg-blue-100 inline-block px-2 py-1 mt-2 rounded">
          {task.category}
        </p>
        {/* Buttons for Delete and Edit */}
        <div className="flex justify-start space-x-2 mt-4">
          <button
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag on button click
            onClick={() => handleEdit(task._id)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 cursor-pointer">
            Edit
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag on button click
            onClick={() => handleDelete(task._id)}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    );
  };

  const DroppableArea = ({ id, children }) => {
    const { setNodeRef } = useDroppable({
      id,
    });

    return (
      <div
        ref={setNodeRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {children}
      </div>
    );
  };

  const activeTask = tasks.find((task) => task._id === activeId);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="container mx-auto mt-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center font-semibold">
          All Tasks I Added
        </h2>
        <div className="mt-4">
          <DroppableArea id="droppable">
            {tasks.length > 0 ? (
              tasks.map((task) => <DraggableTask key={task._id} task={task} />)
            ) : (
              <p className="text-center text-gray-500">No tasks found</p>
            )}
          </DroppableArea>
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="border p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">{activeTask.title}</h3>
            <p className="text-gray-700">{activeTask.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              <strong>Due Date:</strong>{" "}
              {activeTask.dueDate
                ? format(
                    new Date(activeTask.dueDate),
                    "EEEE, MMMM d, yyyy hh:mm a"
                  )
                : "No Due Date"}
            </p>
            <p className="text-sm text-gray-900 font-bold bg-blue-100 inline-block px-2 py-1 mt-2 rounded">
              {activeTask.category}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Tasks;
