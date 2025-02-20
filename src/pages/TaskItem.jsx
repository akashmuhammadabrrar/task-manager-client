import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskItem = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="border p-2 my-2 bg-gray-100 cursor-grab">
      <h3 className="font-bold">{task.title}</h3>
      <p>{task.description}</p>
      <p className="text-sm text-gray-500">{task.category}</p>
    </div>
  );
};

export default TaskItem;
