var field = document.querySelector("textarea");
var backUp = field.getAttribute("placeholder");
var btn = document.querySelector(".btn");
var clear = document.getElementById("clear");

// Function to get the logged-in user's email
function getLoggedInUser() {
  var loggedInUserJson = localStorage.getItem("loggedInUser");
  if (loggedInUserJson) {
    var loggedInUser = JSON.parse(loggedInUserJson);
    return loggedInUser.email;
  }
  return null; // No logged-in user
}

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

btn.onclick = function () {
  // Get the logged-in user's email
  var loggedInUserEmail = getLoggedInUser();
  if (loggedInUserEmail) {
    // Save the comment along with the user's email to the local storage
    var comment = field.value;
    var comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push({ email: loggedInUserEmail, comment: comment });
    localStorage.setItem("comments", JSON.stringify(comments));
    alert("Comment saved successfully!");
  } else {
    alert("Please login to leave a comment.");
  }
};
// Get the icons
var mumIcon = document.getElementById('mum');
var dadIcon = document.getElementById('dad');

// Add click event listeners to each icon
mumIcon.addEventListener('click', function() {
    // Toggle the "liked" class to change the color
    this.classList.toggle('liked');
});

dadIcon.addEventListener('click', function() {
    // Toggle the "disliked" class to change the color
    this.classList.toggle('disliked');
});

