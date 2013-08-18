var torrentNames = ["hash", "name", "order", "size", "remaining", "done", "status_code", "status_message", "swarm_seeds", "seeds", "swarm_peers", "peers", "seeds_peers", "downspeed", "upspeed", "eta", "uploaded", "downloaded", "ratio", "availability", "label", 'added', 'completed', 'url']

var mapTorrents = module.exports = function(torrent, CONST) {

	var compiledTorrents = {}
	for (var i = torrentNames.length - 1; i >= 0; i--) {
		compiledTorrents[torrentNames[i]] = loopTorrentName(torrentNames[i], CONST, torrent)

	};

	//
	return compiledTorrents;
}
var loopTorrentName = function(name, CONST, data) {
	switch (name) {
		case "added":
			return data[CONST.TORRENT_DATE_ADDED] * 1000;

		case "availability":
			return data[CONST.TORRENT_AVAILABILITY];

		case "completed":
			return data[CONST.TORRENT_DATE_COMPLETED] * 1000;

		case "done":
			return data[CONST.TORRENT_PROGRESS];

		case "downloaded":
			return data[CONST.TORRENT_DOWNLOADED];

		case "downspeed":
			return data[CONST.TORRENT_DOWNSPEED];

		case "eta":
			return data[CONST.TORRENT_ETA];

		case "label":
			return data[CONST.TORRENT_LABEL];

		case "name":
			return data[CONST.TORRENT_NAME];

		case "order":
			return data[CONST.TORRENT_QUEUE_POSITION];

		case "peers":
			return data[CONST.TORRENT_PEERS_CONNECTED];
		case "swarm_peers":
			return data[CONST.TORRENT_PEERS_SWARM];

		case "ratio":
			return data[CONST.TORRENT_RATIO];

		case "remaining":
			return data[CONST.TORRENT_REMAINING];

		case "seeds":
			return data[CONST.TORRENT_SEEDS_CONNECTED];

		case "swarm_seeds":
			return data[CONST.TORRENT_SEEDS_SWARM];

		case "seeds_peers":
			return ((data[CONST.TORRENT_PEERS_SWARM]) ? (data[CONST.TORRENT_SEEDS_SWARM] / data[CONST.TORRENT_PEERS_SWARM]) : Number.MAX_VALUE).toFixed(2);

		case "size":
			return data[CONST.TORRENT_SIZE];

		case "status_code":
			return data[CONST.TORRENT_STATUS];

		case "status_message":
			return data[CONST.TORRENT_STATUS_MESSAGE];

		case "uploaded":
			return data[CONST.TORRENT_UPLOADED];

		case "upspeed":
			return data[CONST.TORRENT_UPSPEED];

		case "url":
			return data[CONST.TORRENT_DOWNLOAD_URL] || "";
		case "hash":
			return data[0];
	}
}