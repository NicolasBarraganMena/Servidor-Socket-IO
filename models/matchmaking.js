const crypto = require('crypto');

let matches = [];
let playersSearching = [];
let startingMatches = [];

const addPlayer = (player) => {
    playersSearching.push(player);

    if(playersSearching.length >= 2){
        let playersReady = playersSearching.splice(0,2);

        let match = new Match(playersReady);
        console.log("new Match Ready:"+ match.id);

        matches.push(match);
        startingMatches.push(match);
    }
}

class Match {
    constructor(players) {
        this.id = crypto.randomBytes(20).toString('hex');
        this.players = players;
    }
}

module.exports = {
    addPlayer,
    startingMatches,
    matches
}