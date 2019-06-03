import fs from 'fs'
import path from 'path'

function resolve(dir) {
    return path.join(__dirname, '../', dir)
}
const logDir = resolve('log')
fs.existsSync(logDir) || fs.mkdirSync(logDir)

const accessLogStream = require('file-stream-rotator').getStream({
    filename: path.join(logDir, 'access-%DATE%.log'),
    date_format: 'YYYYMMDD',
    frequency: "daily",
    verbose: false
})
const errorLogStream = require('file-stream-rotator').getStream({
    filename: path.join(logDir, 'error-%DATE%.log'),
    date_format: 'YYYYMMDD',
    frequency: "daily",
    verbose: false
})
export {
    accessLogStream,
    errorLogStream
}