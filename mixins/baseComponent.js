import fetch from 'node-fetch';
import Ids from '../modles/ids'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import gm from 'gm'
import { handleSuccess, handleError } from '../utils/helper'

export default class BaseComponent {
    constructor() {
        this.idList = ['admin_id', "img_id"]
    }
    async fetch(url = '', data = {}, type = 'GET', resType = 'JSON') {
        type = type.toUpperCase();
        resType = resType.toUpperCase();
        if (type == 'GET') {
            let dataStr = ''; //数据拼接字符串
            Object.keys(data).forEach(key => {
                dataStr += key + '=' + data[key] + '&';
            })

            if (dataStr !== '') {
                dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
                url = url + '?' + dataStr;
            }
        }

        let requestConfig = {
            method: type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }

        if (type == 'POST') {
            Object.defineProperty(requestConfig, 'body', {
                value: JSON.stringify(data)
            })
        }
        let responseJson;
        try {
            const response = await fetch(url, requestConfig);
            if (resType === 'TEXT') {
                responseJson = await response.text();
            } else {
                responseJson = await response.json();
            }
        } catch (err) {
            console.log('获取http数据失败', err);
            throw new Error(err)
        }
        return responseJson
    }

    //获取id列表
    async getId(type) {
        if (!this.idList.includes(type)) {
            console.log('id类型错误');
            throw new Error('id类型错误');
            return
        }
        try {
            const idData = await Ids.findOne();
            idData[type]++;
            await idData.save();
            return idData[type]
        } catch (err) {
            console.log('获取ID数据失败');
            throw new Error(err)
        }
    }

    //获取上传路径
    async getPath(req, res) {
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm()
            const uploadpath = path.join(__dirname, '../public/img/')
            form.uploadDir = uploadpath
            form.maxFieldsSize = 1 * 1024 * 1024;
            form.parse(req, async(err, fileds, file) => {
                let img_id;
                try {
                    img_id = await this.getId('img_id')
                } catch (err) {
                    fs.unlinkSync(file.file.path)
                    reject('获取图片id失败')
                }
                const hashname = (new Date().getTime() + Math.ceil(Math.random() * 10000).toString(16)) + img_id
                const extname = path.extname(file.file.name)
                if (!['.jpg', '.png', '.jpeg'].includes(extname)) {
                    fs.unlinkSync(file.file.path)
                    handleError({
                        res,
                        code: '0',
                        message: '文件格式错误'
                    })
                    reject('上传失败')
                    return
                }
                const fullname = hashname + extname
                const targetFile = path.join(uploadpath, fullname)
                try {
                    fs.renameSync(file.file.path, targetFile)
                    gm(targetFile).resize('168', '168', '!')
                        .write(targetFile, (err) => {
                            resolve(fullname)
                        })
                } catch (err) {
                    console.log('保存图片失败')
                    if (fs.existsSync(targetFile)) {
                        fs.unlinkSync(targetFile)
                    } else {
                        fs.unlinkSync(file.file.path)
                    }
                    reject('保存图片失败')
                }
            })
        })
    }
}