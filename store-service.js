const fs = require("fs");
const path = require("path");

let items = [];
let categories = [];

function initialize() 
{
  return new Promise((resolve, reject) => 
  {
    const i_Path = path.join(__dirname, "data", "items.json");
    const categoriesFilePath = path.join(__dirname, "data", "categories.json");

    fs.readFile(i_Path, "utf8", (err, i_data) => {
      if (err) 
      {
        reject("Unable to read file");
      
        return;
      }

      items = JSON.parse(i_data);

      fs.readFile(categoriesFilePath, "utf8", (err, c_data) => 
      {
        if (err) 
        {
          reject("Unable to read file");
        
          return;
        }

        categories = JSON.parse(c_data);
        
        resolve();
      });
    });
  });
}

function getAllItemss() 
{
  return new Promise((resolve, reject) => 
  {
    if (items.length === 0) 
    {
      reject("No results returned");
    
      return;
    }
    
    resolve(items);
  });
}

function getPublishedItems() 
{
  return new Promise((resolve, reject) => 
  {
    const publishedItems = items.filter((item) => item.published === true);
  
    if (publishedItems.length === 0) 
    {
      reject("No results returned");
    
      return;
    }



    
    
    resolve(publishedItems);
  });
}

function getCategories() 
{
  return new Promise((resolve, reject) => 
  {
    if (categories.length === 0) 
    {
      reject("No results returned");
    
      return;
    }
    
    resolve(categories);
  });
}

const storeService = {
  initialize, getAllItemss, getPublishedItems, getCategories,
};

module.exports = storeService;
