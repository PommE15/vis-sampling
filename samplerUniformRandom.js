// Based on http://bl.ocks.org/mbostock/fe3f75700e70416e37cd 

function uniformRandomSampler(width, height, numSamplesMax) {
    var numSamples = 0;
    return function() {
        if (++numSamples > numSamplesMax) return;
        return [Math.random() * width, Math.random() * height];
    };
}
