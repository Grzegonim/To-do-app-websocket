import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import shortid from 'shortid';


function App() {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('')
  
  useEffect(() => {
    const socket = io("localhost:8000");
    setSocket(socket);

    socket.on('updateData', tasks => setTasks(tasks))
    socket.on('addTask', task => addTask(task));
    socket.on('removeTask', id => removeTask(id));
  }, []);

  function removeTask(id) {
    setTasks(tasks => tasks.filter(task => task.id !== id));
  };
  
  function addTask(task) {
    setTasks(tasks => [...tasks, task]);
  };

  function submitRemove(id) {
    removeTask(id);
    socket.emit('removeTask', id);
  }

  function submitForm(e) {
    e.preventDefault()
    const task = {name: taskName, id: shortid()};
    addTask(task);
    socket.emit('addTask', task);
    setTaskName('')
  };
  
return (
  <div className="App">

    <header>
      <h1>ToDoList.app</h1>
    </header>
    <section className="tasks-section" id="tasks-section">
      <h2>Tasks</h2>

      <ul className="tasks-section__list" id="tasks-list">
        {tasks.map(task => <li key={task.id} className="task">{task.name} <button className="btn btn--red" onClick={() => submitRemove(task.id)}>Remove</button></li>)}
      </ul>

      <form id="add-task-form" onSubmit={submitForm}>
        <input className="text-input" autocomplete="off" type="text" value={taskName} placeholder="Type your description" id="task-name" onChange={e => setTaskName(e.target.value)}/>
        <button className="btn" type="submit">Add</button>
      </form>

    </section>
  </div>
);
}

export default App;
