const mongoose = require('mongoose');
const OrderSchema = require('./Order').schema;
const twilio = require('twilio');
require('dotenv').config()
const {Schema} = mongoose;

const CheckoutSchema = new Schema({
    order:[OrderSchema],
    firstName:String,
    lastName:String,
    address:String,
    city:String,
    state:String,
    zipCode:String,
    email:String,
    confirmation:String,
    createdDate:{
        type:Date,
        default:Date.now
      }
})

CheckoutSchema.methods.sendSmsNotification = function(message, statusCallback) {
  if (!statusCallback) {
    throw new Error('status callback is required to send notification.');
  }

  const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
  const self = this;
  const options = {
    to: 13104286197,
    from: process.env.MY_PHONE_NUMBER,
    body: message,
    statusCallback: statusCallback,
  };

  return client.messages.create(options)
    .then((message) => {
      console.log('Message sent to ' + message.to);
    });
};

module.exports = mongoose.model("checkout",CheckoutSchema)