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

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); //preventing form submit
    forms.classList.toggle("show-signup");
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
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    var email = document.getElementById("email1").value;
    var password = document.getElementById("password1").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // validating password to meet current date password meta
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return;
    }

    // Hash the password before storing it
    var hashedPassword = hashPassword(password);

    // Retrieve existing user data from local storage
    var existingUsersJson = localStorage.getItem("userData");
    var existingUsers = [];

    if (existingUsersJson !== null) {
      try {
        existingUsers = JSON.parse(existingUsersJson);
      } catch (error) {
        console.error("Error parsing existing user data:", error);
      }
    }

    // Check if existingUsers is an array
    if (!Array.isArray(existingUsers)) {
      existingUsers = []; // Initialize as empty array if not
    }

    // Check if email already exists in stored user data
    var emailExists = existingUsers.some(function (user) {
      return user.email === email;
    });

    if (emailExists) {
      alert(
        "This email address is already in use. Please use a different email or login."
      );
      return;
    }

    // Append the new user data to the existing array
    existingUsers.push({
      email: email,
      password: hashedPassword,
    });

    // Store updated user data back in local storage
    localStorage.setItem("userData", JSON.stringify(existingUsers));
    alert("Splendidly Signedup! :)");
    window.location.href = "login page.html";
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    let emailLogin = document.getElementById("email").value;
    let passwordLogin = document.getElementById("password").value;
    console.log("Password entered:", "*".repeat(passwordLogin.length));

    // Retrieve user data from local storage
    var existingUsersJson = localStorage.getItem("userData");
    var existingUsers = [];

    if (existingUsersJson !== null) {
      try {
        existingUsers = JSON.parse(existingUsersJson);
      } catch (error) {
        console.error("Error parsing existing user data:", error);
      }
    }

    // Check if existingUsers is an array
    if (!Array.isArray(existingUsers)) {
      alert("No existing user data found.");
      return;
    }

    // Find the user with matching email and password
    var loggedInUser = existingUsers.find(function (user) {
      return user.email === emailLogin && user.password === passwordLogin;
    });

    if (loggedInUser) {
      alert("Login successful!"); // Notify the user that login was successful
      // Optionally redirect the user to a dashboard or any other page
      window.location.href = "admindash.html";
    } else {
      alert(
        "Invalid email or password. Please recheck your credentials or Signup if your new here :("
      ); // Notify the user of invalid login credentials
    }
  });
