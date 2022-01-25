const express = require("express");
const app = express();
const PORT = 8080; //default port
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) =>{
  res.send("Hello");
});

//setting up GET route to render the urls_new.ejs template
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


//adding a new route for /urls
app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});



//setting up another route and adding template
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  app.get('/u/:shortURL', (req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    res.redirect(longURL);
  }); 
});

app.post("/urls", (req, res) => {
  const {longURL} = req.body;
  const shortURL = generateRandomString();
  const urlObject = {[shortURL]: longURL};
  // console.log("longURL : ",longURL,"shortURL: ", shortURL, "url Object", urlObject);  // Log the POST request body to the console
  urlDatabase = {...urlDatabase, [shortURL]: longURL};
  console.log(urlDatabase);
  const templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);        // Respond with 'Ok' (we will replace this)
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

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