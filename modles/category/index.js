"use strict"

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const categorySchema = new Schema({
    category_id: { type: Number },
    name: { type: String },
    level: { type: Number, default: 0 },
    visual: { type: Number, default: 1 }
})
const Category = mongoose.model('Category', categorySchema)
export default Category