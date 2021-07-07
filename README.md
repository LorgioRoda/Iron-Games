# IronGames

<br>



## Description

IronGames is a social platform for videogames, an online database with information where the users can bookmark and wishlist games, get recomendations based on it's favourite genres and write reviews and vote other user reviews.


<br>

## User Stories

- **404** - As users, we want to see a nice 404 page when we go to a page that doesn’t exist so that I know it was my fault
- **500** - As user, we want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a users, we want to be able to access the homepage and search by game, log in and sign up. 
- **sign up** - As users, we want to sign up on the web page so that we can add games to our library and wishlist and review games.
- **login** - As users, we want to be able to log in on the web page so that we can get back to our profile.
- **logout** - As users, we want to be able to log out from the web page so that we can make sure no one will access our account.
- **profile page** - As users, we want to see be able to see users profiles, edit our own profile, manage our games and access our game collections.
- **profile edit page** - As users, we want to see be able to edit our own profile, manage our games and access our game collections.
- **My games page** - As users, we want to see be able to see the user saved games and be able to remove game from the collection.
- **Wishlist page** - As users, we want to see be able to see the user whislisted games and be able to remove game from the collection.
- **Reviews page** - As users, we want to see be able to see the user reviews and be able to remove or edit from the user profile.
- **Review edit page** - As users, we want to edit the reviews made.
- **Games page** - As users, we want to be able to see all the games availables and search them.
- **Game details** - As users, we want to see the details of a selected game, upvote the game, add to our collections or add a review.
- **Games recomendations** - As users, we want to be able to see recomendations of games availables based on our prefered game genres.



<br>



## Server Routes (Back-end):



| **Method** | **Route**                          | **Description**                                              | Request  - Body                                          |
| ---------- | ---------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| `GET`      | `/`                                | Main page route.  Renders home `index` view.                 |                                                          |
| `GET`      | `/login`                           | Renders `login` form view.                                   |                                                          |
| `POST`     | `/login`                           | Sends Login form data to the server. Redirects to `home page`                       | { email, password }                                      |
| `GET`      | `/signup`                          | Renders `signup` form view.                                  |                                                          |
| `POST`     | `/signup`                          | Sends Sign Up info to the server and creates user in the DDBB.Redirects to `user profile`.| {  name, email, password, re-password  }             |
| `GET`     | `/logout`                          | Private route. User logout.                                  |                                                          |
| `GET`      | `/auth/google`                 | Social signup/login with google.                                 |                                                          |
| `GET`      | `/auth/google/callback`                 | Social signup/login with google callback.   view.                                 |                                                          |
| `GET`      | `/user/:id`                 | Renders `user/profile` view.                                 |                                                          |
| `GET`      | `/user/:id/collection`           | Renders `user-collection` view.                                   |                                                          |
| `GET`      | `/user/:id/wishlist`        | Renders `user-wishlist` view.                                |                                                          |
| `GET`      | `/user/:id/reviews`        | Renders `user-reviews` view.                                |                                                          |
| `GET`      | `/profile/edit`                    | Private route. Render the `profile-edit` view.               |                                                          |
| `POST`     | `/profile/edit`                    | Private route. Sends `profile-edit` info to server and Updates the user in DDBB. |  { name, city, description, genres, social, profile_pic, profile_Background}                                                        |
| `POST`     | `/profile/:id/delete`                    | Private route. Delete user from DDBB. |  { _id}                                                        |
| `GET`      | `/games`                           | Renders `game-list` view.                                    |                                                          |
| `GET`      | `/games/search`                    | Renders filtered `game-list` view.                                    |   
| `GET`      | `/games/recomendations`                    | Renders `game-recomendations` view.                                    |                                                      |
| `GET`      | `/game/:id`                        | Renders `game-detail` view.                                  |                                                          |
| `POST`     | `/game/add-collection`                 | Private route. Add game to session user collection.| { _id}                                                          |
| `POST`     | `/game/remove-collection`                 | Private route. Remove game to session user collection.| { _id}                                                          |
| `POST`     | `/game/add-wishlist`                 | Private route. Add game to session user wishlist.| { _id}                                                          |
| `POST`     | `/game/remove-wishlist`                 | Private route. Remove game to session user wishlist.| { _id}                                                          |
| `POST`     | `/review/create`           | Sends review form data to the server and creates the review in the DDBB.| { user, game, comment }                                 |
| `GET`      | `/review/:id/edit`           | Private route. Renders the `review-edit` view.               |                                                          |
| `POST`     | `/review/:id/edit`           | Private route. Sends `review-edit` info to Server and Updates the review in DDBB.| { comment }                          |
| `POST`     | `/review/:id/delete`         | Private route. Removes the review from the DDBB              | { _id }                                                          |
| `POST`     | `/review/axios/:id/delete`         | Private route. Removes the review from the DDBB              | { _id }                                                          |
| `POST`     | `/review/:id/upvote`         | Private route. Updates the review from the DDBB              | { id, { downvote } }                                                          |
| `POST`     | `/review/:id/downvote`         | Private route. Updates the review from the DDBB              | { id, { downvote } }                                                          |







## Models

User

```javascript
{
  google_id: { type: String },
  name: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  city: { type: String },
  profile_pic: {type: String, default:'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'},
  profile_Background: {type: String, default:'https://cdn-res.keymedia.com/cms/images/ca/155/0319_637171637373959129.jpg'},
  description: { type: String, maxlength: 280 },
  rol: { type: String },
  gameList: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  social: {
    facebook: { type: String },
    twitter: { type: String },
    steam: { type: String },
  },
  genres: []
}

```



Review

```javascript
{
  user: { type: Schema.Types.ObjectId, ref: "User" },
    game: { type: Schema.Types.ObjectId, ref: "Game" },
    comment: { type: String },
    upvote: { type: Number, default: 0 },
    downvote: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  }

```


Game

```javascript
{
  _id: Object_ID,
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
  description: { type: String }
}

```




<br>



## Backlog

- Create confirmation modal before a user is deleted.
- Send emails to a user when one of it's reviews has recibe an upvote or downvote.
- Add a map so people can see where in the world are located the rest of the users of the app.
- Simulate all actions in the app to behave like a SPA.
- Allow users to create custom game list and share with others.
- Implement user roles with permissions and different functionalities.

[See the Trello board.](https://trello.com/b/sdPDPIGx/module2-project)



<br>



## Links



### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/BeAvisP/M2-Project)

[Deploy Link](https://iron-games.herokuapp.com/)



<br>



### Slides

The url to your presentation slides

[Slides Link](https://prezi.com/view/q81QDxlhlFgjPEMpFwnT/)