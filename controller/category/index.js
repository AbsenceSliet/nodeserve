import CategoryModel from '../../modles/category'
import BaseComponent from '../../mixins/baseComponent'
import { handleSuccess, handleError } from '../../utils/helper'

class Category extends BaseComponent {
    constructor(props) {
        super(props)
        this.createCate = this.createCate.bind(this)
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
                category_id = await this.getId('category_id')
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
                    await newCate.save()
                    let caregoryList = await CategoryModel.find({})
                    handleSuccess({
                        res,
                        code: 1,
                        message: '创建成功',
                        result: caregoryList
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
        let { category_id } = req.query, params
        if (category_id) {
            params = {
                category_id
            }
        } else {
            params = {}
        }
        const list = await CategoryModel.find(params)
        handleSuccess({
            code: 1,
            res,
            result: list,
            message: '查询成功'
        })
    }
    async updateCategory(req, res) {
        let { category_id, name, level, visual } = req.body
        if (!name) {
            handleError({
                res,
                code: 0,
                message: '请输入分类标题'
            })
        } else {
            let params = { name, level, visual }
            try {
                await CategoryModel.findOneAndUpdate({ category_id }, { $set: params })
                let caregoryList = await CategoryModel.find({})
                handleSuccess({
                    code: 1,
                    res,
                    result: caregoryList,
                    message: '更新分类成功'
                })
            } catch (err) {
                handleError({
                    code: 0,
                    res,
                    message: '更新分类失败'
                })
            }
        }
    }
    async deleteCategory(req, res) {
        let { category_id } = req.query
        console.log(category_id, 'category_id');
        try {
            let deleteItem = await CategoryModel.findOneAndRemove({ category_id })
            let caregoryList = await CategoryModel.find({})
            handleSuccess({
                code: 1,
                res,
                result: caregoryList,
                message: '删除成功'
            })
        } catch (err) {
            handleError({
                code: 0,
                res,
                message: '删除失败'
            })
        }
    }
}
export default new Category()