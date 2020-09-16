const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MaskSchema = Schema({
    title:String,
    description:String,
    type:String,
    url:String,
    quantity:String,
    limitReached:{
        type:String,
        default:false
    },
    hitCount:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model("mask",MaskSchema)