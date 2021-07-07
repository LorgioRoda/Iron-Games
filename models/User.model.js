const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  google_id: { type: String },
  name: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  city: { type: String },
  profile_pic: {type: String, default:'https://c4.wallpaperflare.com/wallpaper/677/516/1012/world-of-warcraft-battle-for-azeroth-sylvanas-windrunner-anduin-wrynn-video-games-wallpaper-preview.jpg'},
  profile_Background: {type: String, default:'https://c4.wallpaperflare.com/wallpaper/988/183/707/artwork-fantasy-art-world-of-warcraft-horde-wallpaper-preview.jpg'},
  description: { type: String, maxlength: 280 },
  rol: { type: String },
  gameList: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  social: {
    facebook: { type: String },
    twitter: { type: String },
    steam: { type: String },
  },
  genres: [],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
