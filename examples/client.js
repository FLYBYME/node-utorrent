var Client = require('../')
var utorrent = new Client(8080, '192.168.1.10', 'admin', 'admin')

utorrent.get(function(err, data) {
	console.log(err, data)
})
