module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      req.app.locals.login = true;
      next();
    } else {
      req.app.locals.login = false;
      res.redirect("/login");
    }
  },
  isLoggedOut: (req, res, next) => {
    if (req.isAuthenticated()) {
      req.app.locals.login = true;
      res.redirect(`/user/${req.user._id}`);
    } else {
      req.app.locals.login = false;
      next();
    }
  },
};
