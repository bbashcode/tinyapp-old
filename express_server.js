//all the imports
const express = require("express");
const app = express();
const PORT = 8080; //default port
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//setting up the packages to be used in the server file.
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//users is a global object which is used to store and access the users in the app
let users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

//hardcoded database for now
let urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

//homepage route
app.get("/", (req, res) => {
  res.send("Welcome to the TinyApp Universe!");
});

//setting up GET route to render the urls_new.ejs template
app.get("/urls/new", (req, res) => {
  const templateVars = {
    ...users,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//setting up another route and adding template
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  app.get("/u/:shortURL", (req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    res.redirect(longURL);
  });
});

app.get("/urls", (req, res) => {
  const templateVars = {
    ...users,
    urls: urlDatabase,
  };
  // console.log(`Template Variable: `,templateVars);
  res.render("urls_index", templateVars);
});

//route for creating new urls
app.post("/create-urls", (req, res) => {
  const { longURL } = req.body;
  const shortURL = generateRandomString();
  const urlObject = { [shortURL]: longURL };
  urlDatabase = { ...urlDatabase, [shortURL]: longURL };

  const templateVars = {
    ...users,
    urls: urlDatabase,
  };
  // console.log(`Template Variable: `,templateVars);
  res.render("urls_index", templateVars);
});

// for delete button
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//for edit button
app.get("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.params.updatedURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  const updatedURL = req.body.updatedURL;
  urlDatabase[shortURL] = updatedURL;
  res.redirect("/urls");
});

//for registration template
app.get("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const templateVars = {
    email,
    password,
  };
  res.render("register.ejs", templateVars);
  res.end();
});

// registration endpoint for handling registration data
app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Email/Password cannot be empty!");
    res.end();
  } else if (checkUsersObject(req.body.email)) {
    res.status(400).send("This email already exists!");
  } else {
    const newUserID = generateRandomString();
    users[newUserID] = {
      userID: newUserID,
      email: req.body.email,
      password: req.body.password,
    };
    res.cookie("user_id", newUserID);
    res.redirect("/urls");
  }
});

// feature (login) - login handling route
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// feature (login) - Update the Login Handler
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log("Case 0 -------");

  if (!checkUsersObject(email)) {
    // console.log("Case 1-------");
    res.status(403).send("Email cannot be found!");
    res.end();
  } else if (!(password === users[key].password)) {
    // console.log("Case 2-------");
    res.status(403).send("Sorry, password did not match!");
    res.end();
  } else {
    // console.log("Case 3-------");
    // console.log("users[key].id : ",users[key].id);
    res.cookie("user_id", users[key].id);
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

//function to look up user object using the cookie value

function checkUsersObject(email) {
  for (let key in users) {
    if (users[key].email === email) {
      return users[key].id;
    } else {
      return null;
    }
  }
  return null;
}

//function to generate 6 character long unique renadom string
function generateRandomString() {
  let length = 6;
  let shortURL = "";

  const alphaNumeric =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * alphaNumeric.length);
    shortURL += alphaNumeric.substring(randomIndex, randomIndex + 1);
  }

  return shortURL;
}
