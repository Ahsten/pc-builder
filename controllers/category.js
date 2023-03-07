const Category = require("../models/category")
const Part = require("../models/part")
const async = require("async")
const {body, validationResult } = require("express-validator")

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

exports.part_create_get = (req, res, next) => {
    Category.find()
        .exec(function (err, category_list){
            if(err) {
                return next(err)
            }

            res.render('part_form', {title: "Create Part", categories: category_list})
        })
}

exports.part_create_post = [
    body("name", "Name must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "Price must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("stock", "Stock must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description").escape(),

    (req, res, next) => {
        const errors = validationResult(req)
        console.log(errors)

        const part = new Part({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock
        })

        if(!errors.isEmpty()){
            
            Category.find()
            .exec(function (err, list_categories) {
                if(err){
                    return next(err)
                }
    
                res.render('part_form', {
                    title: "Create Part",
                    categories: list_categories,
                    part,
                    errors: errors.array(),
                })
            })
            return
        }

        part.save((err) => {
            if(err) {
                return next(err)
            }

            res.redirect(part.url)
        })
    }
]