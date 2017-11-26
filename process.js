var io = require("indian-ocean"),
	_ = require("underscore"),
	d3 = require("d3-array");

var out = [];

var data = io.readDataSync("raw.csv");

var stations = Object.keys(data[0]);
stations.shift();

var transposed = [];
stations.forEach(station => {

	data.forEach(row => {

		transposed.push({
			station: station,
			month: row.month.split(" ")[0],
			year: row.month.split(" ")[1],
			value: row[station],
		})

	})

});




io.writeDataSync("data_monthwise.csv", transposed);
//console.log(transposed)

var years = _.chain(transposed).pluck("year").uniq().value();

//var stations = _.chain(transposed).pluck("station").uniq().value();
vsums = []
stations.forEach(station => {
		var station_data = _.where(transposed, {station:station});
  sum = 0
		station_data.forEach(sd => {
			sum += +sd.value
		})
		vsums.push({
			station: station,
			value : sum
		});
})


i = 1
vsums = vsums.sort(function (a,b) {
	// body..
	var x = a['value'];
	 var y = b['value']

	return ((x > y) ? -1 : ((x < y) ? 1 : 0));

});

stations = _.chain(vsums).pluck('station').uniq().value();


console.log(stations);
years.forEach(year => {

	stations.forEach(station => {
		var match_data = _.where(transposed, {year: year, station: station});
		
		var obj = {};
		obj.year = year;
		obj.station = station;
		obj.days = d3.sum(match_data.map(function(d){ return d.value; }));
		obj.available_days = year == "2012" || year == "2016" ? 366 : year == "2017" ? 319 : 365;
		obj.value = obj.days / obj.available_days;
		out.push(obj);
	});

});

//console.log(out);
io.writeDataSync("data.csv", out);