const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: { type: String, unique: true },
    password: String,
    image: String
}, { timestamps: true });


const userdb = new mongoose.model("Users", userSchema);

module.exports = userdb;
