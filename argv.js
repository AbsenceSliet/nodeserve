import argv from 'yargs';
argv.options({
    'dbport': {
        alias: 'dbport',
        demandOption: true,
        default: '27017',
        describe: 'mongodb export port',
        type: 'number'
    },
    'db_username': {
        alias: 'db_username',
        demandOption: true,
        default: 'blog_runner',
        describe: 'mongodb database owner',
        type: 'string'
    },
    'db_password': {
        alias: 'db_password',
        demandOption: true,
        default: 'admin',
        describe: 'mongodb database owner password',
        type: 'string'
    },
    'qn_access_key': {
        alias: 'qn_a_key',
        demandOption: true,
        default: '5ep7Qw4xSjJmxacgJEiFx3OBvioaeoXE5e0wYrob',
        describe: 'qiniu access_key',
        type: 'string'
    },
    'qn_secret_key': {
        alias: 'qn_s_key',
        demandOption: true,
        default: 'LY_SQkajAaypgennPm1QfcnSOjxefKejuU0Shqlu',
        describe: 'qiniu secret_key',
        type: 'string'
    },
    'qn_bucket_key': {
        alias: 'qn_b_key',
        demandOption: true,
        default: 'blog_node',
        describe: 'qiniu data name',
        type: 'string'
    },
    'qn_domain_key': {
        alias: 'qn_dm_key',
        demandOption: true,
        default: 'http://source.blog.garener.com/',
        describe: 'qiniu source domain',
        type: 'string'
    },
}).argv