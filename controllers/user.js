const User = require("../models/user");
module.exports.renderSignUp = (req, res) => {
  res.render("listings/signup.ejs");
};
module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let savedUser = await User.register(newUser, password);
    req.login(savedUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome To HavenStay!");
      res.redirect("/listings");
    });
  } catch (e) {
    console.log(e);
    req.flash("error", "Invalid Username or Password");
    res.redirect("/signup");
  }
};
module.exports.renderLoginPage = (req, res) => {
  res.render("listings/login.ejs");
};
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome To HavenStay");
  if (!res.locals.redirectUrl) res.redirect("/listings");
  else res.redirect(res.locals.redirectUrl);
};
module.exports.renderLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out.");
    res.redirect("/listings");
  });
};
