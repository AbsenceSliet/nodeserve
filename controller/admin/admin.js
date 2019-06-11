import AdminModel from '../../modles/admin/admin'
import BaseComponent from '../../mixins/baseComponent'
import authIsVerified from '../../utils/auth'
import { Base64 } from 'js-base64'
import { AUTH } from '../../app.config'
import Crypto from 'crypto'
import jwt from 'jsonwebtoken'
import time from 'time-formater'
import moment from 'moment'
import { handleSuccess, handleError } from '../../utils/helper'

class Admin extends BaseComponent {
    constructor() {
        super()
        this.login = this.login.bind(this)
        this.decodePassword = this.decodePassword.bind(this)
        this.md5Decode = this.md5Decode.bind(this)
        this.uploadImage = this.uploadImage.bind(this)
        this.uploadQiNiu = this.uploadQiNiu.bind(this)

    }
    async login(req, res, next) {

        const { username, password } = req.body
        let status = null;
        if (!username) {
            throw new Error('用户名参数错误')
        } else if (!password) {
            throw new Error('密码参数错误')
        }

        const newpassword = this.md5Decode(this.decodePassword(password))

        const admin = await AdminModel.findOne({ username })

        // admin.password = admin.password || this.md5Decode(AUTH.defaultPassword)
        const token = jwt.sign({
            data: AUTH.data,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
        }, AUTH.jwtToken)

        if (!admin) {
            if (username === 'admin') {
                status = 2
            } else {
                status = 1
            }
            const adminTip = status == 1 ? `普通会员` : `超级管理员`
            const admin_id = await this.getId('admin_id')
            const adminContent = {
                username: username,
                password: newpassword,
                create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                admin: adminTip,
                status,
                admin_id: admin_id,
                slogan: token
            }
            await AdminModel.create(adminContent)
            handleSuccess({
                res,
                code: 1,
                result: {
                    token,
                    userstatus: status,
                },
                message: '注册管理员成功'
            })
        } else if (newpassword != admin.password) {
            handleError({
                res,
                message: '用户名已经存在，密码错误'
            })
        } else {
            await AdminModel.updateOne({ _id: admin._id }, { $set: { slogan: token } })
            handleSuccess({
                res,
                code: 1,
                result: {
                    token,
                    userstatus: admin.status,
                },
                message: '登陆成功'
            })
        }
    }

    // 密码编码
    decodePassword(pwd) {
        return pwd ? Base64.decode(pwd) : pwd
    }

    // md5编码
    md5Decode(password) {
        return Crypto.createHash('md5').update(password).digest('jac')
    }
    async getAdminInfo(req, res, next) {
        let TokenIsOk = authIsVerified(req)
        if (TokenIsOk) {
            const slogan = req.headers.authorization.split(' ')[1]
            let info = await AdminModel.findOne(({
                slogan: slogan
            }));
            if (!info) {
                handleError({
                    res,
                    code: 0,
                    message: 'Token失效!',
                    err: 'Token失效'
                })
                return
            }
            let roles = [];
            roles = info.status == 1 ? ['editor'] : ['editor', 'admin']
            handleSuccess({
                res,
                result: {
                    username: info.username,
                    userstatus: info.status,
                    id: info._id,
                    create_time: info.create_time,
                    avatar: info.avatar,
                    admin_id: info.admin_id,
                    roles
                },
                message: '查询成功',
                code: 1
            })
            next()
        } else if (!req.headers.authorization) {
            handleError({
                res,
                code: 0,
                message: '请登录!',
                err: '未登录'
            })
        } else {
            handleError({
                res,
                message: 'Token失效',
                code: 401
            })
        }
    }

    //上传头像
    async uploadImage(req, res, next) {
        let { admin_id } = req.params
        if (!admin_id || !Number(admin_id)) {
            handleError({
                res,
                code: 0,
                message: 'admin_id参数错误'
            })
        }
        try {
            let image_path = await this.getPath(req);
            await AdminModel.findOneAndUpdate({ admin_id: admin_id }, { $set: { avatar: image_path } })
            handleSuccess({
                res,
                code: 1,
                message: '上传图片成功',
                result: {
                    image_path
                }
            })
        } catch (err) {
            handleError({
                res,
                code: 0,
                message: '上传图片失败'
            })
        }
    }

    //上传图片至七牛云
    async uploadQiNiu(req, res) {
        const { admin_id } = req.params
        console.log(admin_id, 'admin_id');
        if (!admin_id || !Number(admin_id)) {
            handleError({
                res,
                code: 0,
                message: 'admin_id参数错误'
            })
        }
        try {
            let image_path = await this.upQiNiu(req);

            await AdminModel.findOneAndUpdate({
                admin_id: admin_id
            }, {
                $set: {
                    avatar: image_path
                }
            })
            handleSuccess({
                res,
                code: 1,
                message: '上传图片成功',
                result: {
                    image_path
                }
            })
        } catch (err) {
            handleError({
                res,
                code: 0,
                message: '上传图片失败'
            })
        }
    }
}
export default new Admin()