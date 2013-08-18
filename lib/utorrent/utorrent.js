//node utils
var http = require('http');
var util = require('util');
var path = require('path');
var querystring = require('querystring')
var url = require('url');
var events = require('events')
var TorrentMap = require('./map/torrents')

var Cleint = module.exports = function(port, host, user, pass) {

	events.EventEmitter.call(this);
	this.url = '/gui';
	this.host = host;
	this.port = port;
	this.authKey = new Buffer(user + ":" + pass).toString('base64')
	this.token = false;
	this.hasAuth = false;
	this.cookie = false;
	this.queue = []
};
// So will act like an event emitter
util.inherits(Cleint, events.EventEmitter);

Cleint.prototype.get = function(callBack) {
	var self = this;

	this.callServer('/gui/?' + querystring.stringify({
		list : 1,
		t : Date.now()
	}), function(err, data) {
		if (err) {
			return callBack(err)
		}

		callBack(null, data.torrents.map(function(torrent) {
			return TorrentMap(torrent, self.CONST)
		}))
	})
};
var actions = Cleint.prototype.basicActions = ['getprops', 'queueup', 'queuetop', 'queuedown', 'queuebottom', 'start', 'stop', 'pause', 'unpause', 'forcestart', 'recheck']

actions.forEach(function(action) {
	Cleint.prototype[action + 'Torrent'] = function(hash, callBack) {
		this.actionTorrent(hash, action, callBack)
	}
})

Cleint.prototype.uploadUrlTorrent = function(url, dir, callBack) {
	var qs = querystring.stringify({
		token : this.token,
		action : 'add-url',
		s : url,
		path : dir || '/',
		t : Date.now()
	})
	var self = this;
	this.callServer('/gui/?' + qs, function(data) {
		var result

		try {
			result = JSON.parse(data)

		} catch(err) {
			return callBack(err);
		}
		callBack(null, result)
	})
}
Cleint.prototype.actionTorrent = function(hash, action, callBack) {
	var self = this;
	this.callServer('/gui/?' + querystring.stringify({
		token : this.token,
		action : action,
		hash : hash,
		t : Date.now()
	}), function(data, headers) {
		var result

		try {
			result = JSON.parse(data)

		} catch(err) {
			return callBack(err);
		}
		callBack(null, result)
	})
}

Cleint.prototype.LoadConst = function(callBack) {
	var self = this;
	var options = {
		host : this.host,
		port : this.port,
		path : '/gui/constants.js',
		method : 'GET',
		headers : {
			'Time' : new Date(),
			'Host' : this.host + ':' + this.port,
			'Accept' : 'application/javascript',
			'Accept-Language' : 'en-US,en;q=0.8',
			'Cache-Control' : 'max-age=0',
			'Connection' : 'keep-alive',
			'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36'
		}
	};
	if (this.cookie) {
		options.headers['Cookie'] = this.cookie
	}
	options.headers['Authorization'] = 'Basic ' + this.authKey

	function onResponse(response) {
		var page = [];

		function onData(chunk) {
			page.push(chunk.toString());

		}

		function onEnd() {
			page = page.join('')
			self.CONST = new Function(page + 'return CONST;')()
			callBack()
		}


		response.setEncoding('utf8');
		response.on('data', onData);
		response.on('end', onEnd);
	}

	var req = http.request(options, onResponse);
	req.on('error', callBack).end();
};
//
Cleint.prototype.callServer = function(query, callBack, authRequest) {

	var self = this;
	if (!this.authing && !this.hasAuth && !authRequest) {
		this.authing = true
		var cb = function(error, data) {
			self.token = data.split("style='display:none;'>")[1].split('</div></html>')[0]
			self.LoadConst(function() {

			})
			self.hasAuth = true
			self.authing = false
			self.callServer(query, callBack)

		}
		this.callServer('/gui/token.html', cb, true)
		return;
	} else if (this.authing && !this.hasAuth && !authRequest) {
		this.queue.push([query, callBack])
		return;
	}

	if (this.token) {
		query = query + '&token=' + this.token
	}
	var options = {
		host : this.host,
		port : this.port,
		path : query,
		method : 'GET',
		headers : {
			'Time' : new Date(),
			'Host' : this.host + ':' + this.port,
			'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-Encoding' : 'gzip,deflate,sdch',
			'Accept-Language' : 'en-US,en;q=0.8',
			'Cache-Control' : 'max-age=0',
			'Connection' : 'keep-alive',
			'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36'
		}
	};
	if (this.cookie) {
		options.headers['Cookie'] = this.cookie
	}
	options.headers['Authorization'] = 'Basic ' + this.authKey

	function onResponse(response) {
		var page = [];

		function onData(chunk) {
			page.push(chunk);
		}

		function onEnd() {
			if (response.headers['set-cookie']) {
				self.cookie = response.headers['set-cookie'][0].split(';')[0]
			}
			page = page.join('')
			if (!authRequest) {
				var result
				try {
					result = JSON.parse(page)

				} catch(err) {
					return callBack(err);
				}
				callBack(null, result)
			} else {
				callBack(null, page)
			}

		}


		response.setEncoding('utf8');
		response.on('data', onData);
		response.on('end', onEnd);
	}

	var req = http.request(options, onResponse);
	req.on('error', callBack).end(JSON.stringify(query), 'utf8');
};
