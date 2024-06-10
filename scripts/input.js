let parentPIN;
let promptMessage = "Please provide a parent PIN. (4-8 digits)";

function setParentPIN(message, oldPIN = null) {
  const newPIN = prompt(message);
  if (!newPIN) return;

  if (isValidPIN(oldPIN, newPIN)) {
    alert("Parent PIN set successfully.");
    parentPIN = newPIN;
    localStorage.setItem("parentPIN", parentPIN);
  } else {
    alert("Invalid PIN format, please try again.");
    setParentPIN(message, oldPIN);
  }
}

function isValidPIN(oldPIN, pin) {
  const isValid =
    !isNaN(pin) || pin.length < 4 || pin.length > 8 || Number(pin) < 0;

  if (!isValid) return false;

  if (oldPIN && pin !== oldPIN) {
    alert("New PIN cannot be the same as the old PIN.");
    return false;
  }
  return isValid;
}

function changeParentPIN() {
  if (!getParentPIN()) {
    setParentPIN(promptMessage);
    return;
  }

  const oldPIN = prompt("Please enter the old parent PIN.");
  if (!oldPIN) return;

  if (oldPIN !== parentPIN) {
    alert("Incorrect PIN. Access denied.");
    return;
  }
  setParentPIN(promptMessage, oldPIN);
}

function inputParentPIN() {
  const pin = prompt("Please enter the parent PIN to view this program.");
  if (!pin) return false;

  if (pin !== parentPIN) {
    alert("Incorrect PIN. Access denied.");
    return false;
  }
  return true;
}

function getParentPIN() {
  return localStorage.getItem("parentPIN");
}

window.addEventListener("DOMContentLoaded", () => {
  parentPIN = getParentPIN();
});

export {
  setParentPIN,
  changeParentPIN,
  inputParentPIN,
  getParentPIN,
  parentPIN,
};
