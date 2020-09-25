const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const keys = require('./keys')
const Mask = require('./models/Mask')
const Checkout = require('./models/Checkout')
const stripe = require('stripe')(process.env.SECRET_KEY);
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
require('dotenv').config()

let mongoUri;

if (process.env.mongoUri == 'production'){
  mongoUri = process.env.mongoUri
} else{
  mongoUri = keys.mongoUri
}

mongoose.connect(mongoUri,{ useNewUrlParser: true ,useUnifiedTopology: true})
mongoose.connection
    .once('open',() => console.log('db is running'))
    .on('error',(err)=>{
        console.log('warning' + err)
    })

mongoose.set('useFindAndModify', false);

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(bodyParser.json())

//////////// public key /////////////

app.get("/public-key", (req, res) => {
  res.send({ publicKey: process.env.PUBLISHABLE_KEY });
});

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

//////////// filter masks /////////////

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

//////////// remove item from cart db /////////////

// app.post("/remove-item-from-cart-db", async (req, res) => {
//     const {id} = req.body;
//     console.log(value)
    
//     const foundMask = await Mask.findByIdAndUpdate(
//       {_id:id},
//       {$inc:{quantity: -1}}
//   )
  
//   console.log("foundMask:")
//   console.log(foundMask)
//   res.send(foundMask)
// })

//////////// change limit reached /////////////

app.post("/change-limit-reached", async (req, res) => {
    const {id} = req.body;
    
    const foundMask = await Mask.findByIdAndUpdate(
      {_id:id},
      {$set:{limitReached: true}}
  )
})

//////////// payment /////////////

app.post('/payment', (req, res) => {
  const body = {
    source: req.body.token.id,
    amount: req.body.amount,
    currency: 'usd'
  };
console.log("body:")
console.log(body)
  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      res.status(500).send({ error: stripeErr });
    } else {
      res.status(200).send({ success: stripeRes });
    }
  });
});

//////////// create payment intent /////////////

app.post("/create-payment-intent", async (req, res) => {
  console.log(req.body)
  const {actualName,address,city,province,postal_code,cartTotal,price,currency} = req.body;
console.log("cartTotal:")
console.log(cartTotal)
  const options = {
      amount:price*100,
      currency
  }

  console.log("options:")
  console.log(options)
  try {
    const paymentIntent = await stripe.paymentIntents.create(options);
    console.log("paymentIntent");
    console.log(paymentIntent);
    res.json(paymentIntent);
  } catch (err) {
    console.log("err");
    console.log(err);
    res.json(err);
  }
});

//////////// create order /////////////

app.post('/create-order',async (req,res)=>{
  const {username,actualName,lastName,address,city,province,postal_code,cartTotal,email,price,currency} = req.body;
  
  JSON.stringify(cartTotal)

  const makeid = length => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  let confirmationCode = makeid(8)

const newCheckout = await new Checkout()
newCheckout.order = cartTotal;
newCheckout.firstName = actualName;
newCheckout.lastName = lastName;
newCheckout.address = address;
newCheckout.city = city;
newCheckout.state = province;
newCheckout.zipCode = postal_code;
newCheckout.email = email;
newCheckout.confirmation = confirmationCode;

newCheckout.save()
    // .then(order =>{
    //     return order.sendSmsNotification(
    //       `${actualName} ${lastName} bought a mask!
    //         Address is ${address},${city},${province} ${postal_code}
    //       `, ()=>console.log("something went wrong"))
    // })

const totalPrice = items =>{
  console.log("total Price items")
  console.log(items)
  let price = items.reduce((acc,item) => acc + item.quantity * item.price,0);
  return price.toFixed(2);
}

  const msg = {
      // to: ['drewwperez@gmail.com',email],
      to: 'drewwperez@gmail.com',
      from: 'drewwperez@gmail.com', // Use the email address or domain you verified above
      subject: 'Thank you for your order!',
      html:`<html>
      <body>
          <div style="width: 100%;">
                  <p style="font-size:2em;font-weight:bold; text-align:center;">Thank you for your order!</p>
                  <p style="text-align: center;">
                      We have processed your order and will ship it to you shortly.
                      You will receive another email from us with tracking information when your mask(s) are shipped.
                      In the meantime if you have any questions or concerns regarding your purchase, please contact
                      Liliana Alvarez at
                  </p>
                  <div style="background-color: tan; display:flex; flex-direction:row;">
                  <div style="width: 25%; justify-content:space-between;"></div>
                      <div style="width: 20%; display:flex;flex-direction:column; justify-content:space-between;">
                          Date: 8/21/2020<br/>
                          Order Number: ${confirmationCode}<br/>
                      </div>
                      <div style="width: 40%; display:flex; flex-direction:column; justify-content:space-between;margin:0 0 0 4%">
                          Shipping To:<br/>
                          ${actualName} ${lastName}<br/>
                          ${address}<br/>
                          ${city}, ${province} ${postal_code}<br/>
                      </div>
                    <div style="width: 15%; justify-content:space-between;"></div>
                  </div>

              <div style="width: 100%; display:flex; justify-content:space-between;">
                <div style="width: 15%;"></div>
                  <div style="width: 50%;">
                    <table>
                      <tr>
                          <th style="padding: 25px;">Item</th>
                          <th style="padding: 25px;">Price</th>
                          <th style="padding: 25px;">Quantity</th>
                          <th style="padding: 25px;">Image</th>
                          <th></th>
                      </tr>
                      ${cartTotal.map(item =>{
                              return `<tr>
                                        <td style="text-align:center">${item.title}</td>
                                        <td style="text-align:center">${item.price}</td>
                                        <td style="text-align:center">${item.quantity}</td>
                                        <td><img style="height:75px;width:75px;" src="${item.url}" /></td><br/><br/>
                                      </tr>
                                      <tr>
                                        <td style="text-align:center">Shipping</td>
                                        <td style="text-align:center">$5</td>
                                      </tr>
                                      `
                          }).join('')}
                          <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>Total:${parseFloat(totalPrice(cartTotal)) + 5}</td>
                          </tr>
                      </table>
                  </div>
                <div style="width: 35%;"></div>
              </div>
          </div>
      </body>
  </html>`
    };
    
    cartTotal.map(async item =>{
      const foundMask = await Mask.findByIdAndUpdate(
          {_id:item.id},
          {$inc:{quantity: -item.quantity}},
          {new:true}
      )
    })

    try {
        // send multiple individual emails to multiple recipients 
        // where they don't see each other's email addresses
        console.log("sending mail")
        // await sgMail.sendMultiple(msg);
        await sgMail.send(msg);
      } catch (error) {
        console.error(error);
    
        if (error.response) {
          console.error("error.response.body:")
          console.error(error.response.body)
        }
      }

      res.send(confirmationCode)
  })

if(process.env.NODE_ENV == 'production'){
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*',(req,res) =>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

  const PORT = process.env.PORT || 5000

app.listen(PORT,() => console.log("app running on port 5000"))