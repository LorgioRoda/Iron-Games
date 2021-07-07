const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: { type: String, require: true },
  released: { type: String },
  background_image: { type: String },
  metacritic: { type: Number },
  genres: { type: [String] },
  tags: { type: [String] },
  screenshoots: { type: [String] },
  apiID: {type: Number, require: true, unique: true},
  website: { type: String },
  metacritic_url: { type: String },
  developers: { type: [String] },
  description: { type: String },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
