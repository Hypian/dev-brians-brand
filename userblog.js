document.addEventListener("DOMContentLoaded", function () {
  const blogContainer = document.getElementById("blogContainer");

  // Fetch blog data from local storage
  const userBlogData = JSON.parse(localStorage.getItem("userBlog"));

  if (userBlogData) {
    // Create blog post element
    const blogPost = document.createElement("div");
    blogPost.classList.add("blog-post");

    // Set image if available
    if (userBlogData.pictureSelected) {
      const image = document.createElement("img");
      image.src = userBlogData.pictureSelected;
      image.alt = "Blog Image";
      blogPost.appendChild(image);
    }

    // Set title
    const title = document.createElement("h2");
    title.textContent = userBlogData.title;
    blogPost.appendChild(title);

    // Set text
    const text = document.createElement("p");
    text.textContent = userBlogData.text;
    blogPost.appendChild(text);

    // Like button
    const likeButton = document.createElement("button");
    likeButton.classList.add("likeBtn");
    likeButton.innerHTML = '<i class="far fa-thumbs-up"></i> Like';
    blogPost.appendChild(likeButton);

    // Append blog post to container
    blogContainer.appendChild(blogPost);

    // Like button functionality
    likeButton.addEventListener("click", function () {
      // Retrieve logged-in user's email from local storage
      const loggedInUserEmail = localStorage.getItem("userDataTwo");

      if (loggedInUserEmail) {
        // Retrieve the current likes object from local storage
        let likes = JSON.parse(localStorage.getItem("likes")) || {};

        // Check if the user has already liked the blog post
        const hasLiked = likes.hasOwnProperty(loggedInUserEmail);

        // Toggle the like status
        if (hasLiked) {
          delete likes[loggedInUserEmail]; // Remove like if already liked
        } else {
          likes[loggedInUserEmail] = true; // Set like if not already liked
        }

        // Save the updated likes object to local storage
        localStorage.setItem("likes", JSON.stringify(likes));

        // Update button appearance based on like status
        if (hasLiked) {
          likeButton.style.color = ""; // Reset color when unliked
        } else {
          likeButton.style.color = "red"; // Change color to red when liked
        }
      } else {
        // If no logged-in user, prompt to login
        alert("Please login to like the blog.");
      }
    });

    // Comment form
    const commentForm = document.createElement("form");
    const textarea = document.createElement("textarea");
    textarea.placeholder = "Add Your Comment";
    const commentButton = document.createElement("input");
    commentButton.type = "submit";
    commentButton.value = "Comment";
    commentForm.appendChild(textarea);
    commentForm.appendChild(commentButton);
    blogPost.appendChild(commentForm);

    // Comment form functionality
    commentForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Retrieve logged-in user's email from local storage
      const loggedInUserEmail = localStorage.getItem("userData");

      if (loggedInUserEmail) {
        // Retrieve comment text
        const commentText = textarea.value;

        // Get existing comments from local storage
        let comments = JSON.parse(localStorage.getItem("comments")) || [];

        // Find if user already has a comment
        const existingCommentIndex = comments.findIndex(
          (comment) => comment.email === loggedInUserEmail
        );

        if (existingCommentIndex !== -1) {
          // If user already has a comment, update it
          comments[existingCommentIndex].comment = commentText;
        } else {
          // If user doesn't have a comment, add a new one
          comments.push({
            email: loggedInUserEmail,
            comment: commentText,
          });
        }

        // Save comments to local storage
        localStorage.setItem("comments", JSON.stringify(comments));

        // Clear textarea
        textarea.value = "";

        // Alert user that comment has been added
        alert("Comment added successfully!");
      } else {
        // If no logged-in user, prompt to login
        alert("Please login to leave a comment.");
      }
    });
  } else {
    // Display message if no blog data found
    blogContainer.innerHTML = "<p>No blog data available</p>";
  }
});
