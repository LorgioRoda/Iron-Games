const express = require("express");
const { isLoggedIn } = require("../middlewares/auth");
const router = express.Router();
const Game = require("../models/Game.model");
const User = require("../models/User.model");

/* GET Games Page */

router.get("/", (req, res, next) => {
  let mappedGames;
  Game.find({})
    .then((games) => {
      if (req.user) {
        User.findById(req.user._id)
          .then((user) => {
            mappedGames = games.map((game) => {
              if (user.gameList.includes(game._id)) {
                game.owned = true;
              } else if (user.wishlist.includes(game._id)) {
                game.wishlisted = true;
              }
              return game;
            });
            res.render("games/game-list", {
              games: mappedGames,
              sessionUser: req.user,
            });
          })
          .catch((error) => next(error));
      } else {
        res.render("games/game-list", { games, sessionUser: req.user });
      }
    })
    .catch((error) => next(error));
});

router.get("/search", (req, res, next) => {
  const { search } = req.query;
  let mappedGames = [];
  if (search) {
    Game.find({ name: { $regex: `.*(?i)${search}.*` } })
      .then((games) => {
        if (req.user) {
          User.findById(req.user._id)
            .then((user) => {
              mappedGames = games.map((game) => {
                if (user.gameList.includes(game._id)) {
                  game.owned = true;
                } else if (user.wishlist.includes(game._id)) {
                  game.wishlisted = true;
                }
                return game;
              });
              res.render("games/game-list", {
                games: mappedGames,
                search,
                sessionUser: req.user,
              });
            })
            .catch((error) => next(error));
        } else {
          res.render("games/game-list", {
            games,
            search,
            sessionUser: req.user,
          });
        }
      })
      .catch((error) => next(error));
  } else {
    res.redirect("/games");
  }
});

router.get("/recomendations", isLoggedIn, (req, res, next) => {
  if (req.user) {
    User.findById(req.user._id).then((user) => {
      Game.find({
        $and: [
          { genres: { $in: user.genres } },
          { _id: { $nin: user.gameList } },
          { _id: { $nin: user.wishlist } },
        ],
      })
        .then((games) => {
          let mappedGames = games.map((game) => {
            if (
              !user.gameList.includes(game._id) ||
              !user.wishlist.includes(game._id)
            ) {
              return game;
            }
          });
          res.render("games/game-recomendations", {
            games: mappedGames,
            sessionUser: req.user,
          });
        })
        .catch((error) => next(error));
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
