'use strict';

import express from 'express';
import Article from '../controller/article'
const router = express.Router()

router.post('/create', Article.createArticle)
router.post('/update', Article.updateArticle)
router.get('/articlelist', Article.articleList)
router.get('/getarticledeatil/:article_id', Article.getArticleDeatil)
router.get('/delete/:article_id', Article.deleteArticle)
router.get('/articlecount', Article.getArticleCount)



export default router