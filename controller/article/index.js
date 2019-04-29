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
        const { title, abstract, content, category_id, tags } = req.body
        if (!title) {
            handleError({
                res,
                code: 0,
                message: '必须填写文章标题'
            })
        } else if (!abstract) {
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
                    desc: abstract,
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
}
export default new Article()