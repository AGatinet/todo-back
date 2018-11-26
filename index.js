var express = require("express");
var app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
var mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/todo-list",
  { useNewUrlParser: true, useCreateIndex: true }
);

const Task = mongoose.model("Task", {
  name: {
    type: String,
    unique: true,
    required: true
  },
  status: String,
  createdAt: { type: Date, default: Date.now }
});

// / => hi{}
app.get("/", function(req, res) {
  res.send("hi");
});

app.post("/create", function(req, res) {
  const newTask = new Task({
    name: req.body.name,
    status: "to-do"
  });

  newTask.save(function(err, taskSaved) {
    if (err) {
      res.json({ error: err.message });
    } else {
      res.json(taskSaved);
    }
  });
});

app.post("/update", function(req, res) {
  Task.findOne({ name: req.body.name }).exec(function(err, task) {
    if (err) return err;

    if (task.status === "to-do") {
      task.status = "done";
      task.save(function(err, updatedTask) {
        res.send(updatedTask);
      });
    } else if (task.status === "done") {
      task.status = "to-do";
      task.save(function(err, updatedTask) {
        res.send(updatedTask);
      });
    }
  });
});

app.post("/delete", function(req, res) {
  Task.deleteOne({ name: req.body.name }).exec(function(err, task) {
    if (err) return err;
    res.send("Tâche supprimée");
  });
});

app.listen(3000, function() {
  console.log("Server has started");
});
