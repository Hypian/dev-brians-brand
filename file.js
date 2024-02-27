document.getElementById("contact").addEventListener("submit", function (event) {
  event.preventDefault(); // prevents form submission
  // variable declaration and calling html id
  let fullname = document.getElementById("fullname").value;
  let email = document.getElementById("email").value;
  let message = document.getElementById("message").value;
  // data storage
  var userThings = {
    fullname: fullname,
    email: email,
    message: message,
  };
  localStorage.setItem("userThings", JSON.stringify(userThings));
  window.location.href = "index.html";
  alert("Message Successfully Sent");
});

// Check if there is a logged-in user on page load
document.addEventListener("DOMContentLoaded", function () {
  var loggedInUser = JSON.parse(localStorage.getItem("userDataTwo"));

  var loginBtn = document.getElementById("loginBtn");
  if (loginBtn && loggedInUser) {
    // If there is a logged-in user, change the button to act as a logout button
    loginBtn.textContent = "Logout";
    loginBtn.classList.add("logged-in");
    loginBtn.setAttribute("href", "#");
    loginBtn.addEventListener("click", function () {
      // Logout functionality
      localStorage.removeItem("userDataTwo");
      alert("Logged out successfully!");
      window.location.reload(); // Reload the page after logout
    });
  }
});
