import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const Todo = ({ todos, setTodos }) => {
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      if (pb.authStore.isValid) {
        const records = await pb.collection('todos').getFullList({
          filter: `user = "${pb.authStore.model.id}"`
        });
        setTodos(records);
      }
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title: newTodo.title,
        description: newTodo.description,
        completed: false,
        user: pb.authStore.model.id
      };

      const record = await pb.collection('todos').create(data);
      setTodos(prev => [...prev, record]);
      setNewTodo({ title: '', description: '' });
    } catch (err) {
      console.error('Failed to create todo:', err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await pb.collection('todos').delete(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      const record = await pb.collection('todos').update(todo.id, updatedTodo);
      setTodos(prev => prev.map(t => t.id === todo.id ? record : t));
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  return (
    <div className="todo-container">
      <h2>To-Do List</h2>
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          placeholder="Task title"
          value={newTodo.title}
          onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Task description"
          value={newTodo.description}
          onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="todo-list">
        {todos.map(todo => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-content">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo)}
              />
              <div className="todo-text">
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;