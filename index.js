const express = require("express");
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./models/chat.js");
const ExpressError = require("./ExpressError.js");

// Set EJS as templating engine
app.set("views", path.join (__dirname, "views"));
app.set("view engine", "ejs");

//Add css file
app.use (express.static (path.join (__dirname, "public")));

// create a post request parser
app.use (express.urlencoded ({ extended: true}));

//updsate method override
const methodOverride = require ("method-override");
app.use (methodOverride ("_method"));



main()
.then(() => {
  console.log("Connection Sucessfull")
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
};


app.get('/', (req, res) => {
  res.send('Sucessfully working')
});




//Index Route
app.get('/chats', async (req, res,next) => {
  try{
     let chats = await Chat.find();
   res.render ("index.ejs", {chats});
  }catch(err){
    next(err)
  }
});


// New Chat Route
app.get('/chats/new', (req, res) => {
  // throw new ExpressError(404,"Page Not Found");
 res.render("new.ejs");
});



//create Chat Route
app.post("/chats" , asyncWrap( async (req,res,next) => {

    let {from , to , msg } = req.body;
    let newChat = new Chat({
      from: from,
      to:to,
      msg:msg,
      create_at:new Date(),
    });
    await newChat.save();
    res.redirect("/chats");
})
);
  

//for code Error (asyncWrap)
function asyncWrap(fn){
  return function(req,res,next){
    fn(req,res,next).catch(err =>next(err));
  };
}




//  New Show route-- IMP for Error
app.get("/chats/:id" ,  asyncWrap( async (req,res, next) => {
  
      let {id} = req.params;
  let chat = await Chat.findById(id);

  // for use for mistack the chat Id
  if(!chat){
    next( new ExpressError(404,"Chat not found"));
  }
  res.render("edit.ejs" , {chat});

 

}));



//edit chat route
app.get("/chats/:id/edit", async (req, res ,next) => {
try{
   let {id} = req.params;
   let chat = await Chat.findById(id);
  res.render("edit.ejs" , {chat});
} catch(err){
  next(err)
}});



 //update chat route
app.put("/chats/:id", asyncWrap(async (req, res,next) => {

     let {id} = req.params;
  let { msg: newMsg} = req.body;
  console.log(newMsg);
  
  //update the chat msg
  let updatedChat = await Chat.findByIdAndUpdate(id , {msg : newMsg}, {runvalidators:true , new:true}
  );
  console.log(updatedChat);
  res.redirect('/chats');
}));


//Delete chat route
app.delete("/chats/:id", asyncWrap(async  (req, res,next) => {

     let {id} = req.params;
  let Deleted = await Chat.findByIdAndDelete(id);
  console.log("Deleted Chat: " , Deleted);
  res.redirect('/chats');
}));


//Error handling middlaware
app.use((err , req , res , next) => {
  let {status = 500 , message="Some Error Occured"} = err;
  res.status(status).send(message);
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})



