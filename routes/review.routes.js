const express = require("express");
const router = express.Router();
const Review = require("../models/Review.model");
const { isLoggedIn } = require("../middlewares/auth");
const { default: axios } = require("axios");

router.post("/create", isLoggedIn, (req, res, next) => {
  const { gameID: game, review: comment } = req.body;
  const { _id: user } = req.user;
  Review.create({ user, game, comment })
    .then(() => res.redirect(`/game/${game}`))
    .catch((error) => next(error));
});

router.post("/:id/upvote", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  Review.findById(id)
    .then((review) => {
      const upvote = review.upvote + 1;
      Review.findByIdAndUpdate(id, { upvote })
        .then(() => res.redirect(`/game/${review.game}`))
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

router.post("/:id/downvote", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  Review.findById(id)
    .then((review) => {
      const downvote = review.downvote + 1;
      Review.findByIdAndUpdate(id, { downvote })
        .then(() => res.redirect(`/game/${review.game}`))
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

router.get("/:id/edit", isLoggedIn, (req, res, next) => {
  const backURL = req.header("Referer");
  const host = req.headers.host;
  const redirectURL =
    backURL.split(`https://${host}`)[1] || backURL.split(`http://${host}`)[1];
  const { id } = req.params;
  Review.findById(id)
    .then((review) =>
      res.render("reviews/review-edit", {
        review,
        redirectURL,
        sessionUser: req.user,
      })
    )
    .catch((error) => next(error));
});

router.post("/:id/edit", isLoggedIn, (req, res, next) => {
  const { review: comment, redirect } = req.body;
  const { id } = req.params;
  Review.findByIdAndUpdate(id, { comment }, { new: true })
    .then((review) => {
      res.redirect(redirect);
    })
    .catch((error) => next(error));
});

router.post("/:id/delete", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  Review.findByIdAndDelete(id)
    .then(() => res.redirect(`/user/${req.user._id}/reviews`))
    .catch((error) => next(error));
});

router.post("/axios/:id/delete", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  let gameID;
  Review.findById(id)
    .populate("game")
    .then((review) => {
      gameID = review.game._id;
      return Review.findByIdAndDelete(id);
    })
    .then(() => {
      return Review.find({ game: gameID })
        .populate("user")
        .sort({ created_at: -1 });
    })
    .then((reviews) => {
      const mappedReviews = reviews.map((review) => {
        return {
          ...review,
          sessionUserRev: review.user
            ? JSON.stringify(review.user._id) === JSON.stringify(req.user._id)
            : false,
        };
      });
      res.json(mappedReviews);
    })
    .catch((error) => next(error));
});

module.exports = router;
