let chart;

d3.csv("data/daily_cases_weekly2.csv").then(function(data) {
    chart = new StackedChart(data);
});

$("#btnUpdateVis").click(function() {
    let remaining = chart.UpdateVis();
    if (!remaining) $("#btnUpdateVis").prop("disabled", true);
});
