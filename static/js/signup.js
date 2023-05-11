// All Global Variables ----------------------------------------------------------------
const popUp = document.getElementById("pop-up");
const popUpButton = document.getElementById("pop-up-button");
const name = document.getElementById("name");
const phoneNumber = document.getElementById("phone-number");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const passwordIcon = document.getElementById("password-icon");
const submitButton = document.getElementById("submit-button");

// All Global Functions ----------------------------------------------------------------
function isNameValid() {
  const regx1 = /([A-Za-z])/;
  const regx2 = /^\s/;
  const regx3 = /\s$/;
  const regx4 = /\s{2,}/;
  if (
    regx1.test(name.value) &&
    !regx2.test(name.value) &&
    !regx3.test(name.value) &&
    !regx4.test(name.value) &&
    name.value.length > 4 &&
    name.value.length < 31
  ) {
    return true;
  }
  return false;
}
function isPhoneNumberValid() {
  const regx1 = /^[0-9][0-9]{8}[0-9]$/;
  if (
    regx1.test(Number(phoneNumber.value)) &&
    phoneNumber.value.length === 10
  ) {
    return true;
  }
  return false;
}
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
    email.value.length > 6 &&
    email.value.length < 51
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
  if (
    isNameValid() &&
    isPhoneNumberValid() &&
    isEmailValid() &&
    isPasswordValid() &&
    password.value === confirmPassword.value
  ) {
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
  name.focus();
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
confirmPassword.addEventListener("input", () => {
  if (
    confirmPassword.value !==
    password.value.slice(0, confirmPassword.value.length)
  ) {
    confirmPassword.style.color = "red";
  } else {
    confirmPassword.style.color = "black";
  }
});
submitButton.addEventListener("click", async (event) => {
  event.preventDefault();
  if (isValidForm()) {
    const resJSON = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        phoneNumber: phoneNumber.value,
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
        "😢",
        "Email Reserved",
        "Please try again with a different email address."
      );
    } else if (resJSON.status === 200) {
      popupFunction("😊", "Signup Successful", "Enjoy our services.", false);
      setTimeout(() => {
        location.href = `/login`;
      }, 500);
    }
  } else {
    popupFunction(
      "🤨",
      "Invalid Details",
      "Please check your details carefully and signup."
    );
  }
});
