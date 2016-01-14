
/// pie 그래프는 layout 을 사용 할 수 밖에 없다
// 각도 계산법, 함수 잘 기억

var data = [
			{letter: "A", frequency: 1167},
			{letter: "B", frequency: 1492},
			{letter: "C", frequency: 1782},
			{letter: "D", frequency: 1253},
			{letter: "E", frequency: 1702}
			];


var width = 960, height = 500;
var margin = { top: 20, bottom: 20, left: 25, right: 25};

// data를 가지고 start angle 과 end angle을 자동 계산
var pie = d3.layout.pie().value(function (d) { return d.frequency; })(data);

// color
var color = [];
var range = ['#EF3B39', '#FFCD05', '#69C9CA', '#666699', '#CC3366', '#0099CC',
                '#CCCB31', '#009966', '#C1272D', '#F79420', '#445CA9', '#999999',
                '#402312', '#272361', '#A67C52', '#016735', '#F1AAAF', '#FBF5A2',
                '#A0E6DA', '#C9A8E2', '#F190AC', '#7BD2EA', '#DBD6B6', '#6FE4D0'];

// data doamin key 값과 color 값 매칭 준비
var domain = data.map(function(d, i){ color.push(range[i]); return d.letter; });

// svg 
var svg = d3.select("#graph")
				.append("svg")
				.attr({ width: width, height: height })
				.append("g");

// 비연속적인 scale
var pie_color = d3.scale.ordinal()
        .domain(domain).range(color);

// pie 를 그리기 위해서는 arc 가 필요함

var arc = d3.svg.arc()
			.outerRadius(height/2)
			.startAngle(function(d){ return d.startAngle; })
			.endAngle(function(d){ return d.endAngle; });

var slice = svg.selectAll(".slice")
				.data(pie)
				.enter()
					.append("g")
					.attr("transform", "translate(300, 300)");

slice.append("path")
		.attr({ d: arc, fill: function(d){ return pie_color(d.data.letter); }});





