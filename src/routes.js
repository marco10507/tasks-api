const express = require("express");
const Task = require("./models/Task");
const route = express.Router();
const { checkJwt } = require("./auth0/check-jwt");

route.get("/tasks", checkJwt, async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

route.post("/tasks", async (req, res) => {
  let task;
  try {
    task = new Task({
      subject: req.body.subject,
      completed: req.body.completed,
      dueDate: req.body.dueDate,
      ownerId: req.body.ownerId
    });

    await task.save();
  } catch (error) {
    return res.status(400).json({ error: error.toString() });
  }
  return res.send(task);
});

route.delete("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Task.findByIdAndDelete(id);
  } catch (error) {
    return res.status(400).json({ error: error.toString() });
  }

  return res.status(200).json();
});

route.put("/tasks/:id", async (req, res) => {
  let updatedTask;
  try {
    const filter = { _id: req.params.id };
    const update = {
      ...(req.body.subject && { subject: req.body.subject }),
      ...(req.body.completed != null && { completed: req.body.completed }),
      ...(req.body.dueDate && { dueDate: req.body.dueDate })
    };

    updatedTask = await Task.findOneAndUpdate(filter, update, {
      new: true
    });
  } catch (error) {
    return res.status(400).json({ error: error.toString() });
  }

  return res.send(updatedTask);
});

module.exports = route;
