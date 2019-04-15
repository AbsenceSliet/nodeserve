  require('babel-register')({
      presets: ['env']
  })
  require('babel-polyfill');
  require('./argv')
  require('./app.js')