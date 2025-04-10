const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");
const { reviewSchema } = require("./schema.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req);
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must login to create new listing");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) res.locals.redirectUrl = req.session.redirectUrl;
  next();
};
module.exports.isValidOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.curUser._id)) {
    req.flash("error", "You are not the owner of the listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.validateList = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    console.log(error);
    let errmsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errmsg);
  }
  next();
};
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    let errmsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errmsg);
  }
  next();
};
module.exports.isValidAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!req.user) {
    req.flash("error", "Please login first");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author._id.equals(req.user._id)) {
    req.flash("error", "You did not post this comment.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
