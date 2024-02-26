const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");

pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    let pwFields =
      eyeIcon.parentElement.parentElement.querySelectorAll(".password");

    pwFields.forEach((password) => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bx-hide", "bx-show");
        return;
      }
      password.type = "password";
      eyeIcon.classList.replace("bx-show", "bx-hide");
    });
  });
});

// hashed password
function hashPassword(password) {
  // Use a cryptographic hashing algorithm such as SHA-256
  // For simplicity, this example uses a basic hashing method
  var hash = 0;
  if (password.length == 0) {
    return hash;
  }
  for (var i = 0; i < password.length; i++) {
    var char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const emailLogin = document.getElementById("email").value;
    const passwordLogin = document.getElementById("password").value;

    // Check if the provided email and password match the secret credentials
    if (
      emailLogin === "kagingobrian2002@gmail.com" &&
      passwordLogin === "Asad@123"
    ) {
      alert("Login successful!"); // Notify the user that login was successful
      window.location.href = "admindash.html"; // Redirect to the admin dashboard
    } else {
      alert("Your Not The Admin :("); // Notify the user of invalid login credentials
      window.location.href = "index.html";
    }
  });
