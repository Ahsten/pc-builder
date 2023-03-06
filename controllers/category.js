const Category = require("../models/category")
const Part = require("../models/part")
const async = require("async")

//Display a list of Categories
exports.category_list = (req, res, next) => {
    Category.find()
        .exec(function (err, list_categories) {
            if(err){
                return next(err)
            }

            res.render('categories', {categories: list_categories})
        })
}

exports.part_list = (req, res, next) => {
    async.parallel(
        {
            category(callback){
                Category.findById(req.params.id).exec(callback)
            },

            category_parts(callback){
                Part.find({category: req.params.id}).exec(callback)
            }
        },
        (err, results) => {
            if (err) {
              return next(err);
            }

            if (results.category == null) {
              // No results.
              const err = new Error("Category not found");
              err.status = 404;
              return next(err);
            }

        res.render("category_parts", {
            title: "Parts",
            category: results.category,
            category_parts: results.category_parts
        })}
    )
}

exports.part_detail = (req, res, next) => {
    Part.findById(req.params.id)
        .exec(function(err, part_detail){
            if(err){
                return next(err)
            }

            res.render('part_detail', {part: part_detail})
        })
}