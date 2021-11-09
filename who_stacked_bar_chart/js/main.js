
d3.csv("data/daily_cases_weekly2.csv")

    .then( function(data) {

        new StackedChart(data)
    });


