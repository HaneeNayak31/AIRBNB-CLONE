const User = require("../models/user");
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser); // Log the registered user
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); // Handle login error
      }
      req.flash("success", "Welcome to wanderlust!"); // Flash message for successful registration
      res.redirect("/listings"); // Redirect to the listings page after successful registration
    }); // Log in the user after registration
  } catch (e) {
    req.flash("error", e.message); // Flash message for registration error
    res.redirect("/signup"); // Redirect back to the signup page on error
  }
};
module.exports.login = async (req, res) => {
  req.flash("success", "welcome back to wanderlust ! "); // Flash message for successful login
  let redirectUrl = req.session.redirectUrl || "/listings"; // Get the redirect URL from session or default to listings
  res.redirect(redirectUrl); // Redirect to the samepage requested  after successful login
};
module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err); // Handle logout error
    } else {
      req.flash("success", "you are logged out!"); // Flash message for successful logout
      res.redirect("/listings"); // Redirect to the listings page after logout
    }
  });
};
