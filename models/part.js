const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PartSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
})

PartSchema.virtual("url").get(function(){
    return `/categories/part/${this._id}`
})

module.exports = mongoose.model("Part", PartSchema)