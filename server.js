/*********************************************************************************

WEB322 – Assignment 04
I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part * of this assignment has
been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.
Name: Avneet Kaur
Student ID: 164275216
Date: 30/06/2023
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

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      navLink: function (url, options) {
        return (
          '<li class="nav-item"> <a ' +
          (app.locals.activeRoute === url
            ? 'class="nav-link active"'
            : 'class="nav-link"') +
          ' href="' +
          url +
          '" >' +
          options.fn(this) +
          "</a> </li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);
app.set("view engine", ".hbs");
app.set("views", __dirname + "/views");

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/shop", async (req, res) => {
  let viewData = {};

  try {
    let items = [];
    if (req.query.category) {
      items = await store.getPublishedItemsByCategory(req.query.category);
    } else {
      items = await  store.getPublishedItems();
    }
    items.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    let item = items[0];

    viewData.items = items;
    viewData.item = item;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    let categories = await  store.getCategories();

    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  res.render("shop", { data: viewData });
});

app.get("/shop/:id", async (req, res) => {
  let viewData = {};

  try {
    let items = [];
    if (req.query.category) {
      // Obtain the published "posts" by category
      items = await  store.getPublishedItemsByCategory(req.query.category);
    } else {
      items = await  store.getPublishedItems();
    }

    items.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    viewData.items = items;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the item by "id"
    viewData.item = await  store.getItemById(req.params.id);
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await  store.getCategories();

    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "shop" view with all of the data (viewData)
  res.render("shop", { data: viewData });
});

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
      res.render("items",{items});
    })
    .catch((err) => {
      res.render("items",{ message: err });
    });
});
app.get("/categories", (req, res) => {
  store
    .getCategories()
    .then((categories) => {
      res.status(200).render("categories",{categories});
    })
    .catch((err) => {
      res.status(500).render("categories",{ message: err });
    });
});
app.get("/items/add", (req, res) => {
  res.render("addItem");
});

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

app.use((req, res) => {
  res.status(404).render("404");
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
