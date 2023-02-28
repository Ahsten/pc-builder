#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async')
var Part = require('./models/part')
var Category = require('./models/category')



const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

var parts = []
var categories = []

function partCreate(name, description, category, price, stock, cb) {
  partdetail = { 
    name: name,
    description: description,
    category: category,
    price: price,
    stock: stock
  }
    
  var part = new Part(partdetail);    
  part.save(function (err) {
    if (err) {
      console.log(err)
      cb(err, null)
      return
    }
    console.log('New Part: ' + part);
    parts.push(part)
    cb(null, part)
  }  );
}


function categoryCreate(name, description, cb) {
  categorydetail = { 
    name: name,
    description: description
  }
    
  var category = new Category(categorydetail);    
  category.save(function (err) {
    if (err) {
      console.log('ERROR CREATING category: ' + category);
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}





function createCategories(cb) {
    async.parallel([
        function(callback) {
          categoryCreate('CPU', "Central Processing Units", callback);
        },
        function(callback) {
          categoryCreate("Motherboard", "Circut board", callback);
        },
        function(callback) {
          categoryCreate("Memory", "Computers short term memory", callback);
        },
        function(callback) {
          categoryCreate("Storage", "stores documents, pictures, etc...", callback);
        },
        function(callback) {
          categoryCreate("GPU", "Video card", callback);
        },
        function(callback) {
          categoryCreate("Case","Computer case", callback);
        },
        function(callback) {
          categoryCreate("Power Supply", "Powers all components", callback)
        },
        ],
        // optional callback
        cb);
}


function createParts(cb) {
    async.parallel([
        function(callback) {
          partCreate("Intel i9-13900k", '24 core processor', categories[0], 559.99, 3, callback)
        },
        function(callback) {
          partCreate("MSI B550-A PRO", 'ATX form factor', categories[1], 139.99, 1, callback)
        },
        function(callback) {
          partCreate("G.Skill Trident Z5 RGB", '32GB', categories[2], 99.99, 4, callback)
        },
        function(callback) {
          partCreate("Samsung 990 pro", '2 TB', categories[3], 49.99, 4, callback)
        },
        function(callback) {
          partCreate("NVIDIA Founders Edition", 'GeForce RTX 4090', categories[4], 1200.00, 3,  callback)
        },
        function(callback) {
          partCreate("NZXT H5 Flow", 'ATX Mid Tower', categories[5], 94.99, 2, callback)
        },
        function(callback) {
          partCreate("Corsair RM850", '850W', categories[6], 105.99, 5, callback)
        },
        ],
        // Optional callback
        cb);
}



async.series([
    createCategories,
    createParts
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Categories: '+categories);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




