
d3.json('data/dataset.json')
    .then(data => {
        UpSetPlot(data);
        // startTour();
        // animate();
    });


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
    const rightColWidth = width - leftColWidth - mainChartWidth ;

    console.log('leftColWidth',leftColWidth)
    console.log('MainChartWidth',mainChartWidth)
    console.log('rightColWidth',rightColWidth)

    const topRowHeight = 130;
    const bottomRowHeight = height - topRowHeight - innerMargin;

    

    const IntersectionChartScale = d3.scaleLinear()
        .range([topRowHeight, 0])
        .domain([0, d3.max(data.combinations, (d) => d.value)]);

    // const MainChartScale = d3.scaleLinear()
    //     .range([mainChartWidth-padding, padding])
    //     .domain([0, d3.max(data.sets, (d) => d.size)]);

    const rightColScale = d3.scaleLinear()
        .range([rightColWidth-padding, padding*2])
        .domain([0, d3.max(data.sets, (d) => d.size)]);


    const xScale = d3.scaleBand()
        .range([padding, mainChartWidth-padding])
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
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

     //pre-compute bar heights and positions for animation purposes; 

   //labels     
    const labels = svg.append('g')
    .attr('class', 'labels')
    .attr('transform', `translate(0, ${topRowHeight + innerMargin})`);


    //horizontal bars    
    const hbars = svg.append('g')
        .attr('class', 'horizontal-bars')
        .attr('transform', `translate(${leftColWidth+mainChartWidth}, ${topRowHeight + innerMargin})`);

    //vertical bars    
    const vbars = svg.append('g')
        .attr('class', 'vertical-bars')
        .attr('transform', `translate(${leftColWidth}, 0)`);

    //circles    
    const combinationMatrix = svg.append('g')
        .attr('transform', `translate(${leftColWidth}, ${topRowHeight + innerMargin})`);


    const combinationGroup = combinationMatrix.selectAll('.combination')
        .data(data.combinations)
        .join('g')
        .attr('class', 'combination')
        .attr('id', d=>d.combinationId)
        .attr('transform', (d) => `translate(${xScale(d.combinationId) + xScale.bandwidth()/2.5}, 0)`)


    const circle = combinationGroup.selectAll('circle')
        .data((combination) => combination.sets)
        .join('circle')
        .classed('member', (d) => d.member)
        .attr('cy', (d) => yScale(d.setId) + yScale.bandwidth()/2.5)
        .attr('r', yScale.bandwidth()/2)
    
    hbars.selectAll('.bar')
        .data(data.sets)
        .join('rect')
        .attr('class', 'bar')
        .attr('id',d=>d.setId + 'Bar')
        .attr('width', (d) => rightColWidth - rightColScale(d.size))
        .attr('height', yScale.bandwidth())
        .attr('x', 0)
        .attr('y', (d) => yScale(d.setId))
        .on('mouseover', (event,d) => {
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
        .attr('id',d=>d.setId + 'Label')
        .style("font-family",'Arial')
        .attr("fill", "#b3b1b1")
        .attr('y', (d) => yScale(d.setId) + yScale.bandwidth()/2.5)
        .attr('x',(d) => rightColWidth - rightColScale(d.size)+ 5)
        // .attr('y', (d) => yScale(d.setId) + yScale.bandwidth()/2.5)
        .attr('dy', '0.35em')
        .text((d) => d.size*100 + "%");


    labels.selectAll('.set-name')
        .data(data.sets)
        .join('text')
        .attr('class', 'set-name')
        .attr('id',d=>d.setId + 'Label')
        .attr('text-anchor', 'end')
        .attr('font-size', "14px")
        .style("font-family",'Arial')
        .attr('x', leftColWidth)
        .attr('y', (d) => yScale(d.setId) + yScale.bandwidth()/2.5)
        .attr('dy', '0.35em')
        .text((d) => d.setId);


    vbars.selectAll('.bar')
        .data(data.combinations)
        .join('rect')
        .attr('class', 'bar')
        .attr('id',d=>d.setMembership.reduce((acc,cValue)=>cValue + acc,'') + 'Bar')
        .attr('height', (d) => topRowHeight - IntersectionChartScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('x', (d) => xScale(d.combinationId))
        .attr('y', (d) => IntersectionChartScale(d.value))
        .on('mouseover', (event,d) => {
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
        .on('click',function (event,d){
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
        .style("font-family",'Arial')
        .text("Which symptoms do COVID patients have?");

    svg.append("text")
        .attr("x", 250)
        .attr("y", 0 - (margin.top / 2))
        .attr('class', 'title-text_2')
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-weight", 100)
        .style("text-decoration", "bold")
        .style("font-family",'Arial')
        .text("The users of the COVID Symptoms tracker reported their symptoms.");

    svg.append("text")
        .attr("x", 250)
        .attr("y", 20 - (margin.top / 2))
        .attr('class', 'title-text_2')
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-weight", 100)
        .style("text-decoration", "bold")
        .style("font-family",'Arial')
        .text("The infographic shows the frequency of each symptom and combination of symptoms.");

}

function startTour(){

    steps.map(step=>{
        tour.addStep(step);
    })
tour.start();

}

function collapseCircles(element){

    //isolate data bound to this rect
    let data = d3.select(element).data()[0];
    //use the data.combinationId to select the appropriate circle group
    let group = d3.select('g #'+data.combinationId)

    //scope the animation selector to the group
    let g = gsap.utils.selector(group.node());

    //select all circles that are inside this group. 
    let circles = g("circle"); 

    let tl = gsap.timeline(); //create the timeline
    tl.to(circles, {opacity:1, cy: -20, duration: 1})
    .to(circles, {opacity:1, cy: 10, duration: 1});

}
