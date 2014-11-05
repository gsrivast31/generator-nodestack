/*
 * <%= props.name %>
 * <%= props.homepage %>
 *
 * Copyright (c) <%= currentYear %> <%= props.authorName %>
 * Licensed under the <%= props.license %> license.
 */

'use strict';
<% if (includePassportSocial) { %>
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated()) {
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/');
}
<% } %>
module.exports = function(app, passport) {

  // =====================================
  // HOME PAGE ===========================
  // =====================================
  app.get('/', function(req, res) {
    //Load index file
    res.render('home', { message : req.flash('errorMessage')}); 
  });

  app.get('/404', function (req, res) {
    res.render('404', {
        // Overrides which layout to use, instead of the defaul "main" layout.
        layout: '404'
    });
  });

  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile');
  });

<% if (includePassport) { %>
  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
<% } %><% if (passports.includeLocal) { %> 
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
<% } %><% if (passports.includeGoogle) { %> 
  // GOOGLE ROUTES =======================
  app.get('/auth/google', passport.authenticate('google', { 
    scope : ['profile', 'email']
  }));
  // the callback after google has authenticated the user
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
<% } %><% if (passports.includeFacebook) { %> 
  // FACEBOOK ROUTES =======================
  app.get('/auth/facebook', passport.authenticate('facebook', { 
    scope : 'email'
  }));
  // the callback after google has authenticated the user
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
<% } %><% if (passports.includeTwitter) { %> 
  // TWITTER ROUTES =======================
  app.get('/auth/twitter', passport.authenticate('twitter'));
  // the callback after google has authenticated the user
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
<% } %><% if (passports.includeLinkedIn) { %> 
  // LINKEDIN ROUTES =======================
  app.get('/auth/linkedin', passport.authenticate('linkedin', { 
    state: 'insertsomestatehere'
  }));
  // the callback after google has authenticated the user
  app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
<% } %><% if (passports.includeGitHub) { %> 
  // GITHUB ROUTES =======================
  app.get('/auth/github', passport.authenticate('github'));
  // the callback after google has authenticated the user
  app.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));<% } %>
};
