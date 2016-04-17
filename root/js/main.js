
// draw the radar chart
RadarChart.draw("#radar-chart-container", data);

// draw the map thing
initMap();

// set up trigger for enter key
$("#summoner_name").keyup(function(event){
    if(event.keyCode == 13){
        $("#btnRenderMap").click();
    }
});