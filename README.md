# generator-nodestack [![Build Status](https://secure.travis-ci.org/gsrivast31/generator-nodestack.png?branch=master)](https://travis-ci.org/gsrivast31/generator-nodestack)

> [Yeoman](http://yeoman.io) generator for MEBN(MongoDB+Express+Backbone+Node) stack. Also setup Passport authentication strategies. Best suited for hackathons.


## Getting Started

- Make sure you have yo installed on the latest version. 
```bash
npm install -g yo
```
- To install generator-nodestack from npm, run:

```bash
npm install -g generator-nodestack
```
- Finally, initiate the generator:

```bash
yo nodestack
```

### What do you get?

Scaffolds out a complete project directory structure for you:

    .
    ├── app
    │   ├── config
    │   └── models
    │   └── routes
    │   └── src
    ├── app.js
    ├── .editorconfig
    ├── .gitattributes
    ├── .gitignore
    ├── .jshintrc
    ├── .travis.yml
    ├── bower.json
    ├── Gruntfile.js
    ├── karma.conf.js
    ├── package.json
    ├── public
    │   ├── images
    │   └── scripts
    │       ├── main.js
    │       └── collections
    │       └── models
    │       └── views
    │   └── styles
    │       ├── less
    │   └── templates
    └── test
    │   ├── spec
    │       ├── test.js
    └── views
    │   ├── helpers
    │   └── layouts
    │   └── partials
    
Here is how the directory structure has been laid out:

- The public directory is where all of our front-end code will reside and will be served from. Basically anything inside the public or views directories is visible from a browser, everything else is not.
- The core server file that will house the bulk of the node.js code (at least the boot-up code) will reside in a file called app.js.
- The app directory is where all of our back-end code will reside. These include databases, configurations, routes etc.

It also gives you the option of installing BootStrap, Browserify and Font-Awesome.

Also provided is the option of setting up authentication strategies using [Passport](passportjs.org). 

You have the flexibility of adding local, google, facebook, twitter, linkedin and github strategies.


### Deploying to Heroku

During the scaffold you are able to create Procfile and .env files on your target project. After that follow the steps below.

- Use the command grunt to generate the optimized files for your application.
- Set the environment variable NODE_ENV to production before pushing your modifications to Heroku.

## License

MIT
