const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    "username": "Ganesh",
    "password": "surve"
  }
];

const isValid = (username) => { //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];  // Retrieve book object associated with isbn

  if (book) {  // Check if book exists
    let review = req.body.review;
    let author = req.body.username;
    let isbn = req.body.isbn;

    // Update DOB if provided in request body
    if (review) {
      book["review"] = review;
    }
    if (author) {
      book["author"] = username;
    }
    if (isbn) {
      book["isbn"] = isbn;
    }
    books[isbn] = book;  // Update friend details in 'friends' object
    res.send(`Book with the Review ${review} updated.`);
  } else {
    // Respond if friend with specified email is not found
    res.send("Unable to find friend!");
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (isbn) {
    delete books[isbn];
  }
  res.send(`Book with the ISBN ${isbn} deleted`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
