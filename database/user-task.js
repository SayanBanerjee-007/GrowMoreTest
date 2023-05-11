const mongoose = require("mongoose");

const userTaskSchema = mongoose.Schema({
  Email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    minLength: 7,
    maxLength: 50,
    immutable: true,
  },
  Tasks: [{
    type: String,
    required: true,
  }],
  CreatedAt: {
    type: Date,
    immutable: true,
    default: () => new Date(),
  },
  UpdatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = new mongoose.model("UserTask", userTaskSchema);
