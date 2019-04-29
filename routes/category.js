'use strict';

import express from 'express';
import Category from '../controller/category'
const router = express.Router()

router.post('/create', Category.createCate)

router.get('/categorylist', Category.categoryList)

export default router