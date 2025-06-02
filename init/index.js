const mongoose = require("mongoose");

const path = require("path");
const initData = require(path.resolve("../init/data.js"));
const Listing = require(path.resolve("../models/listing.js"));
require("dotenv").config();
const fetch = require("node-fetch"); // or axios
const mapToken = process.env.MAP_TOKEN;
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
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68142e4de73c73d0c89ddad4",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
