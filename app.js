const express = require("express");
const app = express();
const mongoose = require("mongoose"); //models\listing.js
const ejs = require("ejs");
const path = require("path"); // ✅ Require 'path' before using it
const Listing = require(path.resolve(__dirname, "models", "listing.js"));
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
main()
  .then(() => {
    console.log("CONNECTED TO db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(
    "mongodb+srv://HaneeNayak31:h1a1n1e1e1@cluster0.ngtkgxy.mongodb.net/wanderlust"
  );
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Hi , i am root");
});
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render(path.join(__dirname, "views", "listings", "index.ejs"), {
    allListings,
  });
});
//New Route
app.get("/listings/new", (req, res) => {
  res.render(path.join(__dirname, "views", "listings", "new.ejs"));
});
//show route
app.get("/listings/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  console.log(listing); // Check the structure
  res.render(path.join(__dirname, "views", "listings", "show.ejs"), {
    listing,
  });
});

// app.get("/listings/:id", async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("H:\\MAJORPROJECT\\views\\listings\\show.ejs", { listing });
// });
//create route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});
//edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render(path.join(__dirname, "views", "listings", "edit.ejs"), {
    listing,
  });
});
//update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});
//delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});
app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
