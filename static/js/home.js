// All Global Variables ----------------------------------------------------------------
const createNewTaskButton = document.getElementById("create-new-task-button");
const taskValuePopup = document.getElementById("task-value-popup");
const taskValue = document.getElementById("task-value");
const cancelTask = document.getElementById("cancel-task");
const submitTask = document.getElementById("submit-task");
const updateButton = document.querySelectorAll(".update-button");
const deleteButton = document.querySelectorAll(".delete-button");
let oldTaskValue;

// All Global Functions ----------------------------------------------------------------

// All Event Listeners ----------------------------------------------------------------
cancelTask.addEventListener("click", (event) => {
  event.preventDefault();
  taskValuePopup.close();
});
createNewTaskButton.addEventListener("click", () => {
  submitTask.type = "submit";
  taskValuePopup.showModal();
});
taskValuePopup.addEventListener("click", (event) => {
  const popUpDimensions = taskValuePopup.getBoundingClientRect();
  if (
    event.clientX < popUpDimensions.left ||
    event.clientX > popUpDimensions.right ||
    event.clientY < popUpDimensions.top ||
    event.clientY > popUpDimensions.bottom
  ) {
    taskValuePopup.close();
  }
});
submitTask.addEventListener("click", async () => {
  const resJSON = await fetch("/home", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oldTaskValue,
      newTaskValue: taskValue.value,
    }),
  });
  const resValue = await resJSON.json();
  if (resJSON.status === 200) {
    location.href = `/home`;
  } else {
    alert(resValue.message);
  }
});
Array.from(updateButton).forEach((element) => {
  element.addEventListener("click", async () => {
    submitTask.type = "button";
    taskValuePopup.showModal();
    oldTaskValue = element.previousElementSibling.innerText;
  });
});

Array.from(deleteButton).forEach((element) => {
  element.addEventListener("click", async () => {
    const resJSON = await fetch("/home", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskValue: element.parentElement.firstElementChild.innerText,
      }),
    });
    const resValue = await resJSON.json();
    if (resJSON.status === 200) {
      location.href = `/home`;
    } else {
      alert(resValue.message);
    }
  });
});
