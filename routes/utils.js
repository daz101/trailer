"use strict";
var Hashids = require('hashids');
var hashLength = 6;
var hashids = new Hashids('', hashLength);

/**
 * Pad a string with zero's on the left to required length.
 */
var pad = function(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
};

var isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

/**
 * Send an error response.
 */
var sendErr = function(res, msg) {
	res.status(500).json({ 'success': false, 'result': msg });
};

/**
 * Log events
 */
var updateEvent = function(db, event, eventdesc, userid, res) {
	var events = db.get('events');
	events.insert({
		timestamp: new Date().getTime() / 1000, // number of seconds since epoch
		event: event, // event name
		decr: eventdesc, // event description
		userid: userid // user who generated the event
	}, function(err) {
		if (err) return sendErr(res, 'Failed to log event.');
	});
};


////////////////////
// Encryption Utils
////////////////////

function getCryptoObj(req) {
	return {
		lib : require('crypto'),
		algorithm : 'aes-256-ctr',
		password : req.settings.encryptionPassword
	}
}

/**
* Encrypt string
*/
var encrypt = function(req, text){
	var crypto = getCryptoObj(req);
	var cipher = crypto.lib.createCipher(crypto.algorithm, crypto.password)
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
};

/**
* Decrypt string
*/
var decrypt = function(req, text){
	var crypto = getCryptoObj(req);
	var decipher = crypto.lib.createCipher(crypto.algorithm, crypto.password)
	var dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8');
	return dec;
};

var hash = function(req, id){
	var salt = req.settings.hashSalt;
	if(!isNumeric(id) || !isNumeric(salt)) {
		throw "id or salt is not a number";
	}
	id = parseInt(id);
	salt = parseInt(salt);
	return hashids.encode(id * salt);
}


////////////////////
// Cookie Utils
////////////////////

var durationOfStudy = 604800; //7 days

var getCookie = function(req, key) {
	try {
		var encryptedKey = encrypt(req, key);
		if(Object.keys(req.cookies).length > 0 && req.cookies.hasOwnProperty(encryptedKey)) {
			return decrypt( req, req.cookies[encryptedKey]);
		}
	} catch(e) {
		console.log(e.stack);
		console.error("Exception in getCookieValue :: key = " + key + " : error = " + e);
	}
	return null;
}

var setCookie = function(req, res, key, value) {
	res.cookie(encrypt(req, key), encrypt(req, value), { maxAge: durationOfStudy, httpOnly: true });
	return res;
}

var deleteCookie = function(req, res, key) {
	res.clearCookie(encrypt(req, key));
	return res
}

module.exports = {
	pad: pad,
	isNumeric: isNumeric,
	sendErr: sendErr,
	updateEvent: updateEvent,
	encrypt: encrypt,
	decrypt: decrypt,
	hash: hash,
	getCookie: getCookie,
	setCookie: setCookie,
	deleteCookie: deleteCookie
};