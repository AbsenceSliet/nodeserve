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
                    let creatCateItem = await newCate.save()
                        // let caregoryList = await CategoryModel.find({})
                    handleSuccess({
                        res,
                        code: 1,
                        message: '创建成功',
                        result: creatCateItem
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
        const list = await CategoryModel.find(params).sort({ level: -1 })
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
                let updateCate = await CategoryModel.findOneAndUpdate({ category_id }, { $set: params }, { new: true })
                handleSuccess({
                    code: 1,
                    res,
                    result: updateCate,
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
        let category_id = req.params.category_id
        console.log(category_id, 'category_id');
        if (!category_id || !Number(category_id)) {
            console.log('获取分类参数ID错误');
            handleError({
                res,
                code: 0,
                message: '分类参数ID错误'
            })
            return
        }
        try {
            let deleteItem = await CategoryModel.findOneAndRemove({ category_id })
            handleSuccess({
                code: 1,
                res,
                result: deleteItem,
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