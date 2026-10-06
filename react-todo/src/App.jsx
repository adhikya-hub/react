import { useState } from "react";

const App = () => {
  const [tasks, setTasks] = useState([
    { id: "01", name: "t1", completed: true },
  ]);
  const [newTask, setNewTask] = useState("");

  const [editInfo, setEditInfo] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    if (editInfo) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editInfo.id ? { ...task, name: newTask } : task,
        ),
      );
      setEditInfo(null);
    } else {
      setTasks((prevTasks) => [
        { id: new Date().getTime(), name: newTask, completed: false },
        ...prevTasks,
      ]);
    }

    setNewTask("");
  }

  function handleCancel() {
    setNewTask("");
    setEditInfo(null);
  }

  function handleEdit(id, name) {
    setEditInfo({ id, name });
    setNewTask(name);
  }

  function handleDelete(id) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit">Submit </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </div>
      <div>
        {tasks.map((task) => {
          return (
            <div key={task.id} id={task.id}>
              <p>{task.name}</p>
              <button onClick={() => handleEdit(task.id, task.name)}>
                Edit
              </button>
              <button onClick={() => handleDelete(task.id)}> Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
