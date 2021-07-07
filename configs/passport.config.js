const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const flash = require("connect-flash");

module.exports = (app) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        return done(null, user);
      })
      .catch((error) => {
        return done(error);
      });
  });
  app.use(flash());

  //Local Strategy
  passport.use(
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      (req, username, password, done) => {
        User.findOne({ email: username })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                errorMessage: "Incorrect email or password",
              });
            }
            if (!bcrypt.compareSync(password, user.password)) {
              return done(null, false, {
                errorMessage: "Incorrect email or password",
              });
            }
            done(null, user);
          })
          .catch((error) => {
            done(error);
          });
      }
    )
  );

  //Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
      },
      (accessToken, refreshToken, profile, cb) => {
        User.findOne({ google_id: profile.id })
          .then((user) => {
            if (user) {
              cb(null, user);
              return;
            }
            console.log(profile)
            User.create({
              google_id: profile.id,
              email: profile._json.email,
              name: profile.displayName,
              profile_pic: profile._json.picture,
            })
              .then((newUser) => {
                cb(null, newUser);
              })
              .catch((error) => cb(error));
          })
          .catch((error) => cb(error));
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
