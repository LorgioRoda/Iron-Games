const axios = require("axios");
class ApiHandler {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  getGames() {
    return axios.get(
      `${this.baseURL}/games?key=${process.env.API_KEY}&page_size=15`
    );
  }

  getGameByID(id) {
    return axios.get(`${this.baseURL}/games/${id}?key=${process.env.API_KEY}`);
  }
}

module.exports = ApiHandler;
