const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  validateReview,
} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer"); // If you need multer for file uploads
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
router
  .route("/")
  //Index route
  .get(wrapAsync(listingController.index))
  //create route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );
//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);
router
  .route("/:id")
  //show route
  .get(wrapAsync(listingController.showListing))
  //update route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  ) //delete route
  .delete(wrapAsync(listingController.destroyListing));

//edit route
router.get(
  "/:id/edit",
  isOwner,
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);
module.exports = router;
