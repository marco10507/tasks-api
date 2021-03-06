const express = require("express");
const Task = require("./models/Task");
const route = express.Router();
const { checkJwt } = require("./auth0/check-jwt");

route.get("/tasks", checkJwt, async (req, res) => {
  const query = { ownerId: req.user.sub };
  const tasks = await Task.find(query);
  res.send(tasks);
});

route.post("/tasks", checkJwt, async (req, res) => {
  let task;
  try {
    task = new Task({
      subject: req.body.subject,
      completed: req.body.completed,
      dueDate: req.body.dueDate,
      ownerId: req.user.sub
    });

    await task.save();
  } catch (error) {
    return res.status(400).json({ error: error.toString() });
  }
  return res.send(task);
});

route.delete("/tasks/:id", checkJwt, async (req, res) => {
  try {
    const query = { ownerId: req.user.sub, _id: req.params.id };
    await Task.findOneAndDelete(query);
  } catch (error) {
    return res.status(400).json({ error: error.toString() });
  }

  return res.status(200).json();
});

route.put("/tasks/:id", checkJwt, async (req, res) => {
  let updatedTask;
  try {
    const filter = { ownerId: req.user.sub, _id: req.params.id };
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
