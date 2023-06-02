
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const store = require("./store-service");
const path = require("path");
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

app.use(express.static(__dirname + "/public"));

//redirect user to /about route
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

app.use((req, res) => {
  res.status(404).send("Page Not Found!");
});

