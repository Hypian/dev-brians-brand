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
