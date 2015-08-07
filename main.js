(function(){
    'use strict';

var width = 500,
    height = 500,
    radiusArea = 5,
    radiusDot = 0.5;

var points = [
    [100, 120],
    [150, 300],
    [120, 460],
    [350, 300],
    [250, 360]
];

var counts = [
    50, 75, 15, 150, 3
];

var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

var voronoi = d3.geom.voronoi()
                .clipExtent([[0, 0], [width, height]]);
// or polygon.clip, ex. bl.ocks.org/jasondavies/d70baf034448ef7a52d1

var polygons = voronoi(points);


/* Calc PNPOLY */
// http://www.ecse.rpi.edu/~wrf/Research/Short_Notes/pnpoly.html
function pointInPolygon(point, polygon) {
    for (var n = polygon.length, i = 0, j = n - 1, x = point[0], y = point[1], inside = false; i < n; j = i++) {
        var xi = polygon[i][0], yi = polygon[i][1],
            xj = polygon[j][0], yj = polygon[j][1];
        if ((yi > y ^ yj > y) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
}

/* Draw voronoi paths */
function drawPaths() {
    svg.selectAll("path")
    .data(polygons)
    .enter().append("path")
    .attr("class", "path")
    .attr("d", function(d) { return "M" + d.join("L") + "Z"; });
}

/* Draw area circles */
function drawAreas() {
    svg.selectAll("circle")
    .data(points)
    .enter().append("circle")
    .attr("class", "area")
    .attr("transform", function(d) { return "translate(" + d + ")"; })
    .attr("r", function(d, i) { return Math.sqrt(counts[i])*radiusArea; });
}

/* Draw a dot circle */
function drawDot(pt, r) {
    svg.append("circle")
    .attr("class", "dot")
    .attr("cx", pt[0])
    .attr("cy", pt[1])
    .attr("r", r);
}

/* Draw density dots */
function drawDensityDots() {
    var sample, s, count;
    
    polygons.forEach(function(polygon, i) {
        count = 0;
        sample = poissonDiscSampler(width, height, radiusArea, points[i]);
        //sample = bestCandidateSampler(width, height, 10, count[i]*10);
        //sample = uniformRandomSampler(width, height, count[i]*10);

        while (count < counts[i]) {
            s = sample();
            if (!s) return true;
            if (pointInPolygon(s, polygons[i])) {
                drawDot(s, radiusDot);
                count++;
       }} 
    });
}


drawPaths();
drawAreas();
drawDensityDots();

})();
