import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'

function TodoList() {
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('todos')) || []);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState('Normal');
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
    setTodos([
      ...todos,
      {
        text: newTodo,
        date: new Date(),
        dueDate: dueDate,
        priority: priority,
        status: 'ToDo',
      },
    ]);
    setNewTodo('');
    setDueDate(null);
    setPriority('Normal');
  }

  function handleDelete(index) {
    const updatedTodos = todos.filter((todo, i) => i !== index);
    setTodos(updatedTodos);
  }

  function compareTodos(a, b) {
    const aDueDate = new Date(a.dueDate);
    const bDueDate = new Date(b.dueDate);
    const currentTime = new Date();

    // Compare due dates
    if (aDueDate < currentTime) {
      a.status = 'Overdue';
    } else if (a.status === 'Done') {
      // Do nothing
    } else if (aDueDate - currentTime <= 24 * 60 * 60 * 1000) {
      a.status = 'Urgent';
    } else {
      a.status = 'ToDo';
    }

    if (bDueDate < currentTime) {
      b.status = 'Overdue';
    } else if (b.status === 'Done') {
      // Do nothing
    } else if (bDueDate - currentTime <= 24 * 60 * 60 * 1000) {
      b.status = 'Urgent';
    } else {
      b.status = 'ToDo';
    }

    // Sort by priority
    const priorityOrder = ['Low', 'Normal', 'High'];
    const aPriorityIndex = priorityOrder.indexOf(a.priority);
    const bPriorityIndex = priorityOrder.indexOf(b.priority);
    if (aPriorityIndex < bPriorityIndex) {
      return -1;
    } else if (aPriorityIndex > bPriorityIndex) {
      return 1;
    } else {
      // If priorities are equal, sort by due date
      return aDueDate - bDueDate;
    }
  }

  function groupTodosByDay(todos) {
    const groups = {};
    todos.forEach((todo) => {
      const dueDate = new Date(todo.dueDate).toLocaleDateString();
      if (!groups[dueDate]) {
        groups[dueDate] = [];
      }
      groups[dueDate].push(todo);
    });
    return groups;
  }

  const groups = groupTodosByDay(todos);

  return (    <LocalizationProvider dateAdapter={AdapterLuxon}>
  <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Todo List
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">New Todo</FormLabel>
            <Input
              id="new-todo"
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
              fullWidth
            />
          </FormControl>
          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Due Date</FormLabel>
             <DateTimePicker
              value={dueDate}
              onChange={setDueDate}
              disablePast
              fullWidth
  ></DateTimePicker>

          </FormControl>
          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Priority</FormLabel>
            <RadioGroup
              aria-label="priority"
              name="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <FormControlLabel
                value="Low"
                control={<Radio />}
                label="Low"
              />
              <FormControlLabel
                value="Normal"
                control={<Radio />}
                label="Normal"
              />
              <FormControlLabel
                value="High"
                control={<Radio />}
                label="High"
              />
            </RadioGroup>
          </FormControl>
          <Button variant="contained" color="primary" type="submit">
            Add Todo
          </Button>
        </form>
        {Object.keys(groups).map((group) => (
          <Box key={group} my={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              {group}
            </Typography>
            {groups[group].map((todo, index) => (
              <Box key={index} my={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    style={{
                      textDecoration:
                        todo.status === 'Done' ? 'line-through' : 'none',
                    }}
                  >
                    {todo.text}
                  </Typography>
                  <Box>
                    {todo.status !== 'Done' && (
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          const updatedTodos = [...todos];
                          updatedTodos[index].status = 'Done';
                          setTodos(updatedTodos);
                        }}
                      >
                        Done
                      </Button>
                    )}
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={() => handleDelete(index)}
                      style={{ marginLeft: 8 }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mt={1}>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(todo.date).toLocaleString()}
                  </Typography>
                  {todo.dueDate && (
                    <Typography
                      variant="body2"
                      color={todo.status === 'Overdue' ? 'error' : 'textSecondary'}
                      style={{ marginLeft: 16 }}
                    >
                      {todo.status === 'Overdue' ? 'Overdue' : `Due ${new Date(todo.dueDate).toLocaleString()}`}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Container>
  </LocalizationProvider>
  );
}
export default TodoList