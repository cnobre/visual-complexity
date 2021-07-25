$(document).ready(function(){
    let chart = new Chart_WHO();
    let state = 0;

    $("#btn-area-charts").click(function() {
        if (state === 0)
            chart.Step1();
        else if (state === 1)
            chart.Step2();
        else if (state === 2)
            chart.Step3();
        else if (state === 3)
            chart.Step4();
        else if (state === 4)
            chart.Step5();
        else if (state === 5)
            chart.Step6();
        else if (state === 6)
            chart.Step7();
        else if (state === 7)
            chart.Step8();
        else if (state === 8)
            chart.Step9();
        else if (state === 9)
            chart.Step10();
        else if (state === 10)
            chart.Step11();
        state++;
    });
});