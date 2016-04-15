/**
 * Created by Richard on 4/14/2016.
 */

var map = {};
map.scale = {};


function initMap() {
    // Domain for the current Summoner's Rift on the in-game mini-map
    map.scale.domain = {
        min: {x: 0, y: 0},
        max: {x: 14820, y: 14881}
    };

    // svg map settings
    map.width = 800;
    map.height = 800;


    map.scale.xScale = d3.scale.linear()
        .domain([ map.scale.domain.min.x,  map.scale.domain.max.x])
        .range([0, map.width]);

    map.scale.yScale = d3.scale.linear()
        .domain([ map.scale.domain.min.y,  map.scale.domain.max.y])
        .range([map.height, 0]);

    map.svg = d3.select("#map-container").append("svg:svg")
        .attr("width", map.width)
        .attr("height", map.height);

    map.bg = map.svg.append('image')
        .attr('xlink:href', "img/map.png")
        .attr('x', '0')
        .attr('y', '0')
        .attr('width', map.width)
        .attr('height', map.height);

    console.log("Initialized map");
}

function drawMap(playerID, playerLane, playerRole) {
    d3.json("data/mapdata/" + playerID + ".json", function(error, mapdata) {

        // filter mapdata by role and lane
        mapdata = mapdata.filter(function(game) {
            return game.Lane == playerLane && game.Role == playerRole;
        });

        var color = d3.scale.category20();
        color.domain(
            Array.apply(null, Array(mapdata.length))
                .map(function (_, i) {
                    return i
                }));

        for(var i = 0; i < mapdata.length; ++i) {
            var points = mapdata[i].Frames;

            points.forEach(function(d, i, points){
                points[i] = [map.scale.xScale(d[0]), map.scale.yScale(d[1])]
            });

            var path = map.svg.append("path")
                .data([points])
                .attr("d", d3.svg.line()
                    .tension(0) // Catmull–Rom
                    .interpolate("linear"));

            var circle = map.svg.append("circle")
                .attr("r", 9)
                .attr("fill", color(i))
                .attr("transform", "translate(" + points[0] + ")");

            transition(circle, path);
        }
    });
}


// Returns an attrTween for translating along the specified path element.
function translateAlong(path) {
    var l = path.getTotalLength();
    return function(d, i, a) {
        return function(t) {
            var p = path.getPointAtLength(t * l);
            return "translate(" + p.x + "," + p.y + ")";
        };
    };
}

function transition(circle, path) {
    circle.transition()
        .duration(10000*3)
        .ease("linear")
        .attrTween("transform", translateAlong(path.node()))
        .each("end", transition);
}