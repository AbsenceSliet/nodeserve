module.exports = {
    apps: [{
        name: 'API',
        script: 'npm -- run start',

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
            'post-deploy': 'rm -rf node_modules && yarn  && pm2 reload ecosystem.config.js --env production',
            env: {
                NODE_ENV: "production"
            }
        }
    }
};