var field = document.querySelector("textarea");
var backUp = field.getAttribute("placeholder");
var btn = document.querySelector(".btn");
var clear = document.getElementById("clear");

// Check if there's already data in the local storage
var storedData = localStorage.getItem("textareaContent");

// If there's data in the local storage, set the textarea value to that data
if (storedData) {
  field.value = storedData;
}

field.oninput = function () {
  // Save the current value of the textarea to the local storage
  localStorage.setItem("textareaContent", this.value);
};

field.onfocus = function () {
  this.setAttribute("placeholder", "");
  this.style.borderColor = "#333";
  btn.style.display = "block";
};

field.onblur = function () {
  this.setAttribute("placeholder", backUp);
  this.style.borderColor = "#aaa";
};

clear.onclick = function () {
  btn.style.display = "none";
  field.value = "";
  // Clear the data from the local storage when the user clears the textarea
  localStorage.removeItem("textareaContent");
};
