function stackedBar(qObj){    	
	var inputId = qObj.questionId;
    console.log('inputId is', inputId)

    let question = d3.select('#' + inputId);
	
	d3.xml("https://raw.githubusercontent.com/cnobre/visual-complexity/barbara/stackedBar_2.svg")
		.then((data) => {

      //append a canvas to the question div
      let canvasDiv = question.append('canvas'); 
      
      canvasDiv.attr('id', 'sheet')
      .attr('class', 'overlay')
      .style('width', 1000)
      .style ('height', 800)


        // append the svg to the question div
        question.node().append(data.documentElement);
        
        let svg = question.select('svg')
            .attr('width', '600px')
            .attr('height', '200px');

        //set up interactions and callbacks below    
        svg.select('#vodka_ny').on('click', function(){d3.select(this).style('fill', 'black')})

        let canvas = new fabric.Canvas('sheet');
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.width = 5;
            canvas.freeDrawingBrush.color = "#ff0000";
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
    let svg = question.node().append(data.documentElement);
  })
  .catch((error) => {
    console.error("Error loading the data", error);
  });   
}
