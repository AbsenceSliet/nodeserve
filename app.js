'use strict'

import express from 'express'
import routes from './routes/index.js'
import bodyParser from 'body-parser'
import authIsVerified from './utils/auth'
import { isDevMode, isProdMode } from './app.config'
import { handleSuccess, handleError } from './utils/helper'
const app = express()

app.all('*', (req, res, next) => {
    const origin = req.headers.origin || ''
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With')
    res.header('Access-Control-Max-Age', '1728000')
    res.header('Content-Type', 'application/json;charset=utf-8')
    res.header("X-Powered-By", 'Express');


    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
})
app.use((req, res, next) => {
    let TokenIsOk = authIsVerified(req)
    let { url } = req
    console.log(url, 'url')
    if (url.indexOf('/auth') > -1) {
        if (TokenIsOk) {
            next()
        } else {
            handleError({ res, message: 'Token失效', code: 401 })
        }
    } else {
        next()
    }
})
app.use(bodyParser.json({
    limit: '1mb'
}))
app.use(bodyParser.urlencoded({
    extended: true
}))

routes(app);

// 数据库连接
const mongoose = require('mongoose')
const baseUrl = isDevMode ? `mongodb://127.0.0.1:27017/vuemall` : `mongodb://blog_runner:admin@127.0.0.1:27017/vuemall`
mongoose.connect(baseUrl, {
    useNewUrlParser: true
}, err => {
    if (err) {
        console.log('数据库连接失败', err)
    } else {
        console.log('数据库连接成功', 76890789);
        app.listen('8088')
    }
})