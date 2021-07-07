const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const uploader = require("../configs/cloudinary.config");
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");

router.get("/", isLoggedIn, (req, res, next) => {
  res.render("user/profile", { sessionUser: req.user });
});

//Edit Profile
router.get("/edit", isLoggedIn, (req, res) => {
  const { _id: id } = req.user;
  User.findById(id)
    .then((user) => {
      res.render("user/user-edit", { sessionUser: req.user, user });
    })
    .catch((error) => {
      res.render("user/profile", { sessionUser: req.user });
    });
});

//Profile edit user
router.post(
  "/edit",
  isLoggedIn,
  uploader.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "profile_Background", maxCount: 1 },
  ]),
  (req, res) => {
    const { user, city, description, facebook, twitter, steam, genres } = req.body;
    const { _id: id } = req.user;
    console.log(genres);
    if (req.files) {
      User.findById(id).then((currentUser) => {
        User.findByIdAndUpdate(
          id,
          {
            name: user,
            city,
            description,
            genres,
            social: { steam: steam, twitter: twitter, facebook: facebook },
            profile_pic: req.files.profileImage
              ? req.files.profileImage[0].path
              : currentUser.profile_pic,
            profile_Background: req.files.profile_Background
              ? req.files.profile_Background[0].path
              : currentUser.profile_Background,
          },
          { new: true }
        )
          .then((user) => {
            res.redirect(`/user/${user._id}`);
          })
          .catch((error) => console.error(error));
      });
    }
  }
);

//Profile delete
router.post("/:id/delete", isLoggedIn, (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => console.error(error));
});

module.exports = router;
