"use strict";

let express = require("express");

let mongoose = require("mongoose");

let util = require("util");

let bp = require("body-parser");

let app = express();

const PORT = process.env.NODE_PORT || 3000;

require("./db");

let Article = mongoose.model("Article");

app.use(bp.urlencoded({
	extended: true
}));

//Models

//Views

app.set("views", "./views");

app.set("view engine", "ejs");

app.engine("ejs", require("ejs-mate"));

//Conrollers

app.use("/", express.static("public"));

app.get("/", (req, res) => {

	res.render("index");

	//res.render("Hello!")



});

app.get("/articles/new", (req, res) => {
	res.render("newarticle");
});

app.post("/article/:id/edit", (req, res, next) => {

	Article.update({_id:req.params.id}, req.body).
	then(() => {
		return res.redirect("/article/" + req.params.id);
	}).
	catch(err => {
		return next(err);
	});
	
});

app.post("/articles/new", (req, res, next) => {
	let article = new Article(req.body);
	//console.log(article);
	article.save().
	then(savedArticle => {
		console.log(article);
		return res.redirect("/articles");
	}).
	catch(err => {
		return next(err);
	});
	
});



app.get("/articles", (req, res, next) => {

	Article.find().
	then(foundArticles => {
		res.locals.articles = foundArticles;
		return res.render("allarticles");
	}).
	catch(err => {
		return next(err);
	});
});

app.get("/article/:id/edit", (req, res) => {

	Article.findById(req.params.id).
	then(foundArticle => {
		if (!foundArticle) {
			var error = new Error("Article not found");
			error.code = 404;
			return Promise.reject(error);
		} else {
			res.locals.article = foundArticle;
			return res.render("editarticle");
		}
	}).
	catch(err => {
		return next(err);
	});

	

});

app.get("/article/:id", (req, res, next) => {
	Article.findById(req.params.id).
	then(foundArticle => {
		if (!foundArticle) {
			var error = new Error("Article not found");
			error.code = 404;
			return Promise.reject(error);
		} else {
			res.locals.article = foundArticle;
			return res.render("singlearticle");
		}
	}).
	catch(err => {
		return next(err);
	});
});

app.get("/articles/march10", (req, res, next) => {
	//return res.send("Good Evening, there's nothing here.");
	var newerr = new Error("There's nothing here either.");

	return next(newerr);
});

app.get("/article/:id/delete", (req, res, next) => {

	Article.findById(req.params.id).
	then(foundArticle => {
		if (!foundArticle) {
			var error = new Error("Article not found");
			error.code = 404;
			return Promise.reject(error);
		} else {
			return(foundArticle);
		}

	}).
	then(foundArticle => {

		return foundArticle.remove();


	}).
	then(() => {

		return res.redirect("/articles");

	}).
	catch(err => {
		return next(err);
	}) 

});




//Error Handlers

app.get("*", (req, res) => {
	res.status(404).render("404");
});

app.use((err, req, res, next) => {
	res.locals = {
		error: err.message
	};
	res.status(500).render("500");
	next();
});


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

