const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const controller = require("../controllers/review.js");

const {
  validateReview,
  isLoggedIn,
  isValidAuthor,
} = require("../middleware.js");

//Save Review
router.post("/", validateReview, isLoggedIn, wrapAsync(controller.saveReview));
//Delete Review
router.delete("/:reviewId", isValidAuthor, wrapAsync(controller.deleteReview));
module.exports = router;
