let parentPIN;

function setParentPIN(message) {
  const newParentPIN = Number(prompt(message));
  if (
    isNaN(newParentPIN) ||
    newParentPIN.length < 4 ||
    newParentPIN.length > 8
  ) {
    alert("Invalid PIN format, please try again.");
    setParentPIN();
  } else {
    alert("Parent PIN set successfully.");
    parentPIN = newParentPIN;
  }
}

function changeParentPIN() {
  const oldPIN = prompt("Please enter the old parent PIN.");
  if (Number(oldPIN) !== parentPIN) {
    alert("Incorrect PIN. Access denied.");
    return;
  }
  setParentPIN("Please provide a new parent PIN. (4-8 digits)");
}

export { setParentPIN, changeParentPIN, parentPIN };
