const argv = require('yargs').argv
console.log(argv, 'argv')
export const MONGODB = {
    uri: `mongodb:127.0.0.1:${ argv.dbport || '27017' }/vuemall`,
    username: argv.db_username || 'DB_username',
    password: argv.db_password || 'DB_password',
}
export const AUTH = {
    data: argv.auth_data || { user: 'root' },
    jwtToken: argv.auth_key || 'blog-node',
    defaultPassword: argv.auth_default_password || 'root'
}
export const QINIU = {
    accessKey: argv.qn_a_key || 'your qiniu accessKey',
    secretKey: argv.qn_s_key || 'your qiniu secretKey',
    bucketKey: argv.qn_b_key || 'your qiniu bucketKey',
    domainKey: argv.qn_dm_key || 'your qiniu domainKey'
}
export const environment = process.env.NODE_ENV;
export const isDevMode = Object.is(environment, 'development')
export const isProdMode = Object.is(environment, 'production')