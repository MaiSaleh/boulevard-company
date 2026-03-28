import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPpvNjcB7VFo-fN4cyRpnhUtOR_Z2B3b8",
  authDomain: "boulevard-reviews.firebaseapp.com",
  projectId: "boulevard-reviews",
  storageBucket: "boulevard-reviews.firebasestorage.app",
  messagingSenderId: "448230081304",
  appId: "1:448230081304:web:a6622229befa5cbe97146d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const reviewsRef = collection(db, "reviews");

const reviewForm = document.getElementById("review-form");
const reviewsList = document.getElementById("reviews-list");
const formMessage = document.getElementById("form-message");

function escapeHTML(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createStars(rating) {
  const safeRating = Math.max(1, Math.min(5, Number(rating) || 0));
  return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
}

function renderReviews(snapshot) {
  if (!reviewsList) return;

  if (snapshot.empty) {
    reviewsList.innerHTML = "<p class='no-reviews'>No reviews yet.</p>";
    return;
  }

  reviewsList.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();

    const name = escapeHTML(data.name || "Client");
    const message = escapeHTML(data.message || "");
    const stars = createStars(data.rating);

    const card = document.createElement("div");
    card.className = "review-card";

    card.innerHTML = `
      <div class="review-stars">${stars}</div>
      <p class="review-text">"${message}"</p>
      <h4 class="review-name">— ${name}</h4>
    `;

    reviewsList.appendChild(card);
  });
}

function loadReviewsLive() {
  if (!reviewsList) return;

  const reviewsQuery = query(
    reviewsRef,
    orderBy("createdAt", "desc"),
    limit(6)
  );

  onSnapshot(
    reviewsQuery,
    (snapshot) => {
      renderReviews(snapshot);
    },
    (error) => {
      console.error("Error loading reviews:", error);
      reviewsList.innerHTML = "<p class='no-reviews'>Failed to load reviews.</p>";
    }
  );
}

if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("review-name");
    const ratingInput = document.getElementById("review-rating");
    const messageInput = document.getElementById("review-message");

    const name = nameInput.value.trim();
    const rating = parseInt(ratingInput.value, 10);
    const message = messageInput.value.trim();

    if (!name || !rating || !message) {
      formMessage.textContent = "Please fill in all fields.";
      return;
    }

    try {
      await addDoc(reviewsRef, {
        name,
        rating,
        message,
        createdAt: serverTimestamp()
      });

      formMessage.textContent = "Thank you! Your review has been published.";
      reviewForm.reset();
    } catch (error) {
      console.error("Error submitting review:", error);
      formMessage.textContent = "Something went wrong. Please try again.";
    }
  });
}

loadReviewsLive();
