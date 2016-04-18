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
            // radarq.defer(d3.json, "data/playerstats/" + elem + ".json");
            radarq.defer(loadPlayerStats, elem);
        }
    });
    radarq.awaitAll(drawRadarChart);

}

function drawRadarChart(error, players) {
    if(error) {
        throw error;
    }

    var radardata = [];
    players.forEach(function(playerdata, index, arr) {
        var tempdata = {};
        tempdata.className = lookupPlayerName(playerdata["SummonerID"]);
        var axes = [];
        var playeravgs = calculatePlayerAverages(playerdata["Stats"]);
        var playeravgsnorm = normalizeAverageStats(playeravgs, "ANY", "ANY");
        for(var key in playeravgsnorm) {
            axes.push({axis: key, value:playeravgsnorm[key] + 1});
        }
        tempdata.axes = axes;
        radardata.push(tempdata);
    });

    console.log(radardata);
    RadarChart.draw("#radar-chart-container", radardata);
}