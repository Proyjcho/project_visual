

var margin = { top: 20, right: 30, bottom: 30, left: 50};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;


var data = [
			{letter: "A", frequency: 1167},
			{letter: "B", frequency: 1492},
			{letter: "C", frequency: 1782},
			{letter: "D", frequency: 1253},
			{letter: "E", frequency: 1702},
			{letter: "F", frequency: 1288},
			{letter: "G", frequency: 1015},
			{letter: "H", frequency: 1094},
			{letter: "I", frequency: 1966},
			{letter: "J", frequency: 1153},
			{letter: "K", frequency: 1772},
			{letter: "L", frequency: 1025},
			{letter: "M", frequency: 1406},
			{letter: "N", frequency: 1749},
			{letter: "O", frequency: 1507},
			{letter: "P", frequency: 1929},
			{letter: "Q", frequency: 1095},
			{letter: "R", frequency: 1987},
			{letter: "S", frequency: 1327},
			{letter: "T", frequency: 1056},
			{letter: "U", frequency: 1758},
			{letter: "V", frequency: 1978},
			{letter: "W", frequency: 1360},
			{letter: "X", frequency: 1150},
			{letter: "Y", frequency: 1974},
			{letter: "Z", frequency: 1074}

		];

// 비연속적 축적
var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], 0.1);

var y = d3.scale.linear()
			.range([height, 0]);


var xAxis = d3.svg.axis()
				.scale(x)
				.orient('bottom');

var yAxis = d3.svg.axis()
				.scale(y)
				.orient('left')
				// .ticks(10, "%");


// svg
var svg = d3.select("#graph")
				.append("svg")
				.attr({ width: width + margin.left + margin.right,
					 	height: height + margin.top + margin.bottom })
				.append("g")
				.attr({width: width, height: height - margin.bottom})
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// tooltip
// var tooltip = d3.select("#graph").append("div")
// 					.attr("class", "tooltip")
// 					.style("position", "absolute")
// 					.style("z-index", 10)
// 					.style("opacity", 0);
// tooltip use class
var tooltip = d3.select("#graph").append("div")
				.attr("id", "tooltip")
				.classed("tooltip", true);


x.domain(data.map(function(d){ return d.letter; }));
y.domain([0, d3.max(data, function(d){ return d.frequency; })]);

svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0, " + (height) + ")")
	// .transition()
	// .duration(2000)
	.call(xAxis);

svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.text("Frequency");

var bars = svg.selectAll(".bar")
			.data(data)
			.enter();




//// line
// call 로 따로 묶기 
// bars.append("g").classed("lines");
bars.append("line")
	.attr("y1", 0)
	.attr("y2", height)
	.attr("x1", function(d, i){ return x(d.letter) + (x.rangeBand()/2); })
	.attr("x2", function(d, i){ return x(d.letter) + (x.rangeBand()/2); })
	.style("stroke", "red");

// index 0 삭제 해야함 

bars.append("line")
	.data(y.ticks())
	.attr("x1", 0)
	.attr("x2", width)
	.attr("y1", function(d, i){ return y(d); })
	.attr("y2", function(d, i){ return y(d); })
	.style("stroke", "red");	


// text
bars.append("text")
	.attr("class", "text")
	.attr("x", function(d, i){ return x(d.letter) + x.rangeBand(); })
	.attr("y", function(d, i){ return y(d.frequency); })
	.attr("dx", -(x.rangeBand()/2))
	.attr("text-anchor", "middle")
	.attr("style", "fill:#000; font-size: 12; font-family: Helvetica, sans-serif")
	.text(function(d){return d.frequency; });



// bar rect
// bars.append("g");
bars.append("rect")
	.attr("class", "bar")
	// .call(helper.tooltip(function(d){ return d.nick; }))
	.attr("x", function(d){ return x(d.letter); })
	.attr("width", x.rangeBand())
	// .attr("y", function(d){ return y(d.frequency); })
	.attr("y", height)
	.attr("height", 0)
	.on("mouseout", mouseOut)
	.on("mouseover", mouseOver)
	.on("click", update)
	// .attr("height", function(d){ return height - y(d.frequency); });
	.transition()
	.duration(800)
	.attr("y", function(d){ return y(d.frequency); })
	.attr("height", function(d){ return height - y(d.frequency); });



/// tooltip mouseEvent
function mouseOver(d){
	d3.select(this).attr("stroke", "black");
	tooltip.html("<strong>Frequency</strong>" + "<br/>" + d.frequency);

	// console.dir(tooltip.style());
	return tooltip.transition()
			.duration(10)
			.style({"left": (d3.event.pageX - 30) + "px", "top": y(d.frequency) +"px" })
			.style("opacity", "1")
			.style("display", "block");

	
}

function mouseOut(d){
	tooltip.transition()
			.duration(2000)
			.style("opacity", 0)
			.style("display", "none");
}

d3.select("#update").on("click", update);

function update(){

	var rdata = randomData();

	console.dir(rdata);
	svg.selectAll(".bar")
	.data(rdata)
	.transition()
	.duration(800)
	.attr("y", function(d){ return y(d.frequency); })
	.attr("height", function(d){ return height - y(d.frequency); });

	svg.selectAll(".text")
	.data(rdata)
	.transition()
	.duration(800)
	.attr("y", function(d, i){ return y(d.frequency); })
	.text(function(d){ return d.frequency; });


	// .attr("x", function(d, i){ return x(d.letter) + x.rangeBand(); })
	// .attr("y", function(d, i){ return y(d.frequency); })
	// .attr("dx", -(x.rangeBand()/2))
	// .attr("text-anchor", "middle")
	// .attr("style", "fill:#000; font-size: 12; font-family: Helvetica, sans-serif")
	// .text(function(d){return d.frequency; });

}

function randomData(){
	var newData = data;
	return newData.map(function(d, i){
		return { letter: d.letter, frequency: Math.floor(Math.random() * 1500)};
	});
}


