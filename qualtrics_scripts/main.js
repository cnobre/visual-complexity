function stackedBar(qObj){    	
	var inputId = qObj.questionId;
    console.log('inputId is', inputId)

    let question = d3.select('#' + inputId);
	
	d3.xml("https://raw.githubusercontent.com/cnobre/visual-complexity/barbara/hotel_costs.svg")
		.then((data) => {
        // append the svg to the question div
        question.node().append(data.documentElement);
        
        question.select('svg')
            .attr('width', '600px')
            .attr('height', '200px');
        
        question.select('#vodka_ny').on('click', function(){d3.select(this).style('fill', 'black')})
  })
  .catch((error) => {
    console.error("Error loading the data", error);
  });   
}

function scatter(qObj){    	
	var inputId = qObj.questionId;
  // console.log('inputId is', inputId)
  let question = d3.select('#' + inputId);
	
	d3.xml("url to scatter.svg")
		.then((data) => {
    // append the svg to the question div
    question.node().append(data.documentElement);
  })
  .catch((error) => {
    console.error("Error loading the data", error);
  });   
}
