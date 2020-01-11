const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

//use whatever css and images in public folder
app.use(express.static("public"));

//this makes the app connect to Mongo atlas cloud server and store data there
mongoose.connect('mongodb+srv://yihan-chen:cyh890321@ian-personal-go5zs.mongodb.net/userDB', {useNewUrlParser: true,useUnifiedTopology:true});

var db = mongoose.connection;

//create a schema in mongoose to specify types for data
const itemsSchema = new mongoose.Schema({
    name:String
});

const Item = mongoose.model("item",itemsSchema);

const item1 = new Item({
  name:"Welcome to your todolist!"
});
// const item2 = new Item({
//   name:"Hit the + button to add a new item"
// });
// const item3 = new Item({
//   name:"<-- Hit this to delete an item"
// });
const defaultItems = [item1];

//create a new schema for custom homepage
const listSchema = {
  name:String,
  items:[itemsSchema]
}

const List = mongoose.model("List",listSchema);

// ------------------------------------------//
app.get("/",function(req,res){
  //check is default items are existed
  Item.find({},function(err,foundItems){
    //if database is empty, insert defaultItems
    if (foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
        if(err){
              console.log(err);
        }else{
              console.log('Successfully inserted data');
        }
      });
      res.redirect("/");
    }else{
      res.render('list',{listTitle:"Today",newListItems:foundItems});
    }
  });
});
//ejs params
app.get("/:customListName",function(req,res){
  //use lodash to make capitalized custom list name
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name:customListName},function(err,foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name:customListName,
          items:defaultItems
        });
        //save created new obect to list collection
        list.save();
        //redirect to the corresponding page so it shows immediately
        res.redirect("/"+customListName)
      }else{
          //show an existing list
          res.render("list",{listTitle:foundList.name,newListItems:foundList.items})

        }
      }
  });
});
app.post("/",function(req,res){
  //get itemName from list.ejs file
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });

  if(listName === 'Today'){
    item.save();
    res.redirect("/");
  }else{
      List.findOne({name:listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect('/'+listName);
    });
  }
});
app.post("/delete",function(req,res){
  //get checkbox value
  const checkItemId = req.body.checkbox
  const listName = req.body.listName;
  //use a if loop to check which list is being modified
  if(listName === "Today"){
    //if checkbox is clicked then check box Id is passed from list.ejs to app.js
    Item.findByIdAndRemove(checkItemId,function(err){
      if(!err){
        console.log("succefully deleted checked item");
        //redirect to homepage after delete so the deletion will be appeared
        res.redirect("/")
      }
    });
  }else{
    //pull from items array which has a _id of checkedItemId and update it
    //$pull from mongodb can remove a object
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkItemId}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listName)
      }
    });
  }
});

app.listen(3000,function(){
  console.log("Server started on port 3000!");
});
