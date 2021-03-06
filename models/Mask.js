const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MaskSchema = Schema({
    title:String,
    description:String,
    type:String,
    url:String,
    quantity:Number,
    price:Number,
    limitReached:{
        type:String,
        default:false
    }
})

module.exports = mongoose.model("mask",MaskSchema)