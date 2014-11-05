/*
 * <%= props.name %>
 * <%= props.homepage %>
 *
 * Copyright (c) <%= currentYear %> <%= props.authorName %>
 * Licensed under the <%= props.license %> license.
 */

'use strict';

var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var exphbs = require('express-handlebars');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./app/config/database.js');<% 
if (includePassport) { %>
var passport = require('passport');<% 
} %>
var routes = require('./app/routes/routes.js');

var app = express();

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
<% if (includePassport) { %>
require('./app/config/passport.js')(passport);
<% } %>
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');

// Configure express to use handlebars templates
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: require(app.get('views') + '/helpers/helpers.js'),
  layoutsDir: app.get('views') + '/layouts',
  partialsDir: app.get('views') + '/partials'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// required for passport
app.use(session({ secret: 'insertsometexthere' })); // session secret
<% if (includePassport) { %>
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
<% } %>
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(__dirname + '/public'));
<% if (includePassport) { %>
// routes ======================================================================
routes(app, passport); // load our routes and pass in our app and fully configured passport
<% } else { %>
routes(app);<%
} %>
// launch ======================================================================
module.exports = app;
//app.listen(app.get('port'));
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


