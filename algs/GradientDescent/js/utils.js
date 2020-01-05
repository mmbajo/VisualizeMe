

function addSVG(div, width, height, margin) {

	var svg = d3.select(div).append("svg")
	    .attr("width", "100%")
	    .attr("height", "100%")
	    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
	    .attr("preserveAspectRatio", "xMidYMid meet")
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	return svg;
}

function updateTextInput(val) {
          document.getElementById('textInput').value=val;
        }
