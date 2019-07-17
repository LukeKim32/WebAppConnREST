password = 'Bruce@2371564'

module.exports = {
  apps : [{
    name: 'API',
    script: 'bin/www',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
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

  deploy : {
    development : {
      key : '/Users/kwanyukim/pemfiles/legday_dev.pem',
      user : 'ubuntu',
      host : '13.125.152.95',
      ref  : 'origin/master',
      repo : 'git@github.com:joondong/legday.git',
      path : '/home/ubuntu/legday',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env development'
    },

    production : {
      key : '/Users/kwanyukim/pemfiles/legday_dev.pem',
      user : 'ubuntu',
      host : '13.125.152.95',
      ref  : 'origin/master',
      repo : 'git@github.com:joondong/legday.git',
      path : '/home/ubuntu/legday',
      'post-deploy' : 'npm install && pm2 reload Legday/LegdayWeb/ecosystem.config.js --env production'
    }
  }
};
