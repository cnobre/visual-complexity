
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


function UpSetPlot(data) {
    // Process data: check set membership for each combination
    const allSetIds = data.sets.map(d => d.setId);

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
    // .attr('transform', `translate(${leftColWidth}, 0)`);


    //group for whatever is currently being highlighted by the tour;
    svg.append("g").attr("class", "tourGroup")
        .append('rect') //background to create margin around selected elements
        .style('opacity', .2)
        .style('fill', 'red')


    hbars.selectAll('.bar')
        .data(data.sets)
        .join('rect')
        .attr('class', 'bar')
        .attr('id', d => d.setId + 'Bar')
        .attr('width', (d) => rightColWidth - rightColScale(d.size))
        .attr('height', yScale.bandwidth())
        .attr('x', 0)
        .attr('y', (d) => yScale(d.setId))
        .on('mouseover', (event, d) => {
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(d.label.join('<br/>'));
        })
        .on('mousemove', (event) => {
            d3.select('#tooltip')
                .style('left', (event.pageX + tooltipMargin) + 'px')
                .style('top', (event.pageY + tooltipMargin) + 'px')
        })
        .on('mouseout', () => {
            d3.select('#tooltip').style('opacity', 0);
        });

    hbars.selectAll('.bar-label')
        .data(data.sets)
        .join('text')
        .attr('class', 'bar-label')
        .attr('id', d => d.setId + 'Label')
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
        .attr('id', d => d.setId + 'Label')
        .attr('text-anchor', 'end')
        .attr('font-size', "14px")

        .attr('x', leftColWidth - padding)
        .attr('y', (d) => yScale(d.setId) + yScale.bandwidth() / 2.5)
        .attr('dy', '0.35em')
        .text((d) => d.setId);


    vbars.selectAll('.bar')
        .data(data.combinations)
        .join('rect')
        .attr('class', 'bar')
        .attr('id', d => d.setMembership.reduce((acc, cValue) => cValue + acc, '') + 'VBar')
        .attr('height', (d) => topRowHeight - IntersectionChartScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('x', (d) => leftColWidth + xScale(d.combinationId))
        .attr('y', (d) => IntersectionChartScale(d.value))
        .style('opacity', 0)
        .on('mouseover', (event, d) => {
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(d.labels.join('<br/>'));
        })
        .on('mousemove', (event) => {
            d3.select('#tooltip')
                .style('left', (event.pageX + tooltipMargin) + 'px')
                .style('top', (event.pageY + tooltipMargin) + 'px')
        })
        .on('mouseout', () => {
            d3.select('#tooltip').style('opacity', 0);
        })
        .on('click', function (event, d) {
            collapseCircles(this)
        })


    // vbars.selectAll('.bar-label')
    // .data(data.combinations)
    // .join('text')
    // .attr('class', 'bar-label')
    // .attr('transform',d=>`translate(${xScale(d.combinationId)}, ${IntersectionChartScale(d.value)})rotate(-90)`)
    // .attr('dy', xScale.bandwidth())
    // .text((d) => d.value + "%");


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

function startTour() {

    // Add callbacks
    //callback for when user clicks on cough bar
    d3.select("#CoughBar").on("click", () => {
        let currentStep = tour.getCurrentStep();
        if (currentStep.id == 's2' && tour.isActive()) {
            revealCol('#AnosmiaFatigueVBar', '#a')

            // reveal1Col();

        }
    });

    d3.select("#CoughVBar").on("click", () => {
        let currentStep = tour.getCurrentStep();
        if (currentStep.id == 's6' && tour.isActive()) {
            tour.next()

            // reveal1Col();

        }
    });
    

    // //move hbars and labels into group for the tour; 
    // let tourGroup = d3.select(".tourGroup");

    // tourGroup.node().append(document.querySelector(".horizontal-bars")); //move the icon into the group wrapper
    // tourGroup.node().append(document.querySelector(".labels")); //move the icon into the group wrapper



    steps.map(step => {
        tour.addStep(step);
    })

    // setTourRect()
    tour.start();

}

function setTourRect() {
    let tourGroup = d3.select(".tourGroup");

    let tourGroupRect = tourGroup.node().getBoundingClientRect();
    console.log(tourGroupRect)

    tourGroup.select('rect')
        .attr('x', tourGroupRect.x - 5)
        .attr('y', tourGroupRect.y - 100)
        .attr('width', tourGroupRect.width + 10)
        .attr('height', tourGroupRect.height)

}
function reveal1Col() {

    //move hbars and labels back outside of tourgroup; 
    d3.select('.plot-container').node().append(document.querySelector(".horizontal-bars")); //move the icon into the group wrapper
    // d3.select('.plot-container').node().append(document.querySelector(".labels")); //move the icon into the group wrapper

    revealCol('#AnosmiaFatigueBar', '#a')


}

function revealCol(barId, circleId) {
    // let tourGroup = d3.select(".tourGroup");

    // //move first vbar into tourgroup; 
    // tourGroup.node().append(document.querySelector(barId));
    // //move the upset circles for the first vbar into tourgroup; 
    // // tourGroup.node().append(document.querySelector("#a")); //move the icon into the group wrapper

       //scope the animation selector to the group
       let g = gsap.utils.selector(circleId);

       //select all circles that are inside this group. 
       let circles = g(".member");

    gsap.timeline()
        .to('.bar',{stroke:'',duration: 1 })
        .to('.member', { stroke:'', duration: 1 }, "<")
        .to('.horizontal-bars', { x: '+=20' },"<")
        .to(barId, { opacity: 1, stroke:'#ffa282', strokeWidth:'4px',duration: 1 }, "<")
        .to(circleId, { opacity: 1, duration: 1 }, "<")
        .to(circles, { stroke:'rgb(255, 162, 130)',strokeWidth:'2px', duration: 1 }, "<")

        .eventCallback("onComplete", () => tour.next())
}

function revealAllCols() {
    gsap.timeline()
        .to('.bar',{stroke:'',duration: 1 })
        .to('.member', { stroke:'', duration: 1 }, "<")
        .to('.horizontal-bars', { x: leftColWidth+mainChartWidth, duration:1 }, "<")
        .to('.bar', { opacity: 1, duration: 1, stagger: 0.05}, "<")
        .to('.combination', { opacity: 1, duration: 1, stagger: 0.05 }, "<")
        .eventCallback("onComplete", () => tour.next())
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
