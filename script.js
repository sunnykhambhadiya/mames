let photoFeed = document.getElementById("photoFeed");

// Simulating users (In real applications, this would come from the backend)
let currentUser = {
  username: "user1",  // Change this to simulate different users (e.g., "user1", "user2")
  role: "user"        // Keep role as "user" (not "admin") for normal users
};

// Store liked and commented photo IDs to prevent multiple likes and comments by the same user
let likedPhotos = new Set();
let commentedPhotos = new Set();

// Track comments for each photo and user
let photoComments = {};  // { photoID: { username: comment } }

function uploadImage() {
  let uploadInput = document.getElementById("uploadPhoto");
  let file = uploadInput.files[0];

  if (file) {
    let reader = new FileReader();
    reader.onload = function(e) {
      let imgURL = e.target.result;
      addPhotoToFeed(imgURL);
    };
    reader.readAsDataURL(file);
  }
}

function addPhotoToFeed(imgURL) {
  let photoCard = document.createElement("div");
  photoCard.className = "photo-card";

  // Unique ID for each photo card
  let photoID = `photo-${Math.random().toString(36).substring(7)}`;

  // Image
  let imgElement = document.createElement("img");
  imgElement.src = imgURL;

  // Like Button
  let likeBtn = document.createElement("button");
  likeBtn.className = "like-btn";
  likeBtn.innerText = "Like";

  let likeCount = 0; // Like count variable
  let likeDisplay = document.createElement("div");
  likeDisplay.className = "like-count";
  likeDisplay.innerText = "Likes: 0"; 

  // Event Listener for Like Button
  likeBtn.addEventListener("click", function() {
    // Check if the user already liked this photo
    if (!likedPhotos.has(photoID)) {
      likeCount++;
      likedPhotos.add(photoID); // Mark this photo as liked by the user
      likeDisplay.innerText = `Likes: ${likeCount}`;
      likeBtn.disabled = true; // Disable the like button after one like
      likeBtn.style.backgroundColor = '#ccc'; // Change button color after liking
    }
  });

  // Comment Section
  let commentSection = document.createElement("div");
  commentSection.className = "comment-section";

  let commentInput = document.createElement("input");
  commentInput.type = "text";
  commentInput.placeholder = "Add a comment...";
  commentInput.disabled = false; // Ensure the input is enabled initially

  let commentList = document.createElement("div");
  let commentCount = 0; // Comment count variable
  let commentCountDisplay = document.createElement("div");
  commentCountDisplay.className = "comment-count";
  commentCountDisplay.innerText = "Comments: 0"; 

  // Comment Button
  let commentBtn = document.createElement("button");
  commentBtn.className = "comment-btn";
  commentBtn.innerText = "Comment";

  // Event Listener for Comment Button
  commentBtn.addEventListener("click", function() {
    if (commentInput.value !== "" && !commentedPhotos.has(photoID)) {
      let comment = document.createElement("p");
      comment.innerText = `${currentUser.username}: ${commentInput.value}`;
      commentList.appendChild(comment);
      
      // Track comment per user and per photo
      if (!photoComments[photoID]) {
        photoComments[photoID] = {};
      }
      photoComments[photoID][currentUser.username] = commentInput.value; // Save comment by user

      commentInput.value = ""; // Clear input field
      commentInput.disabled = true; // Disable the input field after commenting
      commentCount++;
      commentCountDisplay.innerText = `Comments: ${commentCount}`;
      commentedPhotos.add(photoID); // Mark this photo as commented by the user
      commentBtn.disabled = true; // Disable the comment button after one comment
      commentBtn.style.backgroundColor = '#ccc'; // Change button color after commenting
    }
  });

  // Append everything to the photo card
  photoCard.appendChild(imgElement);
  photoCard.appendChild(likeBtn);
  photoCard.appendChild(commentBtn);
  photoCard.appendChild(likeDisplay);
  photoCard.appendChild(commentCountDisplay);
  photoCard.appendChild(commentInput);
  photoCard.appendChild(commentList);

  // Add the photo card to the feed
  photoFeed.appendChild(photoCard);

  // Show or hide comments based on the current user
  showCommentsForUser(photoID, commentList);
}

// Function to show comments based on the current user
function showCommentsForUser(photoID, commentList) {
  commentList.innerHTML = ""; // Clear existing comments

  // Check if there are comments for the photo
  if (photoComments[photoID]) {
    for (let user in photoComments[photoID]) {
      if (user === currentUser.username) {
        // Show comment if it belongs to the current user
        let comment = document.createElement("p");
        comment.innerText = `${user}: ${photoComments[photoID][user]}`;
        commentList.appendChild(comment);
      }
    }
  }
}

// Function to load all images from the "img" folder
function loadImages() {
  let images = ["mames1.jpg", "mames2.jpg", "mames3.jpg"]; // List of image files in the "img" folder
  images.forEach(img => {
    let imgURL = `img/${img}`;
    addPhotoToFeed(imgURL);
  });
}

// Load images on page load
window.onload = function() {
  loadImages();
};
