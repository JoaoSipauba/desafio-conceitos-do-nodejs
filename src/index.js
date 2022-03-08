const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const userAccountAlreadyExists = users.some((user) => username == user.username);

  if (!userAccountAlreadyExists) {
    return response.status(400).json({error: "Account doesnt exists"});
  }

  return next();
}

function getUserIndex(username) {
  return users.findIndex((user) => user.username == username);
}

function getTodoIndex(userIndex, todoId) {
  const todoIndex = users[userIndex].todos.findIndex((todo) => todo.id == todoId);

  return todoIndex;
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAccountAlreadyExists = users.some((user) => username == user.username);

  if (userAccountAlreadyExists) {
    return response.status(400).json({error: "Account already exists"});
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;

  const userIndex = getUserIndex(username);
  const userTodoList = users[userIndex].todos;

  return response.status(200).json(userTodoList);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { username } = request.headers;

  const todo = { 
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  const userIndex = getUserIndex(username);
  users[userIndex].todos.push(todo);

  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { username } = request.headers;

  const userIndex = getUserIndex(username);
  const todoIndex = getTodoIndex(userIndex, id);

  users[userIndex].todos[todoIndex].title = title;
  users[userIndex].todos[todoIndex].deadline = deadline;

  return response.status(200).json(users[userIndex].todos[todoIndex])
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;