"use strict";

let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/alphablog");

mongoose.connection.on("connected", () => {
	console.log("successfully connected to database");
});

mongoose.connection.on("error", (err) => {
	console.log("failed to connect: " + err.message);
});

mongoose.Promise = global.Promise;

let articleSchema = new mongoose.Schema({
	title: String,
	body: String
});

mongoose.model("Article", articleSchema);