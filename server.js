// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.send("Hello world");
});

// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
app.get("/all", function (req, res) {
  db.scrapedData.find({}, function (error, found) {
    if (error) {
      console.log(error);
    } else {
      res.json(found);
    }
  });
});
// Ot
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)

// Route 2
// =======
// When you visit this route, the server will

// scrape data from the site of your choice, and save it to
app.get("/scrape", function (req, res) {

  // MongoDB.
  request("https://foxnews.com/", function (error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $("h2.title").each(function (i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children().text();
      var link = $(element).children().attr("href");


      // If this found element had both a title and a link
      if (title && link) {
        db.scrapedData.insert({
            title: title,
            link: link
          },
          function (err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            } else {


              // TIP: Think back to how you pushed website data
              // into an empty array in the last class. How do you
              // push it into a MongoDB collection instead?
              console.log(inserted);
            }
          });
      }
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});
/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});