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
util.playerstats = {};
util.playerstats.mean = {};
util.playerstats.mean_loaded = false;
util.playerstats.std = {};
util.playerstats.std_loaded = false;
util.ignorethese = new Set(["MatchID", "Role", "Lane"]);

//region Load Static Information
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

d3.json("data/player_stats_mean.json", function(data) {
    util.playerstats.mean = data;
    util.playerstats.mean_loaded = true;
    console.log("Player average stats loaded");
});

d3.json("data/player_stats_std.json", function(data) {
    util.playerstats.std = data;
    util.playerstats.std_loaded = true;
    console.log("Player std stats loaded");
});
//endregion

function playerInfoLoaded() {
    return util.playerIDs_loaded && util.playerIDLookup_loaded && util.playerNameLookup_loaded &&
        util.playerstats.mean_loaded && util.playerstats.std_loaded;
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

function calculatePlayerAverages(stats) {
    var avgstats = {};
    var numstats = stats.length;

    for(var temp = 0; temp < numstats; temp++) {
        for(var key in stats[temp]) {
            if(!util.ignorethese.has(key)) {
                if(key in avgstats) {
                    avgstats[key] += stats[temp][key];
                } else {
                    avgstats[key] = stats[temp][key];
                }
            }

        }
    }

    for(var key in avgstats) {
        avgstats[key] /= numstats;
    }
    return avgstats;
}

function getGlobalStats(stats, lane, role) {
    var gstats = {};
    for(var temp = 0; temp < stats.length; temp++) {
        if(stats[temp]["Role"] == role &&
            stats[temp]["Lane"] == lane) {

            for(var key in stats[temp]) {
                if(!util.ignorethese.has(key)) {
                    gstats[key] = stats[temp][key];
                }
            }

            return gstats;
        }
    }

    return null;
}

function getGlobalAverages(lane, role) {
    if(!playerInfoLoaded()) {
        return null;
    }

    return getGlobalStats(util.playerstats.mean, lane, role);
}

function getGlobalStds(lane, role) {
    if(!playerInfoLoaded()) {
        return null;
    }

    return getGlobalStats(util.playerstats.std, lane, role);
}

function normalizeAverageStats(avgstats, lane, role) {
    if(!playerInfoLoaded()) {
        return null;
    }

    var avgstatsnorm = {};
    var globalavgs = getGlobalAverages(lane, role);
    var globalstds = getGlobalStds(lane, role);

    for(var key in avgstats) {
        avgstatsnorm[key] = (avgstats[key] - globalavgs[key])/globalstds[key];
    }

    return avgstatsnorm;
}

function loadPlayerStats(summonerID, callback) {
    d3.json("data/playerstats/" + summonerID + ".json", function(err, data) {
        callback(err, {"SummonerID": summonerID, "Stats": data});
    });
}