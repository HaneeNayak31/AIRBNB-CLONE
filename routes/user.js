const express = require("express");
const router = express.Router(); // Enable merging of params
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirecturl } = require("../middleware.js");
const userController = require("../controllers/user.js");
const user = require("../models/user.js");
router
  .route("/signup")
  .get(userController.renderSignupForm) // Render the signup form
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm) // Render the login form
  .post(
    saveRedirecturl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userController.login // Handle login logic
  );
router.get("/logout", userController.logout); // Handle logout logic
module.exports = router;
