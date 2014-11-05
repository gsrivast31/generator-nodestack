/*
 * <%= props.name %>
 * <%= props.homepage %>
 *
 * Copyright (c) <%= currentYear %> <%= props.authorName %>
 * Licensed under the <%= props.license %> license.
 */

 'use strict';
 
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
<% if (passports.includeLocal) { %> 
  local          : {
    email        : String,
    password     : String,
  },
<% } %> <% if (passports.includeGoogle) { %> 
  google         : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
<% } %> <% if (passports.includeFacebook) { %> 
  facebook         : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
<% } %> <% if (passports.includeTwitter) { %> 
  twitter          : {
    id           : String,
    token        : String,
    displayName  : String,
    username     : String
  },
<% } %> <% if (passports.includeGitHub) { %> 
  linkedin         : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
<% } %> <% if (passports.includeLinkedIn) { %> 
  github           : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },<% } %> 
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);


