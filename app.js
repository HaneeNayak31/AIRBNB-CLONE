if (process.env.NODE_ENV != "production") {
  require("dotenv").config(); // Load environment variables from .env file
}
//const Listing = require("./models/listing.js");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path"); // Ensure 'path' is required
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const joi = require("joi");
const { listingSchema, reviewSchema } = require("./schema.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js"); // Corrected path
const session = require("express-session");
const MongoStore = require("connect-mongo"); // Import MongoStore for session storage
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js"); // Corrected path
const multer = require("multer"); // If you need multer for file uploads
const upload = multer({ dest: "uploads/" }); // Configure multer to store files in 'uploads' directory
const userRouter = require("./routes/user.js"); // Corrected path
const dbUrl = process.env.ATLASDB_URL || "mongodb://localhost:27017/wanderlust"; // Use environment variable or default to local MongoDB
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => {
    console.log("CONNECTED TO db");
  })
  .catch((err) => {
    console.log(err);
  });
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl, // Use the same MongoDB URL as above
  crypto: {
    secret: process.env.SECRET, // Secret for encrypting session data
  },
  touchAfter: 24 * 3600, // How often to update the session in seconds
}); // Create a new MongoStore instance
store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err); // Log any errors in the MongoStore
});
const sessionOptions = {
  store, // Use the MongoStore instance for session storage
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    HttpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  },
};

app.use(session(sessionOptions)); // Use session middleware
app.use(flash()); // Use flash middleware
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Use passport session
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Make flash messages available in views
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // Make current user available in views
  next();
});
passport.use(new LocalStrategy(User.authenticate())); // Use local strategy for authentication
passport.serializeUser(User.serializeUser()); // Serialize user
passport.deserializeUser(User.deserializeUser()); // Deserialize user

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter); // Mount the listings router
app.use("/", userRouter); // Mount the user router
app.use((err, req, res, next) => {
  let { message = "something went wrong!", statusCode = 500 } = err;
  res.status(statusCode).render("errors.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
