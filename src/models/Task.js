const mongoose = require("mongoose");

const schema = mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Task", schema);
