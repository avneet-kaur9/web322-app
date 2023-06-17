/*********************************************************************************

WEB322 – Assignment 03
I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part * of this assignment has
been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.
Name: Avneet Kaur
Student ID: 164275216
Date: 12/06/2023
Cyclic Web App URL: https://rich-plum-bull-coat.cyclic.app/
GitHub Repository URL: https://github.com/avneet-kaur9/web322-app.git

********************************************************************************/
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const store = require("./store-service");

const app = express();
const PORT = process.env.PORT || 8080;

// configure cloudinary
cloudinary.config({
  cloud_name: "dixrvpqpe",
  api_key: "311594855559177",
  api_secret: "r_7xWtleyeog_BmZxNJRQoYeifQ",
  secure: true,
});

const upload = multer();

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
  const { category, minDate } = req.query;
  let promise;

  if (category) {
    promise = store.getItemsByCategory(category);
  } else if (minDate) {
    promise = store.getItemsByMinDate(minDate);
  } else {
    promise = store.getAllItems();
  }

  promise
    .then((items) => {
      res.json(items);
    })
    .catch((err) => {
      res.json({ message: err });
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

// show add items form
app.get("/items/add", (req, res) => {
  res.sendFile(__dirname + "/views/addItem.html");
});

// submitting add item form
app.post("/items/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processItem(uploaded.url);
    });
  } else {
    processItem("");
  }

  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;

    store
      .addItem(req.body)
      .then(() => {
        res.redirect("/items");
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
});

app.get("/item/:value", (req, res) => {
  store
    .getItemById(req.params.value)
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      res.json({ message: err });
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
