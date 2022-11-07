const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  taskname: String,
  status: String,
  tag: String,
  userId: { type: String, required: true },
});

const TodoModel = mongoose.model("todo", todoSchema);

module.exports = TodoModel;
