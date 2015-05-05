var liveCellsMap = {};
var gameStarted = false;
var gridRows = 75;
var gridColumns = 75;
var neighbourCellsMap = {};
var totalCellsMap = {};

function hasElement(liveCellsMap) {	
	for (var key in liveCellsMap) {
		return true;
	}
	return false;
}

function loadTable () {

	// startGameButton - Button click event listener
    var startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener("click", function(e) {
      if (!hasElement(liveCellsMap)) {
      	startGameButton.value = 'Start Game';
      	alert("Turn cells alive by clicking at them & Start the game !!");
      	return;
      }

      startGameButton.value = 'Next Step';

      // if game is already started, then process just the live cells
      if (gameStarted)
      	processLiveCells();
      else {
      	// if the game is not started, initialize the live cells & its neighbours
      	startGame();
      	gameStarted = true;
      }	  
    });

    // resetGameButton - Button click event listener
    var resetGameButton = document.getElementById('resetGameButton');
    resetGameButton.addEventListener("click",function(e) {
    	resetGame();
    }); 

    // game-table - Table click event listener
	var table = document.getElementById('game-table');	
	table.addEventListener('click',tableClick);

	// call the function to build the grid
	var tableData = computeTableStructure(gridRows,gridColumns);
	setInnerHTML(table,tableData);

}

function drawLiveCell(id) {
	document.getElementById(id).setAttribute("class", "my-live-cell");
	liveCellsMap[id] = id;
}

function tableClick(e) {
	drawLiveCell(e.srcElement.id);
}

function computeTableStructure (rows,cols)
{
	var innerTableData='';
	for(var i=0;i<rows;i++)
	{
		var row = "<tr>";
		for(var j=0;j<cols;j++)
		{
			/*Set the table data id in matrix style.
			i.e, id = "row#column"*/
			var id = computeId(i,j);
			row+='<td id=\"' + id +'\" ondragstart=\"dragStart(event)\" draggable=\"true\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\"> </td>';
			totalCellsMap[id] = id;
		}
		row+='</tr>';
		innerTableData+=row;
	}
	return innerTableData;
}

function computeId (i,j) {
			var id= '';
			if (i < 10)
				id+= '0' + i;
			else
				id+= i;			
			id+='#';
			if (j < 10)
				id+= '0' + j;
			else
				id+= j;
	return id;
}

function setInnerHTML (element,htmlbody)
{
	element.innerHTML = htmlbody;
}

function startGame() {
	// start the game
	// build neighbour cells map of every live cell
	buildNeighboursMap();
	// debug method just to print the neighbour cells of each array
	setInterval(function() {processLiveCells();},100);
	//processLiveCells();
}

function buildNeighbours(gridValue) {
	var gridIndex = gridValue.split('#');
	var row = parseInt(gridIndex[0]);
	var column = parseInt(gridIndex[1]);

	// Additional check to exclude the neighbour cells outside the boundary
	var previousRow = row-1>-1 && row-1< gridRows?row-1:null;
	var nextRow = row+1>-1 && row+1< gridRows?row+1:null;
	var previousColumn = column-1>-1 && column-1< gridColumns?column-1:null;
	var nextColumn = column+1>-1 && column+1< gridColumns?column+1:null;

	/*Neighbours for a cell [i,j] aregridId
	Previous row [i-1,j-1] [i-1,j] [i-1,j+1] 
	Same row [i,j-1] [i,j+1] 
	Next row [i+1,j-1] [i+1,j] [i+1,j+1]*/
	var neighbours = [];
	// Previous row
	if (previousRow != null && previousColumn != null)
		neighbours.push(computeId(previousRow,previousColumn));
	if (previousRow != null && column != null)
		neighbours.push(computeId(previousRow,column));
	if (previousRow != null && nextColumn != null)
		neighbours.push(computeId(previousRow,nextColumn));

	// Same row
	if (row != null && previousColumn != null)
		neighbours.push(computeId(row,previousColumn));
	if (row != null && nextColumn != null)
		neighbours.push(computeId(row,nextColumn));

	// Next row
	if (nextRow != null && previousColumn != null)
		neighbours.push(computeId(nextRow,previousColumn));
	if (nextRow != null && column != null)
		neighbours.push(computeId(nextRow,column));
	if (nextRow != null && nextColumn != null)
		neighbours.push(computeId(nextRow,nextColumn));

	if (neighbours.length > 0)
		return neighbours;
	
	return null;
}

function buildNeighboursMap() {
	for (var gridId in liveCellsMap) {
		var gridValue = liveCellsMap[gridId];
		var neighbours = buildNeighbours(gridValue);
		if (neighbours != null)
			neighbourCellsMap[gridValue] = neighbours;
	}
}

function processLiveCells() {
	// debugger;
	for (var currentCell in neighbourCellsMap) {
		var neighbourCells = neighbourCellsMap[currentCell];
		if (!isEligibleToLive(neighbourCells)) {
			makeCellDead(currentCell);
		}
	}

	if (!hasElement(liveCellsMap)) {
		location.reload();
	}
}

function getNeighbourLiveCount(neighbourCells) {
	var liveCellsCount = 0;
	for (var i in neighbourCells) {
		if (isCellAlive(neighbourCells[i])) {
			liveCellsCount++;
		}
	}
	return liveCellsCount;
}

function isEligibleToLive(neighbourCells) {
	var liveCellsCount = getNeighbourLiveCount(neighbourCells);
	if (liveCellsCount <= 3 && liveCellsCount >= 2)
		return true;
	return false;
}

function makeCellsAlive(neighbourCells) {
	
	for (var i in neighbourCells) {
		if (!isCellAlive(neighbourCells[i])) {
			var deadCellsNeighbours = buildNeighbours(neighbourCells[i]);
			if (deadCellsNeighbours != null) {
				var liveCellsAroundDeadCells = 0;
				for (var j in deadCellsNeighbours) {
					if (isCellAlive(deadCellsNeighbours[j])) {
						liveCellsAroundDeadCells ++;
					}
				}
				if (liveCellsAroundDeadCells ==3) {
					makeCellAlive(neighbourCells[i],deadCellsNeighbours);
				}
			}
		}
	}
}

function isCellAlive(currentCell) {
	if(liveCellsMap[currentCell]) {
		return true;
	}
	return false;
}

function resetGame() {
	// Reset the game
	location.reload();
}

function makeCellAlive(currentCell,deadCellsNeighbours) {
	try {
		document.getElementById(currentCell).setAttribute("class", "my-live-cell");
		liveCellsMap[currentCell] = currentCell;
		neighbourCellsMap[currentCell] = deadCellsNeighbours;
	} catch(e) {
		console.log(e);
		console.log(currentCell);
	}
}

function makeCellDead(currentCell) {
	delete liveCellsMap[currentCell];
	delete neighbourCellsMap[currentCell];
	document.getElementById(currentCell).removeAttribute("class", "my-live-cell");
}


function dragStart(event) {
    event.dataTransfer.setData("Text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
    tableClick(event);
}

function drop(event) {
    event.preventDefault();
}