//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app =  express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const emailLetter = req.body.newsEmail;

  const data = {
    members: [
      {
        email_address: emailLetter,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);


  const Url = "https://us21.api.mailchimp.com/3.0/lists/e04fb8a247";
  const options = {
    method: "POST",
    auth: "SouraOP:e9b9cbd26a592421a8711177e78f4e78-us21"
  }

  const request1 = https.request(Url, options, function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");   //if successfully subscribed
    } else {
      res.sendFile(__dirname + '/fail.html');    //if fails
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })
  //make our request
  request1.write(jsonData);
  request1.end();

  console.log(firstName, lastName, emailLetter);
});

//if fails redirect to homepage
app.post("/fail", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server running on port 3000");
});


//API Key
// e9b9cbd26a592421a8711177e78f4e78-us21

//List ID
// e04fb8a247


