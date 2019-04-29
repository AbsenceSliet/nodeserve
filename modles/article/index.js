"use strict"

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
    title: { type: String, default: '' },
    category_id: { type: Number, isRequired: true },
    desc: { type: String, default: '' },
    tags: { type: Array, default: [] },
    content: { type: String, default: '' },
    article_id: { type: Number },
    create_time: { type: String },
    update_time: { type: String }
})
ArticleSchema.index({ article_id: 1 })
const Article = mongoose.model('Article', ArticleSchema)
export default Article