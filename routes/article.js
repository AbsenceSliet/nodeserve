'use strict';

import express from 'express';
import Article from '../controller/article'
const router = express.Router()

router.post('/create', Article.createArticle)
router.get('/articlelist', Article.articleList)

export default router