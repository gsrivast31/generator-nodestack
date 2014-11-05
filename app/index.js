'use strict';
var util = require('util');
var path = require('path');
var npmName = require('npm-name');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var NodestackGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    this.log(
            this.yeoman +
            '\nThe name of your project shouldn\'t contain "node" or "js" and' +
            '\nshould be a unique ID not already in use at search.npmjs.org.');
  },
  
  askForModuleName: function () {
    var done = this.async();

    var prompts = [{
      name: 'name',
      message: 'Module Name',
      default: path.basename(process.cwd()),
    }, {
      type: 'confirm',
      name: 'pkgName',
      message: 'The name above already exists on npm, choose another?',
      default: true,
      when: function(answers) {
        var done = this.async();
        npmName(answers.name, function (err, available) {
          if (!available) {
            done(true);
          }
          done(false);
        });
      }
    }];

    this.prompt(prompts, function (props) {
      if (props.pkgName) {
        return this.askForModuleName();
      }

      this.slugname = this._.slugify(props.name);
      this.safeSlugname = this.slugname.replace(
        /-+([a-zA-Z0-9])/g,
        function (g) { return g[1].toUpperCase(); }
        );

      done();
    }.bind(this));
  },
  
  askFor: function () {
    var cb = this.async();

    // welcome message
    console.log('Out of the box I include Node, Express, Mongoose, Handlebars.');

    var prompts = [{
      name: 'description',
      message: 'Description',
      default: 'The best module ever.'
    }, {
      name: 'homepage',
      message: 'Homepage'
    }, {
      name: 'license',
      message: 'License',
      default: 'MIT'
    }, {
      name: 'githubUsername',
      message: 'GitHub username'
    }, {
      name: 'authorName',
      message: 'Author\'s Name'
    }, {
      name: 'authorEmail',
      message: 'Author\'s Email'
    }, {
      name: 'authorUrl',
      message: 'Author\'s Homepage'
    }, {
      name: 'keywords',
      message: 'Key your keywords (comma to split)'
    }, {
      type: 'confirm',
      name: 'heroku',
      message: 'Do you need to deploy it to heroku?',
      default: false
    }];

    this.currentYear = (new Date()).getFullYear();

    this.prompt(prompts, function (props) {
      if(props.githubUsername){
        this.repoUrl = 'https://github.com/' + props.githubUsername + '/' + this.slugname;
      } else {
        this.repoUrl = 'user/repo';
      }

      if (!props.homepage) {
        props.homepage = this.repoUrl;
      }

      this.keywords = props.keywords.split(',');
      this.heroku = props.heroku;
      this.props = props;
      
      cb();
    }.bind(this));
  },

  askForExtensions: function() {
    var cb = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Twitter Bootstrap',
        value: 'bootstrap',
        checked: false
      }, {
        name: 'Browserify',
        value: 'browserify',
        checked: false
      }, {
        name: 'Font Awesome',
        value: 'font-awesome',
        checked: false
      }]
    }];

    this.prompt(prompts, function (answers) {
      
      function hasFeature(feat) { return answers.features.indexOf(feat) !== -1; }

      // manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.includeBootStrap = hasFeature('bootstrap');
      this.includeBrowserify = hasFeature('browserify');
      this.includeFontAwesome = hasFeature('font-awesome');
      
      cb();
    }.bind(this));
  },

  askForLoginPage: function() {
    var cb = this.async();

    var prompts = [{
      type: 'confirm',
      name: 'loginPage',
      message: 'Include passport integrations?',
      default: true
    }, {
      when : function(answers) {
        return answers && answers.loginPage === true;
      },
      type: 'checkbox',
      name: 'passports',
      message: 'Which passport integrations would you like?',
      choices: [{
        name: 'Local',
        value: 'includeLocal',
        checked: true
      },{
        name: 'Google',
        value: 'includeGoogle',
        checked: false
      },{
        name: 'Facebook',
        value: 'includeFacebook',
        checked: false
      },{
        name: 'Twitter',
        value: 'includeTwitter',
        checked: false
      },{
        name: 'GitHub',
        value: 'includeGitHub',
        checked: false
      },{
        name: 'LinkedIn',
        value: 'includeLinkedIn',
        checked: false
      }]
    }];

    this.prompt(prompts, function (props) {
      function hasPassport(passport) {
        return props.passports && props.passports.indexOf(passport) !== -1;
      }

      this.includeLoginPage = props.loginPage;

      if (this.includeLoginPage === true) {
        this.includeBootStrap = true;
      }

      this.passports = {};
      this.passports.includeLocal = hasPassport('includeLocal');
      this.passports.includeGoogle = hasPassport('includeGoogle');
      this.passports.includeFacebook = hasPassport('includeFacebook');
      this.passports.includeTwitter = hasPassport('includeTwitter');
      this.passports.includeGitHub = hasPassport('includeGitHub');
      this.passports.includeLinkedIn = hasPassport('includeLinkedIn');
      this.includePassport = this.passports.includeLocal || this.passports.includeGoogle || this.passports.includeFacebook || 
                                      this.passports.includeTwitter || this.passports.includeGitHub || this.passports.includeLinkedIn;

      this.includePassportSocial = this.passports.includeGoogle || this.passports.includeFacebook || this.passports.includeTwitter || 
                                      this.passports.includeGitHub || this.passports.includeLinkedIn;

      cb();
    }.bind(this));
  },

  writing: {
    git: function () {
      this.copy('gitignore', '.gitignore');
      this.copy('gitattributes', '.gitattributes');
    },

    bower: function () {
      this.template('_bower.json', 'bower.json');
    },

    jshint: function () {
      this.copy('jshintrc', '.jshintrc');
    },

    editorConfig: function () {
      this.copy('editorconfig', '.editorconfig');
    },

    gruntfile: function () {
      this.template('_Gruntfile.js', 'Gruntfile.js');
    },

    packageJSON: function () {
      this.template('_package.json', 'package.json');
    },

    travis: function() {
      this.copy('travis.yml', '.travis.yml');
    },

    backendprojectfiles: function() {
      this.mkdir('app');
      this.mkdir('app/config');
      this.mkdir('app/models');      
      this.mkdir('app/routes');     
      this.mkdir('app/src');     

      this.template('_app.js', 'app.js');
      this.template('app/config/_database.js', 'app/config/database.js');
      this.template('app/routes/_routes.js', 'app/routes/routes.js');

      if (this.includePassport) {
        this.template('app/config/_auth.js', 'app/config/auth.js');
        this.template('app/config/_passport.js', 'app/config/passport.js');
        this.template('app/models/_user.js', 'app/models/user.js');
      };
    },

    frontendprojectfiles: function() {
      this.mkdir('public');
      this.mkdir('public/requires');
      this.mkdir('public/images');
      this.mkdir('public/scripts');
      this.mkdir('public/scripts/collections');
      this.mkdir('public/scripts/models');
      this.mkdir('public/scripts/views');
      this.mkdir('public/styles');
      this.mkdir('public/styles/less');
      this.mkdir('public/templates');

      this.copy('app/scripts/main.js', 'public/scripts/main.js');
    },

    testprojectfiles: function() {
      this.mkdir('test');
      this.mkdir('test/spec');
      this.copy('_karma.conf.js', 'karma.conf.js');
    },

    projectfiles: function () {
      this.mkdir('views');
      this.mkdir('views/helpers');
      this.mkdir('views/layouts');
      this.mkdir('views/partials');
      this.copy('app/templates/404.handlebars', 'views/layouts/404.handlebars');
      this.template('app/templates/_main.handlebars', 'views/layouts/main.handlebars');
      this.template('app/templates/_home.handlebars', 'views/home.handlebars');

      if (this.includePassport) {
        this.template('app/templates/_profile.handlebars', 'views/profile.handlebars');
      }

      this.copy('app/_helpers.js', 'views/helpers/helpers.js');

      if (this.heroku) {
        this.copy('_Procfile', 'Procfile');
        this.copy('_env', '.env');
      }
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = NodestackGenerator;

