// All Required Modules & Packages ========================================
const router = require("express").Router();
const userAuthorization = require("../middleware/user-authorization");
const userTaskData = require("../middleware/user-task-data");
const UserTask = require("../database/user-task");

// All Routes =============================================================
// Root Routes --------------
router
  .route("/")
  .get(userAuthorization, userTaskData, (req, res) => {
    res.render("home", {
      isAuthorized: req.isAuthorized,
      userTaskArray: req.userTaskArray,
      extractStyles: true,
    });
  })
  .post(userAuthorization, async (req, res) => {
    const regex = /(\s+|^)[^\s]*(\s{2,})[^\s]*(?=\s|$)/;
    if (req.isAuthorized && !regex.test(req.body.taskValue)) {
      try {
        const existingUserTask = await UserTask.findOneAndUpdate(
          { Email: req.email },
          { $push: { Tasks: req.body.taskValue } },
          { new: true }
        );
        if (!existingUserTask) {
          const newUserTask = new UserTask({
            Email: req.email,
            Tasks: [req.body.taskValue],
          });
          await newUserTask.save();
        }
        return res.status(200).redirect("/home");
      } catch (error) {
        return res.status(500).redirect("/home");
      }
    }
    return res.status(401).redirect("/home");
  })
  .put(userAuthorization, async (req, res) => {
    if (req.isAuthorized) {
      try {
        const oldTaskValue = req.body.oldTaskValue;
        const newTaskValue = req.body.newTaskValue;

        const updatedUserTask = await UserTask.updateOne(
          { Email: req.email },
          { $set: { "Tasks.$[i]": newTaskValue } },
          {arrayFilters:[{"i": oldTaskValue}]}
        );

        if (updatedUserTask) {
          return res.status(200).json({});
        } else {
          return res.status(404).send({message:"User task not found."});
        }
      } catch (error) {
        return res.status(500).send({message:"Server error."});
      }
    } else {
      return res.status(401).send({message:"Unauthorized Access."});
    }
  })
  .delete(userAuthorization, async (req, res) => {
    if (req.isAuthorized) {
      try {
        const updatedUserTask = await UserTask.findOneAndUpdate(
          { Email: req.email },
          { $pull: { Tasks: req.body.taskValue } },
          { new: true }
        );
        if (updatedUserTask) {
          return res
            .status(200)
            .json({ message: "Task successfully deleted." });
        } else {
          return res.status(404).json({ message: "User task not found." });
        }
      } catch (error) {
        return res.status(500).json({ message: "Server error." });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized." });
    }
  });
module.exports = router;
