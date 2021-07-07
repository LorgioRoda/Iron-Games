const path = require("path");
const hbs = require("hbs");
const express = require("express");
const favicon = require("serve-favicon");

module.exports = (app) => {
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "hbs");
  app.use(express.static(path.join(__dirname, "..", "public")));
  hbs.registerPartials(path.join(__dirname, "..", "views/partials"));
};
