import fetch from 'node-fetch';
import Ids from '../modles/ids'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import gm from 'gm'
import { handleSuccess, handleError } from '../utils/helper'
import { QINIU } from '../app.config.js'
import qiniu from 'qiniu'


/**
 * 解决this指向问题
 * 类的方法内部如果含有this，它默认只想类的实例 
 * class Logger {
     printName(name = 'there') {
         this.print(`Hello ${name}`);
     }

     print(text) {
         console.log(text);
     }
 }

 const logger = new Logger();
 const {
     printName
 } = logger;
 printName(); // TypeError: Cannot read property 'print' of undefined

 printName方法中的this默认指向looger类，但如果单独抽离出来， 则会只想该方法 运行时的环境 由于class 内部是严格模式 ，因此this指向是undefined


 解决方法
 1、在构造方法中绑定this
 constructor(){
     this.printName = this.printName.bind(this)
 }
 2、使用箭头函数
class Obj {
    constructor() {
        this.getThis = () => this;
    }
}

const myObj = new Obj();
myObj.getThis() === myObj // true
3、 使用Proxy,获取方法时，绑定this
function selfish(target) {
    const cache = new WeakMap();
    const handler = {
        get(target, key) {
            const value = Reflect.get(target, key);
            if (typeof value !== 'function') {
                return value;
            }
            if (!cache.has(value)) {
                cache.set(value, value.bind(target));
            }
            return cache.get(value);
        }
    };
    const proxy = new Proxy(target, handler);
    return proxy;
}

const logger = selfish(new Logger());
 */


export default class BaseComponent {
    constructor() {
        this.idList = ['admin_id', "img_id", "article_id", "category_id"]
        this.upQiNiu = this.upQiNiu.bind(this)
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


    //上传至七牛
    async upQiNiu(req, res) {
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm()
            const uploadpath = path.join(__dirname, '../public/img/')
            form.uploadDir = uploadpath
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
                const fullname = hashname + extname
                const targetFile = path.join(uploadpath, fullname)
                try {
                    await fs.renameSync(file.file.path, targetFile)
                    let token = this.uptoken(fullname)
                    const qiniuimgInfo = await this.uploadFile(token, fullname, targetFile)
                    let qiniuimg = qiniuimgInfo.key;
                    let sourceLink = QINIU.domainKey + qiniuimg
                    fs.unlinkSync(targetFile)
                    resolve(sourceLink)
                } catch (err) {
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

    //获取七牛token
    uptoken(key) {
        var mac = new qiniu.auth.digest.Mac(QINIU.accessKey, QINIU.secretKey);
        var options = {
            scope: `${QINIU.bucketKey}:${key}`,
            returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
            expires: 7200
        };
        var putPolicy = new qiniu.rs.PutPolicy(options);
        var uploadToken = putPolicy.uploadToken(mac);
        return uploadToken
    }

    uploadFile(upToken, key, localFile) {
        return new Promise((resolve, reject) => {
            const putExtra = new qiniu.form_up.PutExtra();
            const config = new qiniu.conf.Config();
            config.zone = qiniu.zone.Zone_z0; // 空间对应的机房
            const formUploader = new qiniu.form_up.FormUploader(config);
            formUploader.putFile(upToken, key, localFile, putExtra, function(respErr,
                respBody, respInfo) {
                if (respErr) {
                    reject(respErr)
                }
                if (respInfo.statusCode == 200) {
                    resolve(respBody)
                }
            })
        })
    }
}