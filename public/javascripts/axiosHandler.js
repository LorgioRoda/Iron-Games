class AxiosHandler {
	constructor(baseURL) {
		this.baseURL = baseURL;
	}

	removeFromCollection(game, user) {
			return axios.get(`${this.baseURL}/games/game/remove-collection-axios`);
	}

  removeReview(reviewID){
    return axios.post(`${this.baseURL}/review/axios/${reviewID}/delete`);
  }
}