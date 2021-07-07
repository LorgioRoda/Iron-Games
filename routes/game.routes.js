const express = require("express");
const router = express.Router();
const Game = require("../models/Game.model");
const User = require("../models/User.model");
const Review = require("../models/Review.model");
const { isLoggedIn } = require("../middlewares/auth");

/* GET Games Page */

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  let inCollection = false;
  let inWishlist = false;
  Game.findById(id)
    .then((game) => {
      Review.find({ game: id })
        .populate("user")
        .sort({ created_at: -1 })
        .then((reviews) => {
          if (!req.user) {
            return res.render("games/game-details", {
              game,
              sessionUser: req.user,
              reviews,
            });
          }
          const mappedReviews = reviews.map((review) => {
            if (review.user) {
              review.sessionUserRev =
                JSON.stringify(review.user._id) ===
                JSON.stringify(req.user._id);
            }
            return review;
          });
          const { _id: userID } = req.user;
          User.findById(userID).then((user) => {
            if (user.gameList.includes(id)) {
              inCollection = true;
            } else if (user.wishlist.includes(id)) {
              inWishlist = true;
            }
            res.render("games/game-details", {
              game,
              sessionUser: req.user,
              inCollection,
              inWishlist,
              reviews: mappedReviews,
            });
          });
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

// Add game to user collection
router.post("/add-collection", isLoggedIn, (req, res, next) => {
  const backURL = req.header("Referer");
  const host = req.headers.host;
  const redirectURL =
    backURL.split(`https://${host}`)[1] || backURL.split(`http://${host}`)[1];
  const { gameID } = req.body;
  const { _id: userID } = req.user;
  User.findById(userID)
    .then((user) => {
      if (user) {
        const { gameList } = user;
        if (!gameList.includes(gameID)) {
          User.findByIdAndUpdate(
            userID,
            { $push: { gameList: gameID }, $pull: { wishlist: gameID } },
            { new: true }
          )
            .then((user) => res.redirect(redirectURL))
            .catch((error) => next(error));
        } else {
          res.redirect(redirectURL);
        }
      } else {
        res.redirect(redirectURL);
      }
    })
    .catch((error) => next(error));
});

// Remove game from user collection
router.post("/remove-collection", isLoggedIn, (req, res, next) => {
  const backURL = req.header("Referer");
  const host = req.headers.host;
  const redirectURL =
    backURL.split(`https://${host}`)[1] || backURL.split(`http://${host}`)[1];
  const { gameID } = req.body;
  const { _id: userID } = req.user;
  User.findById(userID)
    .then((user) => {
      if (user) {
        const { gameList } = user;
        if (gameList.includes(gameID)) {
          User.findByIdAndUpdate(
            userID,
            { $pull: { gameList: gameID } },
            { new: true }
          )
            .then((user) => res.redirect(redirectURL))
            .catch((error) => next(error));
        } else {
          res.redirect(redirectURL);
        }
      } else {
        res.redirect(redirectURL);
      }
    })
    .catch((error) => next(error));
});

// Add game to user wishlist
router.post("/add-wishlist", isLoggedIn, (req, res, next) => {
  const backURL = req.header("Referer");
  const host = req.headers.host;
  const redirectURL =
    backURL.split(`https://${host}`)[1] || backURL.split(`http://${host}`)[1];
  const { gameID } = req.body;
  const { _id: userID } = req.user;
  User.findById(userID)
    .then((user) => {
      if (user) {
        const { wishlist } = user;
        if (!wishlist.includes(gameID)) {
          User.findByIdAndUpdate(
            userID,
            { $push: { wishlist: gameID } },
            { new: true }
          )
            .then((user) => res.redirect(redirectURL))
            .catch((error) => next(error));
        } else {
          res.redirect(redirectURL);
        }
      } else {
        res.redirect(redirectURL);
      }
    })
    .catch((error) => next(error));
});

// Remove game from user wishlist
router.post("/remove-wishlist", isLoggedIn, (req, res, next) => {
  const backURL = req.header("Referer");
  const host = req.headers.host;
  const redirectURL =
    backURL.split(`https://${host}`)[1] || backURL.split(`http://${host}`)[1];
  const { gameID } = req.body;
  const { _id: userID } = req.user;
  User.findById(userID)
    .then((user) => {
      if (user) {
        const { wishlist } = user;
        if (wishlist.includes(gameID)) {
          User.findByIdAndUpdate(
            userID,
            { $pull: { wishlist: gameID } },
            { new: true }
          )
            .then((user) => res.redirect(redirectURL))
            .catch((error) => next(error));
        } else {
          res.redirect(redirectURL);
        }
      } else {
        res.redirect(redirectURL);
      }
    })
    .catch((error) => next(error));
});

module.exports = router;
