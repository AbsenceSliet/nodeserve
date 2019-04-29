import CategoryModel from '../../modles/category'
import BaseComponent from '../../mixins/baseComponent'
import { handleSuccess, handleError } from '../../utils/helper'

class Category extends BaseComponent {
    constructor(props) {
        super(props)
    }
    async createCate(req, res, next) {
        const { name, level, visual } = req.body
        if (!name) {
            handleError({
                res,
                code: 0,
                message: '请输入分类标题'
            })
        } else {
            let category_id
            try {
                category_id = await this.getId('article_id')
            } catch (err) {
                handleError({
                    res,
                    code: 0,
                    message: '获取数据失败'
                })
            }
            const cateItem = await CategoryModel.findOne({ name })
            if (cateItem) {
                handleError({
                    res,
                    code: 0,
                    message: '该分类标题已存在'
                })
            } else {
                const cate_obj = {
                    category_id: category_id,
                    name: name,
                    level: level,
                    visual: visual
                }
                const newCate = new CategoryModel(cate_obj)
                try {
                    const resultCate = await newCate.save()
                    handleSuccess({
                        code: 1,
                        message: '创建成功',
                        result: resultCate
                    })
                } catch (err) {
                    handleError({
                        res,
                        code: 0,
                        message: '创建失败'
                    })
                }
            }
        }
    }
    async categoryList(req, res, next) {
        const list = await CategoryModel.find()
        handleSuccess({
            code: 1,
            res,
            result: list,
            message: '查询成功'
        })
    }
}
export default new Category()