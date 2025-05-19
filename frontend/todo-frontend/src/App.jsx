import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [task, setTask] = useState('');
  const [reminder, setReminder] = useState('');
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const res = await axios.get('http://localhost:5000/api/todos');
    setTodos(res.data);
  };

  useEffect(() => { fetchTodos(); }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    const now = new Date();
    const reminderDate = new Date(reminder);

    if (reminder && reminderDate < now) {
      alert("Reminder can't be set in the past!");
      return;
    }

    const res = await axios.post('http://localhost:5000/api/todos', { task, reminder_time: reminder });
    setTodos([...todos, res.data]);
    setTask('');
    setReminder('');
  };

  const updateReminder = async (id) => {
    const newReminder = prompt("Enter new reminder time (YYYY-MM-DD HH:MM:SS):");
    if (!newReminder) return;

    const reminderDate = new Date(newReminder);
    const now = new Date();

    if (reminderDate < now) {
      alert("Reminder can't be set in the past!");
      return;
    }

    await axios.put(`http://localhost:5000/api/todos/${id}/reminder`, { reminder_time: newReminder });
    fetchTodos();
  };

  const toggleTodo = async (id) => {
    await axios.put(`http://localhost:5000/api/todos/${id}/toggle`);
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    setTodos(todos.map(todo => todo.id === id ? { ...todo, deleted: 1 } : todo));
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', border: '1px solid black', borderRadius: '10px', alignItems: 'center', justifyContent: 'center', backgroundColor: 'gray', padding: '20px'}}>
      <h2>Todo App</h2>
      <form onSubmit={addTodo}>
        <input style={{ marginRight: '10px' }} value={task} onChange={e => setTask(e.target.value)} placeholder="Enter task" />
        <input type="datetime-local" value={reminder} onChange={e => setReminder(e.target.value)} style={{ marginRight: '10px' }} />
        <button type="submit">Add</button>
      </form>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', backgroundColor: '#444', padding: '10px', borderRadius: '6px', width: '300px' }}>
            <div onClick={() => toggleTodo(todo.id)} style={{ cursor: 'pointer', textDecoration: todo.deleted === 1 ? 'line-through' : 'none', color: 'white' }}>
              {todo.task}
            </div>
            <div style={{ fontSize: '12px', color: 'white' }}>
              Created: {new Date(todo.created_at).toLocaleString()}
              {todo.reminder_time && <><br />Reminder: {new Date(todo.reminder_time).toLocaleString()}</>}
            </div>
            <div style={{ marginTop: '6px' }}>
              <button onClick={() => deleteTodo(todo.id)} style={{ marginRight: '10px' }}>Remove</button>
              <button onClick={() => updateReminder(todo.id)}>Edit Reminder</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
