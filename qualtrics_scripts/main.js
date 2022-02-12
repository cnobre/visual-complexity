function interact(this){

    	
	var inputId = 'QR~' + this.questionId;
    console.log('inputId is', inputId)
	
	d3.xml("https://raw.githubusercontent.com/cnobre/visual-complexity/barbara/hotel_costs.svg")
		.then((data) => {
    // do something with the data
		
        console.log('data', data)
        d3.select('#myImage').node().append(data.documentElement);
        
        d3.select('svg')
            .attr('width', '600px')
            .attr('height', '200px');
        
        d3.select('#vodka_ny').on('click', function(){d3.select(this).style('fill', 'black')})
  })
  .catch((error) => {
    console.error("Error loading the data", error);
  });


   
}
