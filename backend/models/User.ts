const {Schema, model} = require("mongoose");

const User = new Schema({
        id: {type: String, required: true},
        name: {type: String, required: true},
    }
);
module.exports = model('User', User);