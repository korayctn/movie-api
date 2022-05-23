const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const directorSchema = new Schema({
    name:{
        type:String,
        maxlength:[10,'{PATH} cannot be more than 10,so change {VALUE}'],
        minlength:[2,'{PATH} cannot be less than 2, so change {VALUE}'],
    },
    surname:String,
    bio:String,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('director',directorSchema);
