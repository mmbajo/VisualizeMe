class line {

  // constructor
  constructor(div) {

  	this.obj_coef = {'b0': uniform(-10, 10), 'b1': uniform(-10, 10)};
    this.obj_noise = 50;
  	this.net_coef = {'b0': uniform(-10, 10), 'b1': uniform(-10, 10)};
    this.points = [];

    this.pad = 15;
    this.margin = {top: 40, right: 40, bottom: 40, left: 40};
    this.width = 450 - this.margin.left - this.margin.right;
    this.height = 450 - this.margin.top - this.margin.bottom;
    this.svg = addSVG(div, this.width, this.height, this.margin);

    this.n = 250;
    this.m = 250;

    this.x = d3.scaleLinear().domain([-20, 20]).range([0, this.width]);
    this.y = d3.scaleLinear().domain([-20, 20]).range([this.height, 0]);
    this.color = ["#b21f66"];

    this.setup();
  }

  objective(b0, b1) {
    this.obj_coef.b0 = b0;
    this.obj_coef.b1 = b1;
    this.plot(0);
  }

  network(b0, b1) {
    this.net_coef.b0 = b0;
    this.net_coef.b1 = b1;
    this.plot(0);
  }

  noise(variance) {
    this.obj_noise = variance;
  }

  sample(n) {
    this.points = [];
    for (var i = 0; i < n; i++) {
		var point_x = normal(0, 20),
			point_y = this.obj_coef.b0 + this.obj_coef.b1 * point_x + normal(0, this.obj_noise);
		this.points.push({'x': point_x, 'y': point_y, 'label': 0});
    }
    return this.points;
  }

  plot(time) {

    var x1 = this.x.domain()[0],
        x2 = this.x.domain()[1];

    // add function lines
    var line = this.svg.selectAll("line.function")
      .data([this.obj_coef, this.net_coef]);

    line.attr("x1", this.x(x1))
        .attr("y1", (d) => { return this.y(d.b0 + d.b1 * x1); })
        .attr("x2", this.x(x2))
        .attr("y2", (d) => { return this.y(d.b0 + d.b1 * x2); })
        .raise();

    line.enter().append("line")
        .attr("x1", this.x(x1))
        .attr("y1", (d) => { return this.y(d.b0 + d.b1 * x1); })
        .attr("x2", this.x(x2))
        .attr("y2", (d) => { return this.y(d.b0 + d.b1 * x2); })
        .attr("class", "function")
        .attr("id", (d, i) => { return i ? 'estimate' : 'true'; });

    line.exit().remove();

    // add data points

    var circle = this.svg.selectAll("circle").data(this.points);

    circle.attr("cx", (d) => { return this.x(d.x) })
        .attr("cy", (d) => { return this.y(d.y); });

    circle.enter().append("circle")
        .attr("cx", (d) => { return this.x(d.x) })
        .attr("cy", (d) => { return this.y(d.y); })
        .attr("r", 2)
        .attr("fill", (d) => { return this.color[d.label]; })
        .attr("opacity", 0.5)
        .attr("class", "sample");

    circle.exit().remove();


  }

  setup() {
    this.xaxis = this.svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height / 2 + ")")
      .call(d3.axisBottom(this.x).ticks(3, "s"));

    this.yaxis = this.svg.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(" + this.width / 2 + ",0)")
      .call(d3.axisLeft(this.y).ticks(3, "s"));

    this.svg.append("text")
      .text("X")
      .attr("class", "titles")
      .attr("transform", "translate(" + -this.pad + "," + this.height / 2 + ")")
      .attr("text-anchor", "middle");

    this.svg.append("text")
      .text("Y")
      .attr("class", "titles")
      .attr("transform", "translate(" + this.width / 2 + "," + (this.height + this.pad) + ")")
      .attr("alignment-baseline","hanging")
      .attr("text-anchor", "middle");

    this.svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + this.width / 2 + "," + this.height + ")");

    this.legend = d3.legendColor()
      .labelFormat(d3.format(".2g"))
      .title("Loss");

  }

}


// random sample from [a,b]
function uniform(a, b) {
  return Math.random() * (b - a) + a;
}

// random sample from normal(mean, variance)
// https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function normal(mean, variance) {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  var std_norm = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  return mean + Math.sqrt(variance) * std_norm
}
