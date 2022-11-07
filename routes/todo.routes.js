const express = require("express");
const TodoModel = require("../models/todo.models");
const todoRouter = express.Router();

//GET all todos
todoRouter.get("/", async (req, res) => {
  const todos = await TodoModel.find();
  res.send(todos);
});

// CREATE - ADD/POST
todoRouter.post("/:userId/add", async (req, res) => {
  const userId = req.params.userId;
  const { taskname, status, tag } = req.body;
  const newTask = new TodoModel({
    taskname,
    status,
    tag,
    userId,
  });
  await newTask.save();
  res.send("Todo added");
});

// READ - GET
todoRouter.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const todos = await TodoModel.find({ userId });
  res.send(todos);
});

// UPDATE
todoRouter.patch("/:userId/update/:todoId", async (req, res) => {
  const userId = req.params.userId;
  const todoId = req.params.todoId;
  const todo = await TodoModel.findOne({ _id: todoId });

  if (todo.userId !== userId) {
    return res.send("Incorrect");
  } else {
    const newTodo = await TodoModel.findByIdAndUpdate(todoId, req.body);
    req.send("Updated");
  }
});

// DELETE
todoRouter.delete("/:userId/delete/:todoId", async (req, res) => {
  const userId = req.params.userId;
  const todoId = req.params.todoId;
  const todo = await TodoModel.findOne({ _id: todoId });

  if (todo.userId !== userId) {
    return res.send("Incorrect");
  } else {
    const newTodo = await TodoModel.findByIdAndDelete(todoId);
    console.log(newTodo);
    req.send("Deleted");
  }
});

module.exports = todoRouter;
