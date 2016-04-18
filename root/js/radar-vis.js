/**
 * Created by Richard on 4/18/2016.
 */

function renderRadarOutput() {
    if(!playerInfoLoaded()) {
        return null;
    }

    var s1 = lookupPlayerID($("#test_1").val());
    var s2 = lookupPlayerID($("#test_2").val());
    var s3 = lookupPlayerID($("#test_3").val());

    var players = [s1, s2, s3];

    // code below here shouldn't really change, just change how the players array is made
    var radarq = d3_queue.queue();
    players.forEach(function(elem, index, arr) {
        if(elem != null) {
            radarq.defer(loadPlayerStats, elem);
        }
    });
    radarq.awaitAll(function(error, players) {
        return drawRadarChart(error, players, "ANY", "ANY");
    });

}

function drawRadarChart(error, players, lane, role) {
    if(error) {
        throw error;
    }

    // TODO decide on how to handle no good data
    if(players.length == 0) {
        return null;
    }

    var radardata = [];
    players.forEach(function(playerdata, index, arr) {
        radardata.push(convertStatsToRadarData(lookupPlayerName(playerdata["SummonerID"]),
                                calculatePlayerAverages(playerdata["Stats"]), lane, role));
    });

    // consider drawing the average here
    radardata.push(convertStatsToRadarData("Average", getGlobalAverages(lane, role), lane, role));

    RadarChart.draw("#radar-chart-container", radardata);
}

function convertStatsToRadarData(name, stats, lane, role) {
    var tempdata = {};
    tempdata.className = name;
    var axes = [];
    var normedstats = normalizeAverageStats(stats, lane, role);
    for(var key in normedstats) {
        axes.push({axis: key, value: normedstats[key] + 1, rawvalue: stats[key]}); // thus a value of 1 be normal
    }
    tempdata.axes = axes;

    return tempdata;
}