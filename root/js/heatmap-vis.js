/**
 * Created by Alex on 4/24/2016
 */

var heatmap = {};
heatmap.scale = {};

function initHeatMap() {
	// Domain for the current Summoner's Rift on the in-game mini-map
    heatmap.scale.domain = {
        min: {x: -570, y: -420},
        max: {x: 15220, y: 14980}
    };

    heatmap.colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];

    // svg map settings
    heatmap.width = 500;
    heatmap.height = 500;

    heatmap.gridDenom = 50;

    // may have to change if we make the map not square
    heatmap.gridSize = Math.floor(heatmap.width / heatmap.gridDenom);

    heatmap.scale.xScale = d3.scale.linear()
    	.domain([heatmap.scale.domain.min.x, heatmap.scale.domain.max.x])
    	.range([0, heatmap.width]);

    heatmap.scale.yScale = d3.scale.linear()
    	.domain([heatmap.scale.domain.min.y, heatmap.scale.domain.max.y])
    	.range([heatmap.height, 0]);

    heatmap.svg = d3.select("#heatmap-container").append("svg:svg")
    	.attr("width", heatmap.width)
    	.attr("height", heatmap.width)

    heatmap.bg = heatmap.svg.append('image')
    	.attr('xlink:href', 'img/map.png')
    	.attr('x', '0')
    	.attr('y', '0')
    	.attr('width', heatmap.width)
    	.attr('height', heatmap.height);

    heatmap.initialized = true;
    console.log('heatmap initialized');
}

function renderHeatMapOutput() {
	// if(!heatmap.initialized || !playerInfoLoaded()) {
 //        // wait until stuff has loaded TODO error handling
 //        console.log("Map not loaded yet!");
 //        return;
 //    }

    // temporary summonerID - ZionSpartan
    var summonerID = 19738326;
    var lane = "TOP";
    var role = "SOLO";
    var eventData;

    var locations = new Array(heatmap.gridDenom);
	for (i=0; i < heatmap.gridDenom; i++) {
    	locations[i]=new Array(heatmap.gridDenom);
    	for (var j = 0; j < heatmap.gridDenom; j++) {
    		locations[i][j] = 0;
    	}
    }

    // console.log(tempList)
    // console.log(Math.floor(heatmap.scale.xScale(420)))

    d3.json("data/eventdata/" + summonerID + ".json", function(err, data) {
    	console.log(data);
    	var types = {
    		Kill: {
    			loc: locations
    		},
    		Death: {
    			loc: locations
    		}
    	};
	    function aggregate(element, index, array) {
	    	var arr = element.Frames;
	    	arr.forEach(function(elt, index, array) {
	    		elt.forEach(function(i_elt, i_index, i_array) {
	    			// for each element populate two-dimensional array for heatmap (x,y kill/death locations)
	    			types[i_elt.Type].loc[Math.floor(heatmap.scale.xScale(i_elt.Location[0])/heatmap.gridSize)][Math.floor(heatmap.scale.xScale(i_elt.Location[1])/heatmap.gridSize)]++;
	    		})
	    	});
	    }
	    data.forEach(aggregate);
	    //console.log(types.Kill.loc)

	    // initialize heatmap for kills as test
	    var heatmap.colorScale = d3.scale.quantile()
	    	.domain([0, heatmap.colors.length - 1, d3.max(types.Kill.loc, function (d) {
	    		return d3.max(d, function(elt) {
	    			return elt;
	    		});
	    	});])
	    	.range(heatmap.colors);

	    var tiles = heatmap.svg('.tile')
	    	.data()
    });
}