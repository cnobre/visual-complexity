let chart;

d3.csv("data/daily_cases_weekly2.csv").then(function(data) {
    chart = new StackedChart(data);
});

