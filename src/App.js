import React, { useState, useEffect } from 'react';

function TodoList() {
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('todos')) || []);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setTodos([...todos, { text: newTodo, date: new Date(), dueDate: dueDate }]);
    setNewTodo('');
    setDueDate('');
  }

  function handleDelete(index) {
    const updatedTodos = todos.filter((todo, i) => i !== index);
    setTodos(updatedTodos);
  }

  function compareTodos(a, b) {
    return new Date(a.date) - new Date(b.date);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} />
        <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <div>Current time: {currentTime.toLocaleString()}</div>
      <ul>
        {todos.sort(compareTodos).map((todo, index) => (
          <li key={index}>
            {todo.text} - Due: {new Date(todo.dueDate).toLocaleString()}{' '}
            {todo.date < currentTime && <span style={{ color: 'red' }}>Erledigen!</span>}
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
