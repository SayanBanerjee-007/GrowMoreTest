// All Required Modules & Packages =========================================
const UserTask = require("../database/user-task.js");

// Exporting Functions =====================================================
async function userTaskData(req, res, next) {
  if (!req.isAuthorized) {
    req.userTaskArray = [];
    return next();
  }
  try {
    const userTaskData = await UserTask.findOne({ Email: req.email });
    req.userTaskArray = userTaskData.Tasks;
    return next();
  } catch (error) {
    req.userTaskArray = [];
    return next();
  }
}

module.exports = userTaskData;
