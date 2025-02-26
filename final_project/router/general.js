const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  JSON.stringify(users, null, 4)
  return res.status(300).json({ message: "List of Users" });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.books.isbn;
  res.send(books[isbn]);
  return res.status(300).json({ message: "Book With ISBN" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksData = Object.keys(books);
  const authorBooks = booksData.length > 0 ?
    booksData.filter(item => books[item].author === author) : [];

  if (authorBooks.length > 0) {
    res.send(JSON.stringify(authorBooks, null, 4))
  } else {
    res.send("Unable to find Books with author");
  }
  return res.status(300).json({ message: "Book with Author process is completed" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksData = Object.keys(books);
  const bookResult = booksData.length > 0 ?
    booksData.filter(item => books[item].title === title) : [];

  if (bookResult.length > 0) {
    res.send(JSON.stringify(bookResult, null, 4))
  } else {
    res.send("Unable to find Books with Title");
  }
  return res.status(300).json({ message: "Book with Title process is completed" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const booksData = Object.keys(books);
  const bookResult = booksData.length > 0 ?
    booksData.filter(item => books[item].isbn === isbn) : [];

  if (bookResult.length > 0) {
    res.send(JSON.stringify(bookResult, null, 4))
  } else {
    res.send("Unable to find Books Review  with ISBN");
  }
  return res.status(300).json({ message: "Book Review with ISBN process is completed" });
});

module.exports.general = public_users;
