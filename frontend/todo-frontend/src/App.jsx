import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const res = await axios.get('http://localhost:5000/api/todos');
    setTodos(res.data);
  };

  useEffect(() => { fetchTodos(); }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    const res = await axios.post('http://localhost:5000/api/todos', { task });
    setTodos([...todos, res.data]);
    setTask('');
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h2>Todo App</h2>
      <form onSubmit={addTodo}>
        <input value={task} onChange={e => setTask(e.target.value)} placeholder="Enter task" />
        <button type="submit">Add</button>
      </form>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: '8px' }}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{
                cursor: 'pointer',
                textDecoration: todo.deleted === 1 ? 'line-through' : 'none'
              }}
            >
              {todo.task}
            </span>
            <div style={{ fontSize: '12px', color: 'gray' }}>
              Created: {new Date(todo.created_at).toLocaleString()}
            </div>
            <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: '10px' }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
