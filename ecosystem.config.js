module.exports = {
    apps: [{
        name: 'API',
        script: 'start.js',

        args: 'one two',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],

    deploy: {
        production: {
            user: 'Garen',
            host: 'www.garener.com',
            ref: 'origin/master',
            repo: 'git@github.com:AbsenceSliet/nodeserve.git',
            path: '/www/nodeServer/production',
            'post-deploy': 'yarn  ',
            env: {
                NODE_ENV: "production"
            }
        }
    }
};