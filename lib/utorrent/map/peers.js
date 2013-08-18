

var peerNames = ["ip", "port", "client", "flags", "pcnt", "relevance", "downspeed", "upspeed", "reqs", "waited", "uploaded", "downloaded", "hasherr", "peerdl", "maxup", "maxdown", "queued","inactive", "host_name",]

var mapPeers = module.exports = function(serverName, CONST, hash, peer) {

    var compiledPeer = {}
    for(var i = peerNames.length - 1; i >= 0; i--) {
        compiledPeer[peerNames[i]] = loopPeerName(peerNames[i], CONST, peer)

    };
    compiledPeer['server'] = serverName
    compiledPeer['hash'] = hash;
    return compiledPeer;
}
var loopPeerName = function(name, CONST, peer) {
    switch(name) {
        case"ip":
            return peer[CONST.PEER_IP];
        case"port":
            return peer[CONST.PEER_PORT];
        case"client":
            return peer[CONST.PEER_CLIENT];
        case"flags":
            return peer[CONST.PEER_FLAGS];
        case"pcnt":
            return peer[CONST.PEER_PROGRESS];
        case"relevance":
            return peer[CONST.PEER_PROGRESS];
        case"host_name":
            return peer[2];
        case"downspeed":
            return peer[CONST.PEER_DOWNSPEED];
        case"upspeed":
            return peer[CONST.PEER_UPSPEED];
        case"reqs":
            return peer[CONST.PEER_REQS_OUT] + "|" + peer[CONST.PEER_REQS_IN];
        case"waited":
            return peer[CONST.PEER_WAITED];
        case"uploaded":
            return peer[CONST.PEER_UPLOADED];
        case"downloaded":
            return peer[CONST.PEER_DOWNLOADED];
        case"hasherr":
            return peer[CONST.PEER_HASHERR];
        case"peerdl":
            return peer[CONST.PEER_PEERDL];
        case"maxup":
            return peer[CONST.PEER_MAXUP];
        case"maxdown":
            return peer[CONST.PEER_MAXDOWN];
        case"queued":
            return peer[CONST.PEER_QUEUED];
        case"inactive":
            return peer[CONST.PEER_INACTIVE]
    }
}