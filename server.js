const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const keys = require('./keys')
const Mask = require('./Mask')

mongoose.connect(keys.mongoUri,{ useNewUrlParser: true ,useUnifiedTopology: true})
mongoose.connection
    .once('open',() => console.log('db is running'))
    .on('error',(err)=>{
        console.log('warning' + err)
    })

mongoose.set('useFindAndModify', false);

app.use(bodyParser.json())

app.get('/fetch-masks',async (req,res) =>{
    const allMasks = await Mask.find({})
    console.log(allMasks)
    res.send(allMasks)
})

let arr = [];
Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
      }
  }
  return this;
};

app.post("/filter-masks", async (req, res) => {
    const {value} = req.body;
    console.log(value)
    if(arr.includes(value)){
      arr.remove(value)
      console.log(arr)
  } else{
    arr.push(value)
    console.log(arr)
  }
    const foundMask = await Mask.find(
      {type:arr}
  )
  
  console.log("foundMask:")
  console.log(foundMask)
  res.send(foundMask)
})

app.post("/remove-item-from-cart-db", async (req, res) => {
    const {id} = req.body;
    console.log(value)
    
    const foundMask = await Mask.findByIdAndUpdate(
      {_id:id},
      {$inc:{quantity: -1}}
  )
  
  console.log("foundMask:")
  console.log(foundMask)
  res.send(foundMask)
})

app.post("/change-limit-reached", async (req, res) => {
    const {id} = req.body;
    
    const foundMask = await Mask.findByIdAndUpdate(
      {_id:id},
      {$set:{limitReached: true}}
  )
})

app.post("/remove-item-from-inventory", async (req, res) => {
    const {id} = req.body.items;

    const foundMask = await Mask.findByIdAndUpdate(
        {_id:id},
        {$inc:{hitCount: 1}},
        {new:true}
    )

  
//   console.log("foundMask:")
//   console.log(foundMask)
//   res.send(foundMask)
})

app.listen(5000,() => console.log("app running on port 5000"))