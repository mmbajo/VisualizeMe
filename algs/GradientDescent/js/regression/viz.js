var lineObject = new line("#line");
var lossObject = new regression_loss("#contour");
var optObject = new regression_optimizer(lineObject, lossObject, "#cost");

var sample_size = 1000;
var data = lineObject.sample(sample_size);

lineObject.plot(0);
lossObject.plot(data, 0);
optObject.plot(0);


$("#generate").on("click", function () {
	$("#reset").click();
	lineObject.objective(uniform(-10, 10), uniform(-10, 10));
	regression_data = lineObject.sample(sample_size);
	lineObject.plot(0);
	lossObject.plot(regression_data, 0);
	optObject.plot(0);
});

$("#tsize").change(function () {
	$("#reset").click();
	sample_size = parseFloat(this.value);
	regression_data = lineObject.sample(sample_size);
	lineObject.plot(0);
	lossObject.plot(regression_data, 0);
	optObject.plot(0);
});

$("#variance").change(function () {
	$("#reset").click();
	variance = parseFloat(this.value);
	lineObject.noise(variance)
	regression_data = lineObject.sample(sample_size);
	lineObject.plot(0);
	lossObject.plot(data, 0);
	optObject.plot(0);
});

$("#lrate").change(function () {
	$("#reset").click();
	optObject.lrate = parseFloat(this.value);
});

$("#bsize").change(function () {
	$("#reset").click();
	optObject.bsize = parseInt(this.value);
});

$("#train").on("click", function () {
	optObject.start(data);
	d3.select("#stop").classed("hidden", false);
    d3.select("#train").classed("hidden", true);
});

$("#stop").on("click", function () {
	optObject.stop();
	d3.select("#stop").classed("hidden", true);
    d3.select("#train").classed("hidden", false);
});

$("#reset").on("click", function () {
	optObject.reset();
	d3.select("#stop").classed("hidden", true);
    d3.select("#train").classed("hidden", false);
});
