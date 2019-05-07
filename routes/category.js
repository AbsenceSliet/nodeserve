'use strict';

import express from 'express';
import Category from '../controller/category'
const router = express.Router()

router.post('/create', Category.createCate)

router.get('/categorylist', Category.categoryList)
router.post('/update', Category.updateCategory)
router.get('/delete/:category_id', Category.deleteCategory)

export default router