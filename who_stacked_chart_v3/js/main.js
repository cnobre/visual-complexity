$(document).ready(function() {
    let chart = new Chart_WHO();
    let state = 0;

    $("#btn-area-charts").click(function() {
        /*if (state === 0)
            chart.updateVis();

        else if (state === 1)
            chart.Legend();
            console.log(state)

        state++;*/
        chart.updateVis();
    });



});

