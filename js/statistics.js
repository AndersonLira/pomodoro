var ctx = document.getElementById("myChart").getContext('2d');

var data = [];
for( var key in localStorage){
    var now = moment(new Date());
    if(key.indexOf("Total") == 0){
        var dateString = key.replace("Total ","");
        var date = new Date(dateString);
        var m = moment(date);
        var diff = now.diff(m,'days');
        if(diff > 60){
            localStorage.removeItem(key);
        }else{
            var obj = {}
            obj["label"] = date;
            obj["value"] = localStorage.getItem(key);
            data.push(obj);
        }
    }
}
console.log(data);
const ordered = data.sort(function(a,b){
    return a.label - b.label;
});
console.log(ordered);


var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Tokyo",	"Mumbai",	"Mexico City",	"Shanghai",	"Sao Paulo",	"New York",	"Karachi","Buenos Aires",	"Delhi","Moscow"],
        datasets: [{
            label: 'Series 1', // Name the series
            data: [500,	50,	2424,	14040,	14141,	4111,	4544,	47,	5555, 6811], // Specify the data values array
            fill: false,
            borderColor: '#2196f3', // Add custom color border (Line)
            backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
            borderWidth: 1 // Specify bar border width
        }]},
    options: {
      responsive: true, // Instruct chart js to respond nicely.
      maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
    }
});