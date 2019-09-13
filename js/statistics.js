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
labels = [];
data = [];
for(var i in ordered){
    var obj = ordered[i];
    var key = obj.label.getDate() + "-" + (obj.label.getMonth()+1) + "-" + obj.label.getFullYear();
    labels.push(key);

    data.push(parseInt(obj.value));

}


var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Desempenho', // Name the series
            data: data, // Specify the data values array
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