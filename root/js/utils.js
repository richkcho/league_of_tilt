/**
 * Created by Richard on 4/15/2016.
 */

var util = {};
util.playerIDs = [];
util.playerLookup = {};
util.playerIDs_loaded = false;
util.playerLookup_loaded = false;

d3.json("data/player_id_list.json", function(data) {
    util.playerids = data;
    util.playerIDs_loaded = true;
    console.log("Player ID's loaded");
});

d3.json("data/player_name_id_map.json", function(data) {
    util.playerLookup = data;
    util.playerLookup_loaded = true;
    console.log("Player lookup loaded");
});

function playerInfoLoaded() {
    return util.playerIDs_loaded && util.playerLookup_loaded;
}

function lookupPlayerID(name) {
    return util.playerLookup[name.replace(/ /g,'').toLowerCase()];
}