const express = require("express");
const bodyParser = require("body-parser");
//require a custom module date.js
const date = require(__dirname+"/date.js");

const app = express();
let items = [];
let workItems = [];

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
//use whatever css and images in public folder
app.use(express.static("public"));
// ------------------------------------------//
app.listen(3000,function(){
  console.log("Server started on port 3000!");
});

app.get("/",function(req,res){
  //calling function from date.js
  let day = date.getDate();
  // if (currentDay=== 6 || 0){
  //   day = "weekend";
  //
  // }else{
  //   day = "weekday";
  // }

  // switch(currentDay){
  //   case 0:
  //     day="Sunday";
  //     break;
  //   case 1:
  //     day="Monday";
  //     break;
  //   case 2:
  //     day="Tuesday";
  //     break;
  //   case 3:
  //     day="Wednesday";
  //     break;
  //   case 4:
  //     day="Thursday";
  //     break;
  //   case 5:
  //     day="Friday";
  //     break;
  //   case 6:
  //     day="Saturday";
  //     break;
  //   default:
  //     break;
  // }

  res.render('list',{listTitle:day,newListItems:items});
});

app.post("/",function(req,res){
  let item = req.body.newItem;
  //this loop prevent the main page being rendered by padding
  //item to work page
  console.log(req.body);
  //this body.list property relate to the button
  //name and value in ejs file
  //use this to make a if else loop to make sure data
  //goes into right page
  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work")
  }else{
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work List",newListItems:workItems});
});
app.post("/work",function(req,res){
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work")
});
app.get("/about",function(req,res){
  res.render("about");
});
