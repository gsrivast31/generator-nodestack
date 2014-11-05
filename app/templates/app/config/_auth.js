/*
 * <%= props.name %>
 * <%= props.homepage %>
 *
 * Copyright (c) <%= currentYear %> <%= props.authorName %>
 * Licensed under the <%= props.license %> license.
 */

'use strict';

// expose our config directly to our application using module.exports
module.exports = {<% 
	if (passports.includeGoogle) { %> 
	'googleAuth' : {
		'clientID' 		: 'GOOGLE-CLIENT-ID', // your App ID
		'clientSecret' 	: 'GOOGLE-CLIENT-SECRET', // your App Secret
		'callbackURL' 	: 'GOOGLE-CALLBACK-URL'
	}, <% } %> <% 
	if (passports.includeFacebook) { %> 
	'facebookAuth' : {
		'clientID' 		  : 'FACEBOOK-CLIENT-ID', // your App ID
		'clientSecret' 	: 'FACEBOOK-CLIENT-SECRET', // your App Secret
		'callbackURL' 	: 'FACEBOOK-CALLBACK-URL'
	}, <% } %> <% 
	if (passports.includeTwitter) { %> 
	'twitterAuth' : {
		'consumerKey' 	: 'TWITTER-CLIENT-ID', // your App ID
		'consumerSecret': 'TWITTER-CLIENT-SECRET', // your App Secret
		'callbackURL' 	: 'TWITTER-CALLBACK-URL'
	}, <% } %> <% 
	if (passports.includeLinkedIn) { %> 
	'linkedInAuth' : {
		'clientID' 		  : 'LINKEDIN-CLIENT-ID', // your App ID
		'clientSecret' 	: 'LINKEDIN-CLIENT-SECRET', // your App Secret
		'callbackURL' 	: 'LINKEDIN-CALLBACK-URL'
	}, <% } %> <% 
	if (passports.includeGitHub) { %> 
	'githubAuth' : {
		'clientID' 		  : 'GITHUB-CLIENT-ID', // your App ID
		'clientSecret' 	: 'GITHUB-CLIENT-SECRET', // your App Secret
		'callbackURL' 	: 'GITHUB-CALLBACK-URL'
	}, <% } %> 
};