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
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOhMH5BVYH_LFG9qsnZ6Zv147-oOs21X8",
  authDomain: "brians-web-portfolio.firebaseapp.com",
  projectId: "brians-web-portfolio",
  storageBucket: "brians-web-portfolio.appspot.com",
  messagingSenderId: "206537371859",
  appId: "1:206537371859:web:cb1379e306bfc6f3a82426",
  measurementId: "G-HN2BD43WYH",
};
//initialize
firebaseConfig.initializeApp(firebaseConfig);
//Initialize variables
const auth = firebase.auth();
const database = firebase.auth();
// imma setup a function to handle the register
function register() {
  // get all register input fields
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;
}
function