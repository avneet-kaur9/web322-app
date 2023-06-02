/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic 
Policy.  No part *  of this assignment has been copied manually or electronically 
from any other source (including 3rd party web sites) or distributed to other 
students.

Name: Avneet Kaur
Student ID: 164275216
Date: 02/06/2023
Cyclic Web App URL: https://dull-red-haddock-hat.cyclic.app
I don't why my cyclic link is not working but you can check my work on github,
I left it public.
GitHub Repository URL: https://github.com/avneet-kaur9/web322-app

********************************************************************************/
const express = require("express");
const path = require("path");
const store = require("./store-service");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

// GET route for "/shop"
app.get("/shop", (req, res) => {
  store
    .getPublishedItems()
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// GET route for "/items"
app.get("/items", (req, res) => {
  store
    .getAllItems()
    .then((items) => {
      res.status(200).json(items);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// GET route for "/categories"
app.get("/categories", (req, res) => {
  store
    .getCategories()
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// 404 route handler
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

store
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Express http server listening on: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
