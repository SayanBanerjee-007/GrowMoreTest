// All Global Variables ----------------------------------------------------------------
const popUp = document.getElementById("pop-up");
const popUpButton = document.getElementById("pop-up-button");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordIcon = document.getElementById("password-icon");
const submitButton = document.getElementById("submit-button");

// All Global Functions ----------------------------------------------------------------
function isEmailValid() {
  const regx1 = /^\w[A-Za-z0-9_.]{2,}@[A-Za-z]{2,10}\.[a-z]{2,7}$/;
  const regx2 = /^\..*\.{2,}/;
  const regx3 = /^_.*_{2,}/;
  const regx4 = /(_@)/;
  const regx5 = /(\.@)/;
  if (
    regx1.test(email.value) &&
    !regx2.test(email.value) &&
    !regx3.test(email.value) &&
    !regx4.test(email.value) &&
    !regx5.test(email.value) &&
    email.value.length > 4 &&
    email.value.length < 31
  ) {
    return true;
  }
  return false;
}
function isPasswordValid() {
  const regx1 = /\s/;
  if (
    !regx1.test(password.value) &&
    password.value.length > 5 &&
    password.value.length < 21
  ) {
    return true;
  }
  return false;
}
function isValidForm() {
  if (isEmailValid() && isPasswordValid()) {
    return true;
  }
  return false;
}
function popupFunction(emoji, heading, description, buttonVisibility = true) {
  popUp.children[0].innerHTML = emoji;
  popUp.children[1].innerHTML = heading;
  popUp.children[2].innerHTML = description;
  if (!buttonVisibility) {
    popUpButton.classList.remove("visible");
  } else {
    popUpButton.classList.add("visible");
  }
  popUp.showModal();
}

// All Event Listeners ----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  email.focus();
});
popUp.addEventListener("click", (event) => {
  const popUpDimensions = popUp.getBoundingClientRect();
  if (
    event.clientX < popUpDimensions.left ||
    event.clientX > popUpDimensions.right ||
    event.clientY < popUpDimensions.top ||
    event.clientY > popUpDimensions.bottom
  ) {
    popUp.close();
  }
});
popUpButton.addEventListener("click", () => {
  popUp.close();
  popUpButton.classList.remove("visible");
});
passwordIcon.addEventListener("click", () => {
  passwordIcon.name =
    passwordIcon.name === "eye-off-outline" ? "eye-outline" : "eye-off-outline";
  password.type = password.type === "password" ? "text" : "password";
});
submitButton.addEventListener("click", async (event) => {
  event.preventDefault();
  if (isValidForm()) {
    const resJSON = await fetch('/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    const resValue = await resJSON.json();
    if (resJSON.status === 403) {
      location.href = `/home`;
    } else if (resJSON.status === 500) {
      popupFunction(
        "😢",
        "Server Error",
        "Please try again later or refresh the page."
      );
    } else if (resJSON.status === 400) {
      popupFunction(
        "🤨",
        "Invalid Details",
        "Please check your email & password and try again."
      );
    } else if (resJSON.status === 200) {
      popupFunction(
        "😊",
        "Login Successful",
        "Enjoy our services.",
        false
      );
      setTimeout(() => {
        location.href = `/home`;
      }, 500);
    }
  } else {
    popupFunction(
      "🤨",
      "Invalid Details",
      "Please check your email & password and try again."
    );
  }
});
