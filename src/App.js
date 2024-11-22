// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [search, setSearch] = useState('');
  const [filteredTodos, setFilteredTodos] = useState([]);

  // Fetch todos from the server
  useEffect(() => {
    axios.get('http://localhost:5000/todos')
      .then((response) => setTodos(response.data))
      .catch((error) => console.error('Error fetching todos:', error));
  }, []);

  // Handle adding new todo
  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    axios.post('http://localhost:5000/todos', { text: newTodo })
      .then((response) => {
        console.log('Added todo:', response.data); // Log the response to check if the data is correct
        setTodos([...todos, response.data]); // Add the new todo to the state
        setNewTodo('');
      })
      .catch((error) => {
        console.error('Error adding todo:', error);
      });
  };
  
  // Handle deleting a todo
  const handleDeleteTodo = (id) => {
    axios.delete(`http://localhost:5000/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch((error) => console.error('Error deleting todo:', error));
  };

  // Search functionality
  useEffect(() => {
    if (search.trim()) {
      axios.get(`http://localhost:5000/search?query=${search}`)
        .then((response) => setFilteredTodos(response.data))
        .catch((error) => console.error('Error searching todos:', error));
    } else {
      setFilteredTodos(todos);
    }
  }, [search, todos]);

  return (
    <div className="App">
      <h1>To-Do Application</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search todos"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* New To-Do Input */}
      <input
        type="text"
        placeholder="Enter new to-do"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add To-Do</button>

      {/* Display To-Dos */}
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            {todo.text} 
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
