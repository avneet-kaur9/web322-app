/*********************************************************************************

WEB322 – Assignment 03
I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part * of this assignment has
been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.
Name: Avneet Kaur
Student ID: 164275216
Date: 12/06/2023
Cyclic Web App URL: https://helpful-slip-ox.cyclic.app
GitHub Repository URL: https://github.com/Kirandeep247/web322-app.git

********************************************************************************/

const express = require("express"); //express module
const path = require("path");
const store = require("./store-service");
const app = express();
const PORT = process.env.PORT || 8080; //listening

app.use(express.static(__dirname + "/public"));

app.get("/", (r1, r2) => 
{
  r2.redirect("/about"); //retrieving content from about,html
});

app.get("/about", (r1, r2) => 
{
  r2.sendFile(__dirname + "/views/about.html"); //sending content a s a response
});

app.get("/shop", (r1, r2) =>  // for "/shop"
{
  store
    .getPublishedItems()
    .then((categories) => {
      r2.status(200).json(categories);
    })
    .catch((err) => {
      r2.status(500).json({ message: err });
    });
});

app.get("/items", (r1, r2) =>  // for "/items"
{
  store
    .getAllItemss()
    .then((items) => {
      r2.status(200).json(items);
    })
    .catch((err) => {
      r2.status(500).json({ message: err });
    });
});

app.get("/categories", (r1, r2) => // for "/categories"
{
  store
    .getCategories()
    .then((categories) => {
      r2.status(200).json(categories);
    })
    .catch((err) => {
      r2.status(500).json({ message: err });
    });
});

app.use((r1, r2) => // for "404"
{
  r2.status(404).send("Page Not Found");
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
