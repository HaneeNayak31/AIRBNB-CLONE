const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js"); // Import the validateReview middleware
const router = express.Router({ mergeParams: true }); // Enable merging of params
const reviewController = require("../controllers/review.js");
router.use((req, res, next) => {
  console.log("Request URL:", req.originalUrl);
  console.log("Request Params:", req.params);
  next();
});

// Create Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
