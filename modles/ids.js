'use strict';
import mongoose from 'mongoose'

const idsSchema = new mongoose.Schema({
    admin_id: Number,
    img_id: Number,
    category_id: Number,
    article_id: Number
})

const Ids = mongoose.model('Ids', idsSchema)

Ids.findOne((err, data) => {
    if (!data) {
        const newIds = new Ids({
            admin_id: 0,
            img_id: 0,
            article_id: 0,
            category_id: 0
        })
        newIds.save()
    }
})
export default Ids;