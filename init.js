const mongoose = require('mongoose');
const Chat = require("./models/chat.js");

main()
.then(() => {
  console.log("Connection Sucessfull")
})
.catch(err => console.log(err));

async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

let Allchats = [ 
    {
      from: "neha",
      to: "preeti",
      msg: "send me your notes",
      create_at: new Date()
    },
    {
      from: "rohit",
      to: "mohit",
      msg: "teach me js callbacks",
      create_at: new Date()
    },
    {
      from: "anita",
      to: "ramesh",
      msg: "bring me some fruits",
      create_at: new Date()
    },
    {
      from: "Tony",
      to: "peter",
      msg: "love you 3000",
      create_at: new Date()
    }
  ];

    Chat.insertMany(Allchats)


