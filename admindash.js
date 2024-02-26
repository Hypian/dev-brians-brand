var selectedRow = null;

function onFormSubmit(e) {
  event.preventDefault();
  var formData = readFormData();
  if (selectedRow == null) {
    insertNewRecord(formData);
  } else {
    updateRecord(formData);
  }
  resetForm();
}

//Retrieve the data
function readFormData() {
  var formData = {};
  formData["productCode"] = document.getElementById("productCode").value;
  formData["product"] = document.getElementById("product").value;
  formData["qty"] = document.getElementById("qty").value;
  formData["perPrice"] = document.getElementById("perPrice").value;
  return formData;
}

//Insert the data
function insertNewRecord(data) {
  var table = document
    .getElementById("storeList")
    .getElementsByTagName("tbody")[0];
  var newRow = table.insertRow(table.length);
  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.productCode;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = data.product;
  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.qty;
  cell4 = newRow.insertCell(3);
  cell4.innerHTML = data.perPrice;
  cell4 = newRow.insertCell(4);
  cell4.innerHTML = `<button onClick="onEdit(this)">Edit</button> <button onClick="onDelete(this)">Delete</button>`;
}

//Edit the data
function onEdit(td) {
  selectedRow = td.parentElement.parentElement;
  document.getElementById("productCode").value = selectedRow.cells[0].innerHTML;
  document.getElementById("product").value = selectedRow.cells[1].innerHTML;
  document.getElementById("qty").value = selectedRow.cells[2].innerHTML;
  document.getElementById("perPrice").value = selectedRow.cells[3].innerHTML;
}
function updateRecord(formData) {
  selectedRow.cells[0].innerHTML = formData.productCode;
  selectedRow.cells[1].innerHTML = formData.product;
  selectedRow.cells[2].innerHTML = formData.qty;
  selectedRow.cells[3].innerHTML = formData.perPrice;
}

//Delete the data
function onDelete(td) {
  if (confirm("Do you want to delete this record?")) {
    row = td.parentElement.parentElement;
    document.getElementById("storeList").deleteRow(row.rowIndex);
    resetForm();
  }
}

//Reset the data
function resetForm() {
  document.getElementById("productCode").value = "";
  document.getElementById("product").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("perPrice").value = "";
  selectedRow = null;
}
// Retrieve the logged-in user's information from local storage
function getLoggedInUser() {
  var loggedInUserJson = localStorage.getItem("loggedInUser");
  if (loggedInUserJson) {
    return JSON.parse(loggedInUserJson);
  }
  return null; // No logged-in user
}

// Store the data associated with the logged-in user
function storeDataForUser(data) {
  var loggedInUser = getLoggedInUser();
  if (loggedInUser) {
    var userKey = "user_" + loggedInUser.id; // Assuming user has an ID
    var userData = JSON.parse(localStorage.getItem(userKey)) || [];
    userData.push(data);
    localStorage.setItem(userKey, JSON.stringify(userData));
  } else {
    console.error("No logged-in user found.");
  }
}

// Function to handle form submission
function onFormSubmit(e) {
  e.preventDefault();
  var formData = readFormData();
  if (selectedRow == null) {
    insertNewRecord(formData);
  } else {
    updateRecord(formData);
  }
  storeDataForUser(formData); // Store the data associated with the user
  resetForm();
}
