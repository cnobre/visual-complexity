
d3.csv("data/dataset2.csv", (row,i) => {
    row.vaccination_rate = +row.vaccination_rate;
    row.initial_value = +row.initial_value;
    row.subsequent_value = +row.subsequent_value;
    // row.initial_value = d3.randomInt(0, 25)(); //random data generator
    // row.subsequent_value = d3.randomInt(0, 25)(); //random data generator

    return row;

})

    .then(data => {
        new ScatterChart(data)
    });