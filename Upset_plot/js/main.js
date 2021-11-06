// const { time } = require("console");

d3.json('data/dataset.json')
    .then(data => {
        UpSetPlot(data);
        // setUp();
        startTour();
        // animate();
    });


const containerWidth = 1000;
const containerHeight = 350;

const margin = { top: 100, right: 0, bottom: 0, left: 0 };
const innerMargin = 12;
const tooltipMargin = 10;

const width = containerWidth - margin.left - margin.right;
const height = containerHeight - margin.top - margin.left;

padding = 20;
const leftColWidth = 250;
const mainChartWidth = 600;
const rightColWidth = width - leftColWidth - mainChartWidth;

console.log('leftColWidth', leftColWidth)
console.log('MainChartWidth', mainChartWidth)
console.log('rightColWidth', rightColWidth)

const topRowHeight = 130;
const bottomRowHeight = height - topRowHeight - innerMargin;

let timeline = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } })//, onReverseComplete:()=>showStepper()})



function UpSetPlot(data) {
    // Process data: check set membership for each combination
    const allSetIds = data.sets.map(d => d.setId);

    data.sets.map(d => {
        d.id = d.setId.replace(/\s/g, '')
    })

    data.combinations.forEach(combination => {
        combination.sets = [];
        allSetIds.forEach(d => {
            combination.sets.push({
                setId: d,
                member: combination.setMembership.includes(d)
            });
        });

    });

    const IntersectionChartScale = d3.scaleLinear()
        .range([topRowHeight, 0])
        .domain([0, d3.max(data.combinations, (d) => d.value)]);

    // const MainChartScale = d3.scaleLinear()
    //     .range([mainChartWidth-padding, padding])
    //     .domain([0, d3.max(data.sets, (d) => d.size)]);

    const rightColScale = d3.scaleLinear()
        .range([rightColWidth - padding, padding * 2])
        .domain([0, d3.max(data.sets, (d) => d.size)]);


    const xScale = d3.scaleBand()
        .range([0, mainChartWidth - padding])
        .domain(data.combinations.map((d) => d.combinationId))
        .paddingInner(0.2);

    const yScale = d3.scaleBand()
        .range([0, bottomRowHeight])
        .domain(allSetIds)
        .paddingInner(0.2);

    const svg = d3.select('#upset-plot')
        .append('svg')
        .attr('width', containerWidth)
        .attr('height', containerHeight)
        .append('g')
        .attr('class', 'plot-container')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    //pre-compute bar heights and positions for animation purposes; 

    //labels     
    const labels = svg.append('g')
        .attr('class', 'labels')
        .attr('transform', `translate(0, ${topRowHeight + innerMargin})`);


    //hoverBars    
    const hoverBars = svg.append('g')
        .attr('class', 'hoverBars')
        // .attr('transform', `translate(${leftColWidth}, ${topRowHeight + innerMargin})`);
        .attr('transform', `translate(0, ${topRowHeight + innerMargin})`);




    //circles    
    const combinationMatrix = svg.append('g')
        .attr('class', 'setCircles')
        .attr('transform', `translate(${leftColWidth}, ${topRowHeight + innerMargin})`);


    const combinationGroup = combinationMatrix.selectAll('.combination')
        .data(data.combinations)
        .join('g')
        .attr('class', 'combination')
        .style('opacity', 0)
        .attr('id', d => d.combinationId)
        .attr('transform', (d) => `translate(${xScale(d.combinationId) + xScale.bandwidth() / 2.5}, 0)`)


    const circle = combinationGroup.selectAll('circle')
        .data((combination) => combination.sets)
        .join('circle')
        .classed('member', (d) => d.member)
        .attr('cy', (d) => yScale(d.setId) + yScale.bandwidth() / 2.5)
        .attr('r', yScale.bandwidth() / 2)

    //horizontal bars    
    const hbars = svg.append('g')
        .attr('class', 'horizontal-bars')
        // .attr('transform', `translate(${leftColWidth+mainChartWidth}, ${topRowHeight + innerMargin})`);
        .attr('transform', `translate(${leftColWidth}, ${topRowHeight + innerMargin})`);

    //vertical bars    
    const vbars = svg.append('g')
        .attr('class', 'vertical-bars')
        .attr('transform', `translate(${leftColWidth}, 0)`);


    // hoverBars.selectAll('.hoverBar')
    //     .data(data.sets)
    //     .join('rect')
    //     .attr('class', 'hoverBar')
    //     .attr('id', d => {console.log(d); return d.id + 'hoverBar'})
    //     .attr('width', mainChartWidth-padding)
    //     .attr('height', yScale.bandwidth()*1.2)
    //     .attr('x', 0)
    //     .attr('y', (d) => yScale(d.setId))





    //group for whatever is currently being highlighted by the tour;
    svg.append("g").attr("class", "tourGroup")
        .append('rect') //background to create margin around selected elements
        .style('opacity', .2)
        .style('fill', 'red')


    hbars.selectAll('.bar')
        .data(data.sets)
        .join('rect')
        .attr('class', 'bar')
        .attr('id', d => d.id + 'Bar')
        .attr('width', (d) => rightColWidth - rightColScale(d.size))
        .attr('height', yScale.bandwidth())
        .attr('x', 0)
        .attr('y', (d) => yScale(d.setId))
        .on('click', (event, d) => {
            let hoverBar = '#' + d.id + 'hoverBar';
            let bar = '#' + d.id + 'Bar'

            let clicked = !d3.select(bar).classed('clicked')

            d3.select(bar).classed('clicked', clicked)
            d3.select(bar).classed('hovered', clicked)
            d3.select(hoverBar).classed('clicked', clicked)
            d3.select(hoverBar).classed('hovered', clicked)

        })
        .on('mouseover', function (event, d) {
                d3.select('#tooltip')
                .style('opacity', 1)
                .html(d.label.join('<br/>'));
          
            d3.select(this).classed('hovered', true)
            d3.select('#' + d.id + 'hoverBar').classed('hovered', true)
        })
        .on('mousemove', (event) => {
            d3.select('#tooltip')
                .style('left', (event.pageX + tooltipMargin) + 'px')
                .style('top', (event.pageY + tooltipMargin) + 'px')
        })
        .on('mouseout', function (event, d) {
            d3.select('#tooltip').style('opacity', 0);

            let hoverBar = '#' + d.id + 'hoverBar';
            d3.select(hoverBar).classed('hovered', false)
            d3.select(this).classed('hovered', false)
        });



    hbars.selectAll('.bar-label')
        .data(data.sets)
        .join('text')
        .attr('class', 'bar-label')
        .attr('id', d => d.id + 'Label')
        .style("font-family", 'Arial')
        .attr("fill", "#b3b1b1")
        .attr('y', (d) => yScale(d.setId) + yScale.bandwidth() / 2.5)
        .attr('x', (d) => rightColWidth - rightColScale(d.size) + 5)
        // .attr('y', (d) => yScale(d.setId) + yScale.bandwidth()/2.5)
        .attr('dy', '0.35em')
        .text((d) => d.size * 100 + "%");


    labels.selectAll('.set-name')
        .data(data.sets)
        .join('text')
        .attr('class', 'set-name')
        .attr('id', d => d.id + 'Label')
        .attr('text-anchor', 'end')
        .attr('font-size', "14px")

        .attr('x', leftColWidth - padding)
        .attr('y', (d) => yScale(d.setId) + yScale.bandwidth() / 2.5)
        .attr('dy', '0.35em')
        .text((d) => d.setId);

    hoverBars.selectAll('.hoverBar')
        .data(data.sets)
        .join('rect')
        .attr('class', 'hoverBar')
        .attr('id', d => d.id + 'hoverBar')
        .attr('width', d => d3.select('#' + d.id + 'Label').node().getBBox().width)//yScale.bandwidth())
        .attr('height', 5)// yScale.bandwidth())
        .attr('x', d => leftColWidth - padding - d3.select('#' + d.id + 'Label').node().getBBox().width)
        .attr('y', (d) => yScale(d.setId) + yScale.bandwidth() * 0.8)




    vbars.selectAll('.bar')
        .data(data.combinations)
        .join('rect')
        .attr('class', 'bar')
        .attr('id', d => d.setMembership.reduce((acc, cValue) => cValue + acc, '') + 'VBar')
        .attr('height', (d) => topRowHeight - IntersectionChartScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('x', (d) => xScale(d.combinationId))
        .attr('y', (d) => IntersectionChartScale(d.value))
        .style('opacity', 0)
        .on('click', (event, d) => {
            console.log(d)
            // let hoverBar = '#' + d.id + 'hoverBar';
            // let bar = '#' + d.id + 'Bar'

            // let clicked = !d3.select(bar).classed('clicked')

            // d3.select(bar).classed('clicked', clicked)
            // d3.select(bar).classed('hovered', clicked)
            // d3.select(hoverBar).classed('clicked', clicked)
            // d3.select(hoverBar).classed('hovered', clicked)

        })
        .on('mouseover', function (event, d) {

         d3.select('#tooltip')
            .style('opacity', 1)
            .html(d.labels.join('<br/>'));
        
            d3.select('#'+d.combinationId).selectAll('circle').classed('hovered', true)

            let setLabels = d.sets.filter(d=>d.member);
            setLabels.map(l=>{
                let id = l.setId.replace(/\s/g, '')
                d3.select('#' + id + 'hoverBar').classed('hovered', true)
            })
           
            d3.select(this).classed('hovered', true)
           
        })
        .on('mousemove', (event) => {
            d3.select('#tooltip')
                .style('left', (event.pageX + tooltipMargin) + 'px')
                .style('top', (event.pageY + tooltipMargin) + 'px')
        })
        .on('mouseout', function (event, d) {
            d3.select('#tooltip').style('opacity', 0);

            d3.select('#' + d.combinationId).selectAll('circle').classed('hovered', false)

            let setLabels = d.sets.filter(d=>d.member);
            setLabels.map(l=>{
                let id = l.setId.replace(/\s/g, '')
                d3.select('#' + id + 'hoverBar').classed('hovered', false)
            })
 
            d3.select(this).classed('hovered', false)
        });


    // .on('mouseover', (event, d) => {
    //     d3.select('#tooltip')
    //         .style('opacity', 1)
    //         .html(d.labels.join('<br/>'));
    // })
    // .on('mousemove', (event) => {
    //     d3.select('#tooltip')
    //         .style('left', (event.pageX + tooltipMargin) + 'px')
    //         .style('top', (event.pageY + tooltipMargin) + 'px')
    // })
    // .on('mouseout', () => {
    //     d3.select('#tooltip').style('opacity', 0);
    // })
    // .on('click', function (event, d) {
    //     collapseCircles(this)
    // })


    vbars.selectAll('.bar-label')
        .data(data.combinations.filter((d, i) => i < 3 || i == data.combinations.length - 1))
        .join('text')
        .attr('class', 'bar-label')
        .classed('bar-label-keep', ((d, i) => i == 0 || i == 3))
        .attr('id', d => d.setMembership.reduce((acc, cValue) => cValue + acc, '') + 'VBarLabel')

        // .attr('id',)
        .attr('transform', d => `translate(${xScale(d.combinationId)}, ${IntersectionChartScale(d.value)})`)
        .attr('dy', -3)
        // .attr('dx', -xScale.bandwidth()/2)
        .style('opacity', 0)
        .text((d) => d.value + "%");


    svg.append("text")
        .attr("x", 250)
        .attr("y", -20 - (margin.top / 2))
        .attr('class', 'title-text')
        .attr("text-anchor", "start")
        .style("font-size", "22px")
        .style("font-weight", 700)
        .style("text-decoration", "bold")
        .style("font-family", 'Arial')
        .text("Which symptoms do COVID patients have?");

    svg.append("text")
        .attr("x", 250)
        .attr("y", 0 - (margin.top / 2))
        .attr('class', 'title-text_2')
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-weight", 100)
        .style("text-decoration", "bold")
        .style("font-family", 'Arial')
        .text("The users of the COVID Symptoms tracker reported their symptoms.");

    svg.append("text")
        .attr("x", 250)
        .attr("y", 20 - (margin.top / 2))
        .attr('class', 'title-text_2')
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-weight", 100)
        .style("text-decoration", "bold")
        .style("font-family", 'Arial')
        .text("The infographic shows the frequency of each symptom and combination of symptoms.");

}

function setUpAnimations() {

    let steps = [
        { tl: revealCol('#AnosmiaFatigueVBar', '#a'), id: 's2' },
        { tl: revealCol('#CoughAnosmiaFatigueVBar', '#b'), id: 's3' },
        { tl: revealCol('#FatigueVBar', '#c'), id: 's4' },
        { tl: revealAllCols('s5'), id: 's5' },
    ]

    timeline.add('s1') // add step for initial stage

    steps.map(s => addStep(s))
    timeline.add('end') // add step for final stage

}

function addStep(step) {
    timeline
        .add(step.tl, step.id)
        .addPause(step.id + '_done', finishStep)
}


function revealCol(barId, circleId) {
    let g = gsap.utils.selector(circleId);
    let circles = g(".member");   //select all circles that are inside this group. 

    let labelId = barId + 'Label';
    return gsap.timeline()
        // .add(stepId)
        // .call(()=> {console.log('c1',timeline.time()); timeline.reversed() ? finishStep(true): hideStepper()})
        .to('.bar', { stroke: '', duration: 1 })
        .to('.member', { stroke: '', duration: 1 }, "<")
        .to('.horizontal-bars', { x: '+=20' }, "<")
        .to('.bar-label', { opacity: 0, duration: 1 }, "<")
        .to(barId, { opacity: 1, stroke: '#ffa282', strokeWidth: '4px', duration: 1 }, "<")
        .to(circleId, { opacity: 1, duration: 1 }, "<")
        .to(labelId, { opacity: 1, duration: 1 }, "<")
        .to(circles, { stroke: 'rgb(255, 162, 130)', strokeWidth: '2px', duration: 1 }, "<")
    // .addPause(stepId+'Done', finishStep)      


}

function revealAllCols(stepId) {

    return gsap.timeline()
        // .add(stepId)
        // .call(()=> {console.log('c1',timeline.time()); timeline.reversed() ? finishStep(true):''})
        .to('.bar', { stroke: '', duration: 1 })
        .to('.member', { stroke: '', duration: 1 }, "<")
        .to('.bar-label', { opacity: 0, duration: 1 }, "<")
        .to('.horizontal-bars', { x: leftColWidth + mainChartWidth, duration: 1 }, "<")
        .to('.bar', { opacity: 1, duration: 1, stagger: 0.05 }, "<")
        .to('.combination', { opacity: 1, duration: 1, stagger: 0.05 }, "<")
        .to('.bar-label-keep', { opacity: 1, duration: 1 }, ">-0.8")

    // .addPause(stepId+'Done', finishStep)      

}

function startTour() {

    // Add callbacks
    //callback for when user clicks on cough bar
    d3.select("#CoughBar").on("click", () => {
        if (tour.isActive() && tour.getCurrentStep().id == 's2') {
            animateStep()
        }
    });

    d3.select("#CoughVBar").on("click", () => {
        if (tour.isActive() && tour.getCurrentStep().id == 's6') {
            animateStep()
        }
    });

    steps.map(step => {
        tour.addStep(step);
    })

    setUpAnimations()

    tour.start();
    // goToStep('s5')
    // timeline.seek('end')

}



function finishStep(reverse = false) {
    console.log('called Finish Step')

    showStepper();
    let nextStep = getNextStep();
    console.log('next step ', nextStep)

    if (!reverse) {
        // tour.show(nextStep);
        tour.next();
    } else {
        timeline.pause();
    }
}
function hideStepper() {
    gsap.set('.shepherd-content', { 'display': 'none' })
    gsap.set('.shepherd-arrow', { 'display': 'none' })
}

function showStepper() {
    gsap.set('.shepherd-content', { 'display': 'inline' })
    gsap.set('.shepherd-arrow', { 'display': 'inline' })

}

function getNextStep() {
    let allSteps = tour.steps;
    let stepIndex = allSteps.findIndex(d => d.id == tour.getCurrentStep().id)
    returnIndex = stepIndex == allSteps.length - 1 ? stepIndex : stepIndex + 1
    return allSteps[returnIndex].id //next Step
}

function getPrevStep() {
    let allSteps = tour.steps
    let stepIndex = allSteps.findIndex(d => d.id == tour.getCurrentStep().id)
    returnIndex = stepIndex == 0 ? 0 : stepIndex - 1
    return allSteps[returnIndex].id //previous Step
}

function animateStep() {
    hideStepper()
    console.log(' -- Play -- ', tour.getCurrentStep().id);
    // tour.show(nextStep)
    timeline.play(); //(tour.getCurrentStep().id)
}

function goToStep(id) {
    timeline.tweenTo(id + '+=0.0001')
    tour.show(id);
}

function goBack() {

    let prevSte = getPrevStep();
    console.log(' -- Reverse -- ', prevSte);
    // let prevStep = getNextStep();
    // hideStepper();
    // let allSteps = tour.steps;
    // let stepIndex = allSteps.findIndex(d=>d.id == tour.getCurrentStep().id)
    // timeline.tweenTo(allSteps[stepIndex-1].id) //go to previous Step
    // timeline
    //     .reverse()

    timeline.seek(prevSte + '+=0.0001')
    tour.back();



    // .call(()=>console.log('done'))

}








function collapseCircles(element) {

    //isolate data bound to this rect
    let data = d3.select(element).data()[0];
    //use the data.combinationId to select the appropriate circle group
    let group = d3.select('g #' + data.combinationId)

    //scope the animation selector to the group
    let g = gsap.utils.selector(group.node());

    //select all circles that are inside this group. 
    let circles = g("circle");

    let tl = gsap.timeline(); //create the timeline
    tl.to(circles, { opacity: 1, cy: -20, duration: 1 })
        .to(circles, { opacity: 1, cy: 10, duration: 1 });

}
