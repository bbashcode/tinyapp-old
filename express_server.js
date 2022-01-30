//all the imports
const express = require("express");
const app = express();
const PORT = 8080; //default port
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//setting up the packages to be used in the server file.
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


//hardcoded database for now
let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//homepage route
app.get("/", (req, res) =>{
  res.send("Welcome to the TinyApp Universe!");

});

//setting up GET route to render the urls_new.ejs template
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


//setting up another route and adding template
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  app.get('/u/:shortURL', (req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    res.redirect(longURL);
  }); 
});

app.get("/urls", (req, res) => {

  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  console.log(`Template Variable: `,templateVars);
  res.render("urls_index", templateVars);
});

//route for creating new urls
app.post("/create-urls", (req, res) => {
  const {longURL} = req.body;
  const shortURL = generateRandomString();
  const urlObject = {[shortURL]: longURL};
  urlDatabase = {...urlDatabase, [shortURL]: longURL};

  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  console.log(`Template Variable: `,templateVars);
  res.render("urls_index", templateVars);
});

// Login handling route
app.post("/login", (req, res) => {
 const email = req.body.email;
 const password = req.body.password;
 const username = req.body.username;
 
 if(username){
   res.cookie("username", username);
   res.redirect("/urls");
 }
})

// Logout handling route
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls")
 })

// for delete button
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})


//for edit button
app.get("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.params.updatedURL;
  res.redirect(`/urls/${shortURL}`);
})

app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  const updatedURL = req.body.updatedURL;
  urlDatabase[shortURL] = updatedURL;
  res.redirect('/urls');
});

//for registration template
app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    email: "james@bond.com"
  };
  res.render("register.ejs", templateVars);
})
//for registration template
// app.post("/register", (req, res) => {
//   const templateVars = {
//     username: req.cookies["username"],
//     email: "james@bond.com"
//   };
//   res.render("register.ejs", templateVars);
// })


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


//function to generate 6 character long unique renadom string
function generateRandomString() {
  let length = 6;
  let shortURL = "";
  
  const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(let i = 0; i < length; i++){
    let randomIndex = Math.floor(Math.random() * alphaNumeric.length);
    shortURL += alphaNumeric.substring(randomIndex, randomIndex + 1)
  }

  return shortURL;
}