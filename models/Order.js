
const mongoose = require('mongoose');
const {Schema} = mongoose;

const OrderSchema = new Schema({
title:[String],
price:[Number],
quantity:[Number]
})

module.exports = mongoose.model("order",OrderSchema)