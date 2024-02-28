let parentPIN;

function setParentPIN(message, oldPIN = null) {
  const newPIN = prompt(message);
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
  let isValid = !isNaN(pin) || pin.length < 4 || pin.length > 8;
  if (!oldPIN) return isValid;

  isValid = isValid && pin !== oldPIN;
  if (!isValid) alert("New PIN cannot be the same as the old PIN.");

  return isValid;
}

function changeParentPIN() {
  const oldPIN = prompt("Please enter the old parent PIN.");
  if (oldPIN !== parentPIN) {
    alert("Incorrect PIN. Access denied.");
    return;
  }
  setParentPIN("Please provide a new parent PIN. (4-8 digits)", oldPIN);
}

function inputParentPIN() {
  const pin = prompt("Please enter the parent PIN to view this program.");
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
