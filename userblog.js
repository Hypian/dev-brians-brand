document.addEventListener("DOMContentLoaded", function () {
  const blogContainer = document.getElementById("blogContainer");

  // Fetch blog data from local storage
  const userBlogData = JSON.parse(localStorage.getItem("userBlog"));

  if (userBlogData) {
    // Create blog post element
    const blogPost = document.createElement("div");
    blogPost.classList.add("blog-post");

    // Set title
    const title = document.createElement("h2");
    title.textContent = userBlogData.title;
    blogPost.appendChild(title);

    // Set text
    const text = document.createElement("p");
    text.textContent = userBlogData.text;
    blogPost.appendChild(text);

    // Set image if available
    if (userBlogData.pictureSelected) {
      const image = document.createElement("img");
      image.src = "path/to/your/image"; // Replace with actual image path
      image.alt = "Blog Image";
      blogPost.appendChild(image);
    }

    // Append blog post to container
    blogContainer.appendChild(blogPost);
  } else {
    // Display message if no blog data found
    blogContainer.innerHTML = "<p>No blog data available</p>";
  }
});

var field = document.querySelector("textarea");
var backUp = field.getAttribute("placeholder");
var btn = document.querySelector(".btn");
var clear = document.getElementById("clear");

// Function to get the logged-in user's email
// Function to get the logged-in user's email from userDataTwo
function getLoggedInUser() {
  var userDataTwoJson = localStorage.getItem("userDataTwo");
  if (userDataTwoJson) {
    var userDataTwo = JSON.parse(userDataTwoJson);
    return userDataTwo.email; // Assuming the email is directly stored in userDataTwo
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
    // Save the comment along with the user's email and like/dislike status to the local storage
    var comment = field.value;
    var comments = JSON.parse(localStorage.getItem("comments")) || [];
    var likes = JSON.parse(localStorage.getItem("likes")) || {};

    // Add the like/dislike status to the comment object
    var commentObject = {
      email: loggedInUserEmail,
      comment: comment,
      like: likes.like || false, // Default to false if the like status is not found
      dislike: likes.dislike || false, // Default to false if the dislike status is not found
    };

    comments.push(commentObject);
    localStorage.setItem("comments", JSON.stringify(comments));
    alert("Comment saved successfully!");
  } else {
    alert("Please login to leave a comment.");
  }
};

// Get the icons
var likeIcon = document.getElementById("like");
var dislikeIcon = document.getElementById("dislike");

likeIcon.addEventListener("click", function () {
  // Check if the user is logged in
  if (getLoggedInUser()) {
    // Toggle the "liked" class to change the color
    this.classList.toggle("liked");
    // Get the current like status from local storage
    var likes = JSON.parse(localStorage.getItem("likes")) || {};
    // Update the like status for "mum" icon
    likes.like = this.classList.contains("liked");
    // Store the updated like status back to local storage
    localStorage.setItem("likes", JSON.stringify(likes));
  } else {
    // If user is not logged in, show alert
    alert("Please log in to like.");
  }
});

dislikeIcon.addEventListener("click", function () {
  // Check if the user is logged in
  if (getLoggedInUser()) {
    // Toggle the "disliked" class to change the color
    this.classList.toggle("disliked");
    // Get the current like status from local storage
    var likes = JSON.parse(localStorage.getItem("likes")) || {};
    // Update the like status for "dad" icon
    likes.dislike = this.classList.contains("disliked");
    // Store the updated like status back to local storage
    localStorage.setItem("likes", JSON.stringify(likes));
  } else {
    // If user is not logged in, show alert
    alert("Please log in to dislike.");
  }
});
