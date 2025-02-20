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
  const [editingTask, setEditingTask] = useState(null); // Track the task being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Control modal visibility

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
    // Find the task to edit
    const taskToEdit = tasks.find((task) => task._id === taskId);
    if (taskToEdit) {
      setEditingTask(taskToEdit); // Set the task to edit
      setIsEditModalOpen(true); // Open the edit modal
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of the editingTask object and remove the _id field
      const { _id, ...updatedTask } = editingTask;

      const response = await axios.put(`/tasks/${_id}`, updatedTask);
      if (response.data.modifiedCount === 1) {
        // Update the task in the state
        setTasks(
          tasks.map((task) =>
            task._id === _id ? { ...task, ...updatedTask } : task
          )
        );
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Task Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setIsEditModalOpen(false); // Close the modal
      } else {
        console.error("Task not found or update failed");
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
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

      {/* Edit Modal */}
      {isEditModalOpen && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={editingTask?.title || ""}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editingTask?.description || ""}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={
                    editingTask?.dueDate
                      ? new Date(editingTask.dueDate).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      dueDate: new Date(e.target.value),
                    })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={editingTask?.category || ""}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, category: e.target.value })
                  }
                  className="border p-2 w-full rounded-md">
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
