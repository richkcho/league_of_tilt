RadarChart.draw("#radar-chart-container", data);

// Domain for the current Summoner's Rift on the in-game mini-map
var domain = {
        min: {x: 0, y: 0},
        max: {x: 14820, y: 14881}
    },
    width = 800,
    height = 800,
    bg = "img/map.png";

var xScale = d3.scale.linear()
    .domain([domain.min.x, domain.max.x])
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain([domain.min.y, domain.max.y])
    .range([height, 0]);

var svg = d3.select("#map-container").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

svg.append('image')
    .attr('xlink:href', bg)
    .attr('x', '0')
    .attr('y', '0')
    .attr('width', width)
    .attr('height', height);

function transition(circle, path) {
    circle.transition()
        .duration(10000*3)
        .ease("linear")
        .attrTween("transform", translateAlong(path.node()))
        .each("end", transition);
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

// just use 1496 player as a demo. Should have a dropdown menu and select player id from it
d3.json("data/mapdata/1496.json", function(error, cords) {
    var color = d3.scale.category20();
    color.domain(
        Array.apply(null, Array(cords.length))
            .map(function (_, i) {
                return i
            }));

    for(var i = 0; i < cords.length; ++i) {
        var points = cords[i].Frames;

        points.forEach(function(d, i, points){
            points[i] = [xScale(d[0]), yScale(d[1])]
        });

        var path = svg.append("path")
            .data([points])
            .attr("d", d3.svg.line()
                .tension(0) // Catmull–Rom
                .interpolate("linear"));

        var circle = svg.append("circle")
            .attr("r", 9)
            .attr("fill", color(i))
            .attr("transform", "translate(" + points[0] + ")");

        transition(circle, path);
    }
});
