const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isValidOwner, validateList } = require("../middleware.js");
const controller = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

//Home Page route
router.get("/", wrapAsync(controller.index));
router.get("/filter", controller.filter);
router.get("/search", controller.search);
// new route
router.get("/new", isLoggedIn, controller.renderNewListing);
// save new route
router.post(
  "/",
  isLoggedIn,
  upload.single("list[image]"),
  validateList,
  controller.saveNewListing
);

//EDIT OPEN ROUTE
router.get("/:id/edit", isLoggedIn, isValidOwner, controller.renderEditListing);
//UPDATE SAVE CHANGES
router.put(
  "/:id",
  isLoggedIn,
  isValidOwner,
  upload.single("list[image]"),
  validateList,
  controller.saveEditChanges
);
//DELETE OPTION
router.delete("/:id", isLoggedIn, isValidOwner, controller.deleteListing);

//Show each Route
router.get("/:id", controller.viewListing);
module.exports = router;
