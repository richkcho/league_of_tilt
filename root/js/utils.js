/**
 * Created by Richard on 4/15/2016.
 */

var util = {};
util.playerIDs = [];
util.playerIDs_loaded = false;
util.playerIDLookup = {};
util.playerIDLookup_loaded = false;
util.playerNameLookup = {};
util.playerNameLookup_loaded = false;

d3.json("data/player_id_list.json", function(data) {
    util.playerIDs = data;
    util.playerIDs_loaded = true;
    console.log("Player ID's loaded");
});

d3.json("data/player_name_id_map.json", function(data) {
    util.playerIDLookup = data;
    util.playerIDLookup_loaded = true;
    console.log("Player ID lookup loaded");
});

d3.json("data/player_id_name_map.json", function(data) {
    util.playerNameLookup = data;
    util.playerNameLookup_loaded = true;
    console.log("Player name lookup loaded");
});

function playerInfoLoaded() {
    return util.playerIDs_loaded && util.playerIDLookup_loaded && util.playerNameLookup_loaded;
}

function lookupPlayerID(name) {
    return util.playerIDLookup[name.replace(/ /g,'').toLowerCase()];
}

function lookupPlayerName(ID) {
    return util.playerNameLookup[ID.toString()];
}

function filterData(data, playerLane, playerRole) {
    return data.filter(function(d) {
        return (playerLane == "ANY" || d.Lane == playerLane) &&
            (playerRole == "ANY" || d.Role == playerRole);
    });
}

function getAverageStats(stats) {
    var avgstats = {'Assists': 0.0, 'Deaths': 0.0, 'GameDuration': 0.0, 'Kills': 0.0, 'WinRate': 0.0};
    var numstats = stats.length;

    for(var temp = 0; temp < numgames; temp++) {
        avgstats['Assists'] += stats[temp]['Assists'];
        avgstats['Deaths'] += stats[temp]['Deaths'];
        avgstats['GameDuration'] += stats[temp]['GameDuration'];
        avgstats['Kills'] += stats[temp]['Kills'];
        avgstats['WinRate'] += stats[temp]['Winner'];
    }

    for(var key in avgstats) {
        avgstats[key] /= numstats;
    }
    return avgstats;
}