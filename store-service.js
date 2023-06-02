const fs = require("fs");
const path = require("path");

let items = [];
let categories = [];

function initialize() {
  return new Promise((resolve, reject) => {
    const itemsFilePath = path.join(__dirname, "data", "items.json");
    const categoriesFilePath = path.join(__dirname, "data", "categories.json");

    fs.readFile(itemsFilePath, "utf8", (err, itemsData) => {
      if (err) {
        reject("Unable to read file");
        return;
      }

      items = JSON.parse(itemsData);

      fs.readFile(categoriesFilePath, "utf8", (err, categoriesData) => {
        if (err) {
          reject("Unable to read file");
          return;
        }

        categories = JSON.parse(categoriesData);
        resolve();
      });
    });
  });
}

function getAllItems() {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject("No results returned");
      return;
    }
    resolve(items);
  });
}

function getPublishedItems() {
  return new Promise((resolve, reject) => {
    const publishedItems = items.filter((item) => item.published === true);
    if (publishedItems.length === 0) {
      reject("No results returned");
      return;
    }
    resolve(publishedItems);
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject("No results returned");
      return;
    }
    resolve(categories);
  });
}

const storeService = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
};

module.exports = storeService;
