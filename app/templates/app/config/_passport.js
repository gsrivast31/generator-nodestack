/*
 * <%= props.name %>
 * <%= props.homepage %>
 *
 * Copyright (c) <%= currentYear %> <%= props.authorName %>
 * Licensed under the <%= props.license %> license.
 */

'use strict';

// load all the things we need
<% if (passports.includeLocal) { %> 
var LocalStrategy    = require('passport-local').Strategy;<% 
} %> <% if (passports.includeGoogle) { %> 
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;<% 
} %> <% if (passports.includeFacebook) { %> 
var FacebookStrategy = require('passport-facebook').Strategy;<% 
} %> <% if (passports.includeTwitter) { %> 
var TwitterStrategy = require('passport-twitter').Strategy;<% 
} %> <% if (passports.includeGitHub) { %> 
var GitHubStrategy = require('passport-github').Strategy;<% 
} %> <% if (passports.includeLinkedIn) { %> 
var LinkedInStrategy  = require('passport-linkedin-oauth2').Strategy;<% 
} %> 

// load up the user model
var User       = require('../models/user');
<% if (includePassportSocial) { %> 
// load the auth variables
var configAuth = require('./auth');
<% } %>
module.exports = function(passport) {

	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
<% if (passports.includeLocal) { %> 
	// LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
	    },
	    function(req, email, password, done) {

	    	// asynchronous
	        // User.findOne wont fire unless data is sent back
	        process.nextTick(function() {

			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
	        User.findOne({ 'local.email' :  email }, function(err, user) {
	            // if there are any errors, return the error
	            if (err) {
                    return done(err);
                }

	            // check to see if theres already a user with that email
	            if (user) {
	                return done(null, false, req.flash('errorMessage', 'That email is already taken.'));
	            } else {

					// if there is no user with that email
	                // create the user
	                var newUser            = new User();

	                // set the user's local credentials
	                newUser.email    = email;
	                newUser.local.password = newUser.generateHash(password);

					// save the user
	                newUser.save(function(err) {
	                    if (err) {
                            throw err;
                        }
	                    return done(null, newUser);
	                });
	            }
	        });    
        });
    }));

	// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                return done(err);
            }

            // if no user is found, return the message
            if (!user) {
                return done(null, false, req.flash('errorMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

			// if the user is found but the password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, req.flash('errorMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }

            // all is well, return successful user
            return done(null, user);
        });

    }));
<% } %><% if (passports.includeGoogle) { %> 
	// =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
	    clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
    },
    function(accessToken, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = accessToken;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
<% } %> <% if (passports.includeFacebook) { %> 
	// =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
	    clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
    },
    function(accessToken, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from 
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.facebook.id    = profile.id;
                    newUser.facebook.token = accessToken;
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
<% } %> <% if (passports.includeTwitter) { %> 
	// =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({
	    consumerKey     : configAuth.twitterAuth.clientID,
        consumerSecret  : configAuth.twitterAuth.clientSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
    },
    function(accessToken, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.twitter.id    = profile.id;
                    newUser.twitter.token = accessToken;
                    newUser.twitter.displayName  = profile.displayName;
                    newUser.twitter.username = profile.username;

                    // save the user
                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
<% } %> <% if (passports.includeLinkedIn) { %> 
	// =========================================================================
    // LINKEDIN ================================================================
    // =========================================================================
    passport.use(new LinkedInStrategy({
        clientID: configAuth.linkedInAuth.clientID,
        clientSecret: configAuth.linkedInAuth.clientSecret,
        callbackURL: configAuth.linkedInAuth.callbackURL,
        scope: ['r_fullprofile'],
    }, 
    function(accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...
        process.nextTick(function () {
			// try to find the user based on their google id
		    User.findOne({ 'linkedin.id' : profile.id }, function(err, user) {
		    	if (err) {
                    return done(err);
                }

		        if (user) {
		            // if a user is found, log them in
		            return done(null, user);
		        } 
		        else {
		        	// if the user isnt in our database, create a new user
		            var newUser          = new User();

		            // set all of the relevant information
		            newUser.linkedin.id    = profile.id;
		            newUser.linkedin.token = accessToken;
		            newUser.linkedin.name  = profile.displayName;
		            newUser.linkedin.email = profile.emails[0].value; // pull the first email

					// save the user
					newUser.save(function(err) {
						if (err) {
					    	throw err;
                        }
						return done(null, newUser);
					});
				}            
			});
		});
    }));
<% } %> <% if (passports.includeGitHub) { %> 
	// =========================================================================
    // GITHUB ==================================================================
    // =========================================================================
    passport.use(new GitHubStrategy({
    	clientID        : configAuth.githubAuth.clientID,
        clientSecret    : configAuth.githubAuth.clientSecret,
        callbackURL     : configAuth.githubAuth.callbackURL,
        scope: ['repo', 'user']
    },
    function(accessToken, refreshToken, profile, done) {

		// make the code asynchronous
		// User.findOne won't fire until we have all our data back from GitHub
		process.nextTick(function() {

		// try to find the user based on their google id
			User.findOne({ 'github.id' : profile.id }, function(err, user) {
		    	if (err) {
                    return done(err);
                }

		        if (user) {
			        // if a user is found, log them in
		    		return done(null, user);
		        } 
		        else {
		        	// if the user isnt in our database, create a new user
		            var newUser          = new User();

		            // set all of the relevant information
		            newUser.github.id    = profile.id;
		            newUser.github.token = accessToken;
		            newUser.github.name  = profile.displayName;
		            newUser.github.email = profile.emails[0].value; // pull the first email

		            // save the user
		            newUser.save(function(err) {
		            	if (err) {
		                	throw err;
                        }
		                return done(null, newUser);
		            });
		       	}
		    });
	    });
	}));
<% } %> 
};