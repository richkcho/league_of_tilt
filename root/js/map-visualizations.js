/**
 * Created by Richard on 4/14/2016.
 */

var map = {};
map.scale = {};


function initMap() {
    // Domain for the current Summoner's Rift on the in-game mini-map
    map.scale.domain = {
        min: {x: -570, y: -420},
        max: {x: 15220, y: 14980}
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
    console.log(map.scale.xScale(0));
}

function animateMapTimeRegion(playerID, playerLane, playerRole, timeStart, timeEnd) {
    d3.json("data/mapdata/" + playerID + ".json", function(error, mapdata) {

        // filter mapdata by role and lane
        mapdata = mapdata.filter(function(game) {
            return (playerLane == "ANY" || game.Lane == playerLane) &&
                    (playerRole == "ANY" || game.Role == playerRole);
        });

        var color = d3.scale.category20();
        color.domain(
            Array.apply(null, Array(mapdata.length))
                .map(function (_, i) {
                    return i
                }));

        for(var i = 0; i < mapdata.length; ++i) {
            var points = mapdata[i].Frames;

            points = points.filter(function(d, i, arr) {
                return (timeStart == "START" || timeStart <= i) &&
                    (timeEnd == "END" || i <= timeEnd);
            });

            if(points.length > 0) {

                points.forEach(function (d, i, points) {
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

        }

    });
}

function animateMapAll(playerID, playerLane, playerRole) {
    animateMapTimeRegion(playerID, playerLane, playerRole, "START", "END");
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
    if(circle && path) {
        circle.transition()
            .duration(1000 * path[0][0]["__data__"].length)
            .ease("linear")
            .attrTween("transform", translateAlong(path.node()))
            .each("end", transition);
    }
}