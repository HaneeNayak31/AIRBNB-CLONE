const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Store the original URL in the session
    req.flash("error", "You must be logged in to create a new listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirecturl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // Store the original URL in locals
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // Check if listing or owner or currUser is missing
  if (!listing || !listing.owner || !res.locals.currUser) {
    req.flash("error", "You are not authorized to do this!");
    return res.redirect(`/listings/${id}`);
  }
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not authorized to do this!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); // Validate the request body against the schema
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review || !review.author || !res.locals.currUser) {
    req.flash("error", "You are not authorized to do this!");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not authorized to do this!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
