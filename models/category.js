const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    name: { 
        type: String, 
        required: true,
        enum: ["CPU", "Motherboard", "Memory", "Storage", "GPU", "Case", "Power Supply"]
    },
    description: { type: String}
})

CategorySchema.virtual("url").get(function(){
    return `/categories/category/${this._id}`
})

module.exports = mongoose.model("Category", CategorySchema)