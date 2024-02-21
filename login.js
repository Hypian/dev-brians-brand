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

document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    var email = document.getElementById("email1").value; // Change this line
    var password = document.getElementById("password1").value; // Change this line
    var confirmPassword = document.getElementById("confirmPassword").value;

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Store the data in local storage
    var userData = {
      email: email,
      password: password,
    };

    localStorage.setItem("userData", JSON.stringify(userData));
    window.location.href = "login page.html";
  });
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // this prevents form submmission

    let emailLogin = document.getElementById("email").value;
    let passwordLogin = document.getElementById("password").value;
    //  data storage
    var userStuff = {
      emailLogin: emailLogin,
      passwordLogin: passwordLogin,
    };
    localStorage.setItem("userStuff", JSON.stringify(userStuff));
    window.location.href = "admindash.html";
  });
