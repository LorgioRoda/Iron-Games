require("dotenv").config();
const ApiHandler = require("./apiHandler");
const Game = require("../models/Game.model");
require("../configs/db.config");
const mongoose = require("mongoose");

const apiHandler = new ApiHandler(`${process.env.API_BASE_URL}`);

//Recursive function to get all games within the api
const getAllGames = (response, repeat) => {
  response.data.results.forEach((game) => {
    const screenshoots = game.short_screenshots.map(
      (screenshot) => screenshot.image
    );
    apiHandler.getGameByID(game.id).then((gameDetails) => {
      Game.findOne({ apiID: gameDetails.data.id })
        .then((gameFind) => {
          if (!gameFind) {
            const {
              id,
              name_original,
              metacritic,
              released,
              background_image,
              website,
              metacritic_url,
              description_raw,
              description,
            } = gameDetails.data;
            const genres = gameDetails.data.genres.map((genre) => genre.name);
            const tags = gameDetails.data.tags.map((tag) => tag.name);
            const developers = gameDetails.data.developers.map(
              (developer) => developer.name
            );
            let gameData = {
              name: name_original,
              apiID: id,
              released,
              background_image,
              metacritic,
              genres,
              tags,
              screenshoots,
              website,
              metacritic_url,
              developers,
              description_raw,
              description,
            };

            Game.insertMany(gameData).then(() => console.log("created game"));
          }
        })
        .catch((error) => console.log(error));
    });
  });
  if (response.data.next && repeat) {
    axios
      .get(response.data.next)
      .then((response) => getAllGames(response, true));
  }
};

// Call the api to populate DDBB
apiHandler.getGames().then((response) => getAllGames(response, false));
