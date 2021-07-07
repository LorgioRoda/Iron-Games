const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Review = require("../models/Review.model");

//Profile Game List
router.get("/:id/collection", (req, res) => {
  let authUser = false;
  const { id } = req.params;
  User.findById(id)
    .populate("gameList")
    .then((user) => {
      if (JSON.stringify(req.user._id) === JSON.stringify(id)) {
        authUser = true;
        user.gameList.map((game) => {
          game.authUser = true;
          return game;
        });
      }
      res.render("user/user-collection", {
        user,
        sessionUser: req.user,
        authUser,
      });
    });
});

//Profile Wishlist
router.get("/:id/wishlist", (req, res) => {
  let authUser = false;
  const { id } = req.params;
  User.findById(id)
    .populate("wishlist")
    .then((user) => {
      if (JSON.stringify(req.user._id) === JSON.stringify(id)) {
        authUser = true;
        user.wishlist.map((game) => {
          game.authUser = true;
          return game;
        });
      }
      res.render("user/user-wishlist", {
        user,
        sessionUser: req.user,
        authUser,
      });
    });
});

//Profile reviews
router.get("/:id/reviews", (req, res) => {
  let authUser = false;
  const { id } = req.params;
  User.findById(id)
  .then((user)=>{
    Review.find({ user: id })
    .populate("game")
    .populate("user")
    .sort({ created_at: -1 })
    .then((reviews) => {
      if (JSON.stringify(req.user._id) === JSON.stringify(id)) {
        authUser = true;
        reviews.map((review) => {
          review.sessionUserRev = true;
          return review;
        });
      }
      res.render("user/user-reviews", {
        reviews,
        sessionUser: req.user,
        authUser,
        user: user,
      });
    })
    .catch(error => console.error(error));
  })
  .catch(error => console.error(error));
});

//Profile Game List and Wishlist
router.get("/:id", (req, res) => {
  let authUser = false;
  const { id } = req.params;
  User.findById(id)
    .populate({ path: "gameList", options: { limit: 5 } })
    .populate({ path: "wishlist", options: { limit: 5 } })
    .then((user) => {
      if (JSON.stringify(req.user._id) === JSON.stringify(id)) {
        authUser = true;
      }
      res.render("user/profile", { user, sessionUser: req.user, authUser });
    });
});

module.exports = router;
