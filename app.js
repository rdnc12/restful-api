//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const articleSchema = { title: String, content: String };
const Article = mongoose.model("Article", articleSchema);


////////////// general
app.route("/articles")

    .get((req, res) => {

        Article.find((err, foundArticles) => {
            if (!err)
                res.send(foundArticles);
            else
                res.send(err);
        });
    })

    .post((req, res) => {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (!err)
                res.send("Success!!!");
        });
    })

    .delete((req, res) => {

        Article.deleteMany((err) => {
            if (!err)
                res.send("success");
            else
                res.send(err);
        });
    });


///////////////////////////
app.route("/articles/:articleTitle")

    .get((req, res) => {

        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle)
                res.send(foundArticle);
            else
                res.send('no title');

        });

    })
    .put((req, res) => {
        Article.update(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            (err) => {
                if (!err)
                    res.send("Success!!!!!!!!");
            }
        );
    })
    .patch((req, res) => {
        Article.update(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (!err)
                    res.send("successssss");
                else
                    res.send(err);
            }
        );
    })
    .delete((req,res)=>{
        Article.deleteOne(
            {title:req.params.articleTitle},
            (err)=>{
                if(!err)
                res.send("successs....");
                else
                res.send(err);
            }
        );
    });

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server has started.");
});