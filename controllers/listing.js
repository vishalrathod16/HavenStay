const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};
module.exports.filter = wrapAsync(async (req, res) => {
  const filter = req.query.filters;
  if (!filter) {
    req.flash("error", "No Places with the selected filter...");
    return res.redirect("/listings");
  }
  const listings = await Listing.find({ filters: filter });
  res.render("listings/index.ejs", { allListings: listings });
});
module.exports.search = wrapAsync(async (req, res) => {
  const searchVal = req.query.searchValue;
  if (!searchVal) {
    res.redirect("/listings");
    return;
  }

  const allListings = await Listing.find({
    $or: [
      { location: { $regex: searchVal, $options: "i" } },
      { title: { $regex: searchVal, $options: "i" } },
      { country: { $regex: searchVal, $options: "i" } },
    ],
  });
  res.render("listings/index.ejs", { allListings });
});

module.exports.renderNewListing = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.saveNewListing = wrapAsync(async (req, res) => {
  let newListing = new Listing(req.body.list);
  newListing.owner = req.user._id;
  let { filename, path } = req.file;
  newListing.image = { url: path, filename };

  let temp = await geocodingClient
    .forwardGeocode({
      query: newListing.location,
      limit: 1,
    })
    .send();
  if (temp.body.features.length == 0) {
    req.flash("error", "Unable to find the entered location");
    res.redirect("/listings/new");
    return;
  }
  newListing.geometry = temp.body.features[0].geometry;
  let printList = await newListing.save();
  req.flash("success", "New Listing Added");
  // console.log(printList);
  res.redirect("/listings");
});
module.exports.renderEditListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Does Not Exist");
    return res.redirect("/listings");
  }
  let changedUrl = listing.image.url;
  changedUrl = changedUrl.replace("/upload", "/upload/h_250,w_300");

  res.render("listings/edit.ejs", { listing, changedUrl });
});
module.exports.saveEditChanges = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let obj = req.body.list;
  newListing = await Listing.findByIdAndUpdate(id, { ...obj });
  if (req.file) {
    let { filename, path } = req.file;
    newListing.image = { url: path, filename };
    await newListing.save();
  }

  // console.log(listing);
  res.redirect(`/listings/${id}`);
});
module.exports.deleteListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings");
});
module.exports.viewListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Does Not Exist");
    return res.redirect("/listings");
  }
  const curLocation = listing.geometry.coordinates;
  if (curLocation.length == 0) {
    res.send("location not defined");
    return;
  }
  const mapToken = process.env.MAP_TOKEN;
  res.render("listings/show.ejs", { listing, curLocation, mapToken });
});
