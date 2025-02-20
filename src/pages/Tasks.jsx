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

const Tasks = () => {
  const axios = useAxios();
  const [tasks, setTasks] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    axios
      .get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [axios]);

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
        className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
