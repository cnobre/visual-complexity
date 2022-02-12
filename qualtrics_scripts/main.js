function interact(data){
    console.log('data is ', data);
		
    d3.select('#myImage').node().append(data.documentElement);
    
    d3.select('svg')
        .attr('width', '600px')
        .attr('height', '200px');
    
    d3.select('#vodka_ny').on('click', function(){d3.select(this).style('fill', 'black')})
}
