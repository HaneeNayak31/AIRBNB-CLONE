const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
//create review
module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError("Listing not found", 404); // Handle missing listing
  }
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // Associate the review with the logged-in user
  listing.reviews.push(newReview);
  console.log("New Review:", newReview); // Debugging
  await newReview.save();
  await listing.save();
  req.flash("success", "Successfully created a new review!");
  res.redirect(`/listings/${listing._id}`);
};
//delete review
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError("Listing not found", 404); // Handle missing listing
  }
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/listings/${id}`);
};
