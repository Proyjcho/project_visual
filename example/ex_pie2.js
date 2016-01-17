var width = 960, height = 450;
		var margin = { top: 25, bottom: 25, left: 20, right: 20 };

		var svg = d3.select("#graph")
						.append("svg")
						.attr({width: width + margin.left + margin.right,
							 height: height + margin.top + margin.bottom })
						.append("g");

		svg.append("g")
		.attr("class", "slices");

		svg.append("g")
		.attr("class", "labels");

		svg.append("g")
		.attr("class", "values");

		svg.append("g")
		.attr("class", "lines");

		var tooltip = d3.select("#graph").append("div")
				.classed("tooltip", true)
				.style("display", "none");

		var radius = Math.min(width, height)/2;

		var pie = d3.layout.pie()
					.sort(null)
					.value(function(d){
						return d.value;
					});

		var arc = d3.svg.arc()
					.innerRadius(radius * 0.4)
					.outerRadius(radius * 0.8);

		var outerArc = d3.svg.arc()
						.innerRadius(radius * 0.9)
						.outerRadius(radius * 0.9);

		svg.attr("transform", "translate(" + width/2 + "," + height/2 + ")");

		var key = function(d){ return d.data.label; };

		var color = d3.scale.ordinal()
	.domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

		function randomData(){
			var labels = color.domain();
			return labels.map(function(label){
				return { label: label, value: Math.floor(Math.random() * 1000) };
			});
		}

			// var slice = svg.select(".slices").selectAll("path.slice")
			// 				.data(pie(randomData()), key);
			
			// slice.enter()
			// 		.append("path")
			// 		.style("fill", function(d){ return color(d.data.label); })
			// 		.style("stroke", "white")
			// 		.attr("class", "slice")
			// 		.on("mouseover", mouseOver)
			// 		.on("click", tmp);

			// function tmp(){
			// 	change(randomData());			
			// }


		change(randomData());

		d3.select(".randomize").on("click", function(){
			change(randomData());
		});

		function change(data){
			// pie
			var slice = svg.select(".slices").selectAll("path.slice")
							.data(pie(data), key);
			
			slice.enter()
					.append("path")
					.style("fill", function(d){ return color(d.data.label); })
					.style("stroke", "white")
					.attr("class", "slice")
					.on("mouseover", mouseOver)
					.on("mouseout", mouseOut);
					// .on("click", function(){ console.log("ok"); });
			

			slice.transition().duration(1000)
			.attrTween("d", function(d){

				// vers 1 => update
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t){
					return arc(interpolate(t));
				};

				// vers 2 => draw
				// var interpolate = d3.interpolate(
				// 	{ startAngle: d.startAngle, endAngle: d.startAngle },
				// 	{ startAngle: d.startAngle, endAngle: d.endAngle }
				// );

				// return function(t){
				// 	return arc(interpolate(t));
				// }
			})


			slice.exit().remove();



			// text
			var text = svg.select(".labels").selectAll("text")
						.data(pie(data), key);

			text.enter()
				.append("text")
				.attr("dy", ".10em")
				.text(function(d){
					return d.data.label;
				});

			function midAngle(d){
				return d.startAngle + (d.endAngle - d.startAngle)/2;
			}

			text.transition().duration(1000)
				.attrTween("transform", function(d){
					this._current = this._current || d;
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t){
						var d2 = interpolate(t);
						var pos = outerArc.centroid(d2);
						// pos[0] = radius * (midAngle(d2) < Math.PI ? 1: -1);
						// console.dir("translate(" + pos + ")");
						return "translate(" + pos + ")";
					};
				})
				.styleTween("text-anchor", function(d){
					this._current = this._current || d;
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t){
						var d2 = interpolate(t);
						return midAngle(d2) < Math.PI ? "start" : "end";
					};
				});

			var label_value = svg.select(".values").selectAll("text")
								.data(pie(data), key);

			label_value.enter()
					.append("text")
					.attr("dy", ".35em")
					.text(function(d){ return d.data.value; });

			label_value.attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"; })
			// .attr("dy", ".35em")
			.text(function(d){  return d.data.value; });

			text.exit().remove();

			var polyline = svg.select(".lines").selectAll("polyline")
							.data(pie(data), key);

			polyline.enter()
					.append("polyline");

			polyline.transition().duration(1000)
					.attrTween("points", function(d){
						this._current = this._current || d;
						var interpolate = d3.interpolate(this._current, d);
						this._current = interpolate(0);
						return function(t){
							var d2 = interpolate(t);
							var pos = outerArc.centroid(d2);
							// pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
							return [arc.centroid(d2), outerArc.centroid(d2), pos];
						};
					});

			polyline.exit().remove();
		}

		// var tooltip = d3.select(".tooltips")
		// 				.append("div")
		// 				.classed("tooltip", true);

		function mouseOver(d){
			// d3.select(this).attr("stroke","black");
			tooltip.html("<strong>Frequency</strong>" + "<br/>" + d.data.label);
			return tooltip.transition()
				.duration(10)
				.style("position", "absolute")
				.style({"left": (d3.event.pageX + 30) + "px", "top": (d3.event.pageY ) +"px" })
				.style("opacity", "1")
				.style("display", "block");
		}

		function mouseOut(){
				tooltip.transition()
			.duration(2000)
			.style("opacity", 0)
			.style("display", "none");
		}


