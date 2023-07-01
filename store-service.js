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

function addItem(itemData) {
  return new Promise((resolve, reject) => {
    itemData.published = itemData.published || false;

    itemData.id = items.length + 1;
    const date = new Date();
    // YYYY-MM-DD
    const postDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}`;
    itemData.postDate = postDate;
    items.push(itemData);

    resolve(itemData);
  });
}

function getItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    const itemsByCategory = items.filter((item) => item.category == category);
    if (itemsByCategory.length === 0) {
      reject("No results returned");
    } else {
      resolve(itemsByCategory);
    }
  });
}

function getItemsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const itemsByMinDate = items.filter(
      (item) => new Date(item.postDate) >= new Date(minDateStr)
    );
    if (itemsByMinDate.length === 0) {
      reject("No results returned");
    } else {
      resolve(itemsByMinDate);
    }
  });
}

function getItemById(id) {
  return new Promise((resolve, reject) => {
    const item = items.find((item) => item.id == id);
    if (item) {
      resolve(item);
    } else {
      reject("No result returned");
    }
  });
}

function getPublishedItemsByCategory (category) {
  return new Promise((resolve, reject) => {
    if (!items || items.length === 0) {
      reject("no results returned");
    } else {
      const publishedItemsByCategory = items.filter(
        (item) => item.published === true && item.category == category
      );
      if (publishedItemsByCategory.length === 0) {
        reject("no results returned");
      } else {
        resolve(publishedItemsByCategory);
      }
    }
  });
};

const storeService = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
  addItem,
  getItemsByCategory,
  getItemsByMinDate,
  getItemById,
  getPublishedItemsByCategory
};

module.exports = storeService;
