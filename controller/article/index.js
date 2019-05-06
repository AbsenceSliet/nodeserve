import ArticleModel from '../../modles/article'
import BaseComponent from '../../mixins/baseComponent'
import formidable from 'formidable'
import { handleSuccess, handleError } from '../../utils/helper'
import moment from 'moment'
class Article extends BaseComponent {
    constructor(props) {
        super(props)
        this.createArticle = this.createArticle.bind(this)
        this.articleList = this.articleList.bind(this)
    }
    async createArticle(req, res, next) {
        const { title, desc, content, category_id, category_name, tags } = req.body
        if (!title) {
            handleError({
                res,
                code: 0,
                message: '必须填写文章标题'
            })
        } else if (!desc) {
            handleError({
                res,
                code: 0,
                message: '必须填写文章简介'
            })
        } else if (!content) {
            handleError({
                res,
                code: 0,
                message: '必须填写文章内容'
            })
        } else {
            let article_id
            try {
                article_id = await this.getId('article_id')
            } catch (err) {
                handleError({
                    res,
                    code: 0,
                    message: '获取数据失败'
                })
            }
            const articleitem = await ArticleModel.findOne({ title })
            if (articleitem) {
                handleError({
                    res,
                    code: 0,
                    message: '改文章标题已存在'
                })
            } else {
                const articleObj = {
                    title: title,
                    category_id: category_id,
                    category_name: category_name || '未分类',
                    desc: desc,
                    tags: tags,
                    content: content,
                    article_id: article_id,
                    create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    update_time: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                const newArticle = new ArticleModel(articleObj)
                try {
                    const articleSuccess = await newArticle.save()
                    console.log(articleSuccess);
                    handleSuccess({
                        code: 1,
                        res,
                        message: '添加文章成功',
                        result: articleSuccess
                    })
                } catch (err) {
                    console.log(err, 'err')
                    handleError({
                        res,
                        code: 0,
                        message: err
                    })
                }
            }
        }
    }
    async articleList(req, res, next) {
        const list = await ArticleModel.find()
        handleSuccess({
            code: 1,
            res,
            result: list,
            message: '查询成功'
        })
    }
    async getArticleDeatil(req, res, next) {
        const article_id = req.params.article_id
        if (!article_id || !Number(article_id)) {
            console.log('获取文章详情页面参数ID错误');
            handleError({
                res,
                code: 0,
                message: '文章详情参数ID错误'
            })
            return
        }
        try {
            const article = await ArticleModel.findOne({ article_id })
            if (article) {
                handleSuccess({
                    res,
                    code: 1,
                    result: article,
                    message: '获取文章详情成功'
                })
            } else {
                handleError({
                    res,
                    code: 0,
                    message: '获取文章详情失败'
                })
            }
        } catch (err) {
            handleError({
                res,
                code: 0,
                message: '获取文章详情失败'
            })
        }
    }
    async updateArticle(req, res) {
        const { title, desc, content, article_id, category_id, category_name, tags } = req.body
        console.log(desc);
        if (!title) {
            handleError({
                res,
                code: 0,
                message: '必须填写文章标题'
            })
        } else if (!desc) {
            handleError({
                res,
                code: 0,
                message: '必须填写文章简介'
            })
        } else if (!content) {
            handleError({
                res,
                code: 0,
                message: '必须填写文章内容'
            })
        } else {
            try {
                let newData = { title, desc, content, article_id, category_id, category_name, tags }
                newData.update_time = moment().format('YYYY-MM-DD HH:mm:ss')
                const article = await ArticleModel.findOneAndUpdate({ article_id }, { $set: newData })
                console.log(article, 'article');
                handleSuccess({
                    res,
                    code: 1,
                    message: '更新文章内容成功',
                    result: article
                })
            } catch (err) {
                handleError({
                    code: 0,
                    res,
                    err: '更新文章失败',
                    mesage: '更新文章失败'
                })
            }

        }
    }
}
export default new Article()