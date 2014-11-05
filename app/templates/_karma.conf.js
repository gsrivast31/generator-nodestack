// Karma configuration

basePath =  '',

frameworks =  ['mocha', 'chai'],

files = [
  'public/scripts/*.js',
  'public/scripts/**/*.js', 
  'test/spec/**/*.js'
],

reporters = ['progress'],

port =  9876,
colors = true,
autoWatch = false,
singleRun = false,

// level of logging
// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
logLevel = LOG_INFO,

browsers = ['Chrome']
