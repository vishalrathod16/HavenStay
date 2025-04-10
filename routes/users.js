const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controller = require("../controllers/user.js");

router.route("/signup").get(controller.renderSignUp).post(controller.signUp);
router
  .route("/login")
  .get(controller.renderLoginPage)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    controller.login
  );
router.get("/logout", controller.renderLogout);

module.exports = router;
