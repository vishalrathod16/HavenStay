const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.saveReview = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  // console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.session.flash.success = "Added Review";
  res.redirect(`/listings/${id}`);
};
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.session.flash.success = "Deleted Review";
  res.redirect(`/listings/${id}`);
};
